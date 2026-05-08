import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { projectId, designType, answers, uploadedFiles, analysisResult, finalBrief } = await req.json();
    const sb = supabaseAdmin();

    const projectPayload = {
      id: projectId || crypto.randomUUID(),
      project_title: finalBrief?.projectTitle || "디자인 의뢰서",
      design_type: designType,
      client_name: answers?.clientName || null,
      company_name: answers?.companyName || null,
      status: "manager_review",
    };
    const { data: project, error: pErr } = await sb.from("projects").upsert(projectPayload).select("id").single();
    if (pErr) throw pErr;

    await sb.from("brief_drafts").upsert({
      project_id: project.id,
      answers_json: answers,
      uploaded_files_json: uploadedFiles,
      current_step: 999,
      status: "submitted",
    });

    await sb.from("brief_analysis").insert({
      project_id: project.id,
      analysis_json: analysisResult,
      quote_ready: !!analysisResult?.quoteReady,
      start_ready: !!analysisResult?.startReady,
      score: analysisResult?.score || 0,
      missing_fields_json: analysisResult?.missingFields || [],
      risk_flags_json: analysisResult?.riskFlags || [],
    });

    await sb.from("brief_final").insert({
      project_id: project.id,
      final_brief_json: finalBrief?.finalBrief || {},
      designer_summary: finalBrief?.designerSummary || "",
      client_summary: finalBrief?.clientSummary || "",
      manager_notes_json: finalBrief?.managerNotes || [],
    });

    return NextResponse.json({ ok: true, projectId: project.id, status: "manager_review" });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "제출 중 오류" }, { status: 500 });
  }
}
