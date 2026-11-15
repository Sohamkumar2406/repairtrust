import { NextResponse } from "next/server";
import { getActiveCategories } from "@/lib/services/categories.service";

export async function GET() {
  const { data, error } = await getActiveCategories();

  if (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories", details: error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data,
  });
}
