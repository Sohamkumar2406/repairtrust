import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "bookingId is required" },
        { status: 400 }
      );
    }

    // 1. Get or create conversation for this booking
    let { data: conversation } = await supabase
      .from("conversations")
      .select("id, booking_id")
      .eq("booking_id", bookingId)
      .maybeSingle();

    if (!conversation) {
      // Find booking details to ensure participant validation
      const { data: booking } = await supabase
        .from("bookings")
        .select("id, customer_id, technician_id")
        .eq("id", bookingId)
        .single();

      if (!booking) {
        return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
      }

      const { data: newConv, error: convErr } = await supabase
        .from("conversations")
        .insert({ booking_id: bookingId })
        .select()
        .single();

      if (convErr || !newConv) {
        return NextResponse.json({ success: false, error: convErr?.message || "Failed to create conversation" }, { status: 500 });
      }

      conversation = newConv;

      // Add customer as participant
      await supabase.from("conversation_participants").insert({
        conversation_id: newConv.id,
        user_id: booking.customer_id,
      });

      // Get technician user_id
      const { data: techProfile } = await supabase
        .from("technician_profiles")
        .select("user_id")
        .eq("id", booking.technician_id)
        .single();

      if (techProfile?.user_id && techProfile.user_id !== booking.customer_id) {
        await supabase.from("conversation_participants").insert({
          conversation_id: newConv.id,
          user_id: techProfile.user_id,
        });
      }
    }

    // 2. Fetch messages
    const { data: messages, error: msgErr } = await supabase
      .from("messages")
      .select(`
        id,
        conversation_id,
        sender_id,
        message_text,
        attachment_path,
        is_read,
        created_at,
        sender:profiles!messages_sender_id_fkey(full_name, role, avatar_url)
      `)
      .eq("conversation_id", conversation.id)
      .order("created_at", { ascending: true });

    if (msgErr) {
      // Fallback query if alias fails
      const { data: simpleMessages, error: simpleErr } = await supabase
        .from("messages")
        .select("id, conversation_id, sender_id, message_text, is_read, created_at")
        .eq("conversation_id", conversation.id)
        .order("created_at", { ascending: true });

      if (simpleErr) {
        return NextResponse.json({ success: false, error: simpleErr.message }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        conversationId: conversation.id,
        messages: simpleMessages || [],
      });
    }

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      messages: messages || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { bookingId, messageText } = body;

    if (!bookingId || !messageText?.trim()) {
      return NextResponse.json(
        { success: false, error: "bookingId and messageText are required" },
        { status: 400 }
      );
    }

    // Find conversation
    let { data: conversation } = await supabase
      .from("conversations")
      .select("id")
      .eq("booking_id", bookingId)
      .maybeSingle();

    if (!conversation) {
      const { data: newConv, error: convErr } = await supabase
        .from("conversations")
        .insert({ booking_id: bookingId })
        .select()
        .single();

      if (convErr || !newConv) {
        return NextResponse.json({ success: false, error: convErr?.message || "Failed to init chat" }, { status: 500 });
      }
      conversation = newConv;

      // Add current user to participants
      await supabase.from("conversation_participants").insert({
        conversation_id: newConv.id,
        user_id: user.id,
      });
    }

    // Insert message
    const { data: message, error: msgErr } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversation.id,
        sender_id: user.id,
        message_text: messageText.trim(),
        is_read: false,
      })
      .select()
      .single();

    if (msgErr) {
      return NextResponse.json({ success: false, error: msgErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to send message" },
      { status: 500 }
    );
  }
}
