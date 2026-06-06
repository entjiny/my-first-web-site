import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  let projectId:string|undefined, versionId:string|undefined;
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) { const body = await req.json(); projectId = body.projectId; versionId = body.versionId; }
  else { const form = await req.formData(); projectId = String(form.get("projectId")||""); versionId = String(form.get("versionId")||""); }
  const sb = supabaseAdmin();
  const { data: version, error } = await sb.from("brief_versions").select("*").eq("id", versionId).single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  await sb.from("brief_versions").update({ approved_at: new Date().toISOString(), change_source: "final_approved" }).eq("id", versionId);
  await sb.from("projects").update({ status: "ready_for_quote" }).eq("id", projectId);
  await sb.from("brief_final").upsert({ project_id: projectId, final_brief_json: version.brief_json, designer_summary: "승인 버전 기준", client_summary: "최종 승인된 의뢰서입니다.", manager_notes_json: ["version approved"] });
  return NextResponse.json({ ok: true });
}
