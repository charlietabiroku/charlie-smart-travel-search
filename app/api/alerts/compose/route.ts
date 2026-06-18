import { NextRequest, NextResponse } from "next/server";
import { buildNotificationDraft } from "@/lib/server-alerts";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { routeId?: string };
  const draft = await buildNotificationDraft(body.routeId);

  if (!draft) {
    return NextResponse.json({ message: "通知対象がありません。" }, { status: 404 });
  }

  return NextResponse.json(draft);
}
