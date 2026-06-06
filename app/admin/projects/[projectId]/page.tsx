import Link from "next/link";
import { CopyBlock } from "@/components/admin/copy-block";
import { supabaseAdmin } from "@/lib/supabase";

async function updateStatus(formData: FormData) {
  "use server";
  const id = String(formData.get("project_id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !status) return;
  await supabaseAdmin().from("projects").update({ status }).eq("id", id);
}

export default async function ProjectDetail({ params }: { params: { projectId: string } }) {
  const sb = supabaseAdmin();
  const { data: project } = await sb.from("projects").select("*").eq("id", params.projectId).maybeSingle();
  if (!project) return <main className="app-shell"><p>프로젝트를 찾을 수 없습니다.</p></main>;

  const { data: analysis } = await sb.from("brief_analysis").select("*").eq("project_id", params.projectId).order("created_at", { ascending: false }).limit(1).maybeSingle();
  const { data: final } = await sb.from("brief_final").select("*").eq("project_id", params.projectId).order("submitted_at", { ascending: false }).limit(1).maybeSingle();
  const { data: files } = await sb.from("brief_files").select("*").eq("project_id", params.projectId);
  const { data: links } = await sb.from("brief_links").select("*").eq("project_id", params.projectId);
  const { data: versions } = await sb.from("brief_versions").select("*").eq("project_id", params.projectId).order("version_number", { ascending: false });

  const approved = versions?.find((v: any) => v.approved_at) || versions?.[0];
  const brief = approved?.brief_json || final?.final_brief_json || {};
  const summary = final?.designer_summary || `프로젝트: ${project.project_title}`;
  const quoteMessage = [
    "아래 프로젝트 견적 가능 여부와 예상 작업 기간을 확인해주세요.",
    `프로젝트: ${project.project_title}`,
    `디자인 분야: ${project.design_type}`,
    `납기: ${brief?.spec?.deadline || "협의"}`,
  ].join("\n");
  const fileLinks = (files || []).map((f: any) => `${f.file_name} - ${f.public_url || f.signed_url || ""}`).join("\n");

  return (
    <main className="app-shell">
      <Link href="/admin/projects" className="text-sm text-brand-700">← 목록</Link>
      <h1 className="mt-2 text-xl font-semibold">{project.project_title}</h1>
      <p className="text-sm text-slate-600">{project.design_type} · 상태 {project.status}</p>
      <p className="text-xs text-brand-700">현재 의뢰서 버전: {approved?.version_label || "-"}</p>

      <section className="card mt-4 p-4">
        <h2 className="font-semibold">의뢰서 버전 이력</h2>
        <div className="mt-2 grid gap-2">
          {versions?.map((v: any) => (
            <details key={v.id} className="rounded-lg border border-slate-200 p-2">
              <summary className="cursor-pointer text-sm">{v.version_label} · {new Date(v.created_at).toLocaleString()} · {v.change_source}</summary>
              <p className="mt-1 text-xs text-slate-600">{v.change_summary}</p>
              <pre className="mt-2 overflow-auto text-xs">{JSON.stringify(v.brief_json, null, 2)}</pre>
            </details>
          ))}
        </div>
      </section>

      <section className="card mt-4 p-4">
        <h2 className="font-semibold">디자이너 견적 요청 패키지</h2>
        <div className="mt-2 grid gap-2 text-sm">
          <p><b>작업 개요</b>: {brief?.basicInfo?.designItem || "-"}</p>
          <p><b>제작 범위</b>: {brief?.scope?.planningScope || "-"}</p>
          <p><b>일정</b>: {brief?.spec?.deadline || "-"}</p>
          <p><b>산출물</b>: {brief?.scope?.deliverables || "-"}</p>
        </div>
        <form action={updateStatus} className="mt-3">
          <input type="hidden" name="project_id" value={params.projectId} />
          <button name="status" value="ready_for_quote" className="rounded-lg bg-brand-600 px-3 py-2 text-sm text-white">견적 요청 준비 완료</button>
        </form>
        <div className="mt-3 grid gap-3">
          <CopyBlock label="의뢰서 요약 복사" value={summary} />
          <CopyBlock label="견적 요청 메시지 복사" value={quoteMessage} />
          <CopyBlock label="파일 링크 목록 복사" value={fileLinks} />
        </div>
      </section>

      <section className="card mt-4 p-4"><h2 className="font-semibold">AI 분석 결과</h2><pre className="mt-2 overflow-auto text-xs">{JSON.stringify(analysis?.analysis_json || {}, null, 2)}</pre></section>
      <section className="card mt-4 p-4"><h2 className="font-semibold">최종 의뢰서</h2><pre className="mt-2 overflow-auto text-xs">{JSON.stringify(final || {}, null, 2)}</pre></section>
      <section className="card mt-4 p-4"><h2 className="font-semibold">업로드 파일/링크</h2><pre className="mt-2 overflow-auto text-xs">{JSON.stringify({ files: files || [], links: links || [] }, null, 2)}</pre></section>
    </main>
  );
}
