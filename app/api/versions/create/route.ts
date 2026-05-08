import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const { projectId, briefJson, changeSource, changeSummary, createdBy, versionLabel } = await req.json();
  const sb = supabaseAdmin();
  const { data: last } = await sb.from("brief_versions").select("version_number").eq("project_id", projectId).order("version_number", { ascending: false }).limit(1).maybeSingle();
  const next = (last?.version_number || 0) + 1;
  const { data, error } = await sb.from("brief_versions").insert({ project_id: projectId, version_number: next, version_label: versionLabel || `v${next}`, brief_json: briefJson, change_source: changeSource, change_summary: changeSummary, created_by: createdBy || "system" }).select("*").single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, version: data });
}
