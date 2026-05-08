import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const { projectId, requestedFields, message } = await req.json();
  const sb = supabaseAdmin();
  const { data, error } = await sb.from("brief_followup_requests").insert({ project_id: projectId, requested_fields_json: requestedFields, message, status: "requested" }).select("id").single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, requestId: data.id, link: `/brief/follow-up/${data.id}` });
}
