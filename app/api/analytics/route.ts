import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as {
    eventName?: string;
    pathname?: string;
  };

  const eventName = String(payload.eventName || "page_view").trim();
  const pathname = String(payload.pathname || "/").trim();

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ tracked: false }, { status: 202 });
  }

  const supabase = await createSupabaseServerClient();
  await supabase.from("page_events").insert([{ event_name: eventName, pathname }]);

  return NextResponse.json({ tracked: true }, { status: 201 });
}
