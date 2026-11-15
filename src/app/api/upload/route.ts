import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string) || "repair-request-media";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize extension
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const allowedExts = ["jpg", "jpeg", "png", "webp", "pdf", "mp4"];
    if (!allowedExts.includes(ext)) {
      return NextResponse.json(
        { success: false, error: "File type not supported. Please upload an image (JPG, PNG, WebP) or PDF." },
        { status: 400 }
      );
    }

    const filePath = `uploads/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

    let client = null;
    try {
      client = createAdminClient();
    } catch {
      // Admin client not configured, fall back to server client
    }

    if (!client) {
      client = await createClient();
    }

    const { data, error } = await client.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Generate public or signed URL
    const { data: urlData } = client.storage.from(bucket).getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      storagePath: data.path,
      url: urlData.publicUrl,
      fileName: file.name,
      size: file.size,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
