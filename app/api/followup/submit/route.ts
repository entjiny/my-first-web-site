import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const { requestId, projectId, answers } = await req.json();
  const sb = supabaseAdmin();
  const { error: aErr } = await sb.from("brief_followup_answers").insert({ request_id: requestId, project_id: projectId, answers_json: answers });
  if (aErr) return NextResponse.json({ ok: false, error: aErr.message }, { status: 500 });
  await sb.from("brief_followup_requests").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", requestId);
  await sb.from("projects").update({ status: "ai_review" }).eq("id", projectId);
  return NextResponse.json({ ok: true });
}
