import { NextResponse } from "next/server";
import { getAlertPreview } from "@/lib/server-alerts";

export async function GET() {
  const preview = await getAlertPreview();
  return NextResponse.json(preview);
}
