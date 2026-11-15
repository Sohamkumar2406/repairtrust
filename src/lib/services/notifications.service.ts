import { createClient } from "../supabase/server";
import { Database, Json } from "../supabase/types";

export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: string,
  metadata?: Json
): Promise<{
  data: NotificationRow | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        title,
        message,
        notification_type: type,
        metadata: metadata || null,
        is_read: false,
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to create notification" };
  }
}

export async function getUserNotifications(userId: string): Promise<{
  data: NotificationRow[] | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to fetch notifications" };
  }
}

export async function markNotificationRead(
  notificationId: string,
  userId: string
): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", userId);

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update notification" };
  }
}
