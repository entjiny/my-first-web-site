import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

const statusText: Record<string, string> = {
  draft: "작성 중인 의뢰서입니다.",
  manager_review: "스킬나우 매니저가 의뢰 내용을 검토 중입니다.",
  pending_info: "정확한 견적을 위해 추가 확인이 필요한 항목이 있습니다.",
  ready_for_quote: "디자이너 견적 요청 준비가 완료되었습니다.",
  submitted: "의뢰서 제출이 완료되었습니다.",
};

const steps = ["기본 정보 등록", "세부 의뢰서 작성", "매니저 검토", "디자이너 견적 요청", "견적 안내"];

function stepIndex(status?: string) {
  if (status === "draft") return 1;
  if (status === "manager_review" || status === "pending_info") return 2;
  if (status === "ready_for_quote") return 3;
  if (status === "submitted") return 4;
  return 0;
}

export default async function BriefStatusPage({ params }: { params: { projectId: string } }) {
  const sb = supabaseAdmin();
  const { data: project } = await sb.from("projects").select("*").eq("id", params.projectId).single();
  const { data: final } = await sb.from("brief_final").select("*").eq("project_id", params.projectId).order("submitted_at", { ascending: false }).limit(1).maybeSingle();

  const idx = stepIndex(project?.status);

  const cta = project?.status === "draft"
    ? <Link href="/brief/new" className="rounded-xl bg-brand-600 px-4 py-2 text-sm text-white">이어서 작성하기</Link>
    : project?.status === "pending_info"
      ? <Link href={`/brief/follow-up/${params.projectId}`} className="rounded-xl bg-brand-600 px-4 py-2 text-sm text-white">추가 정보 입력하기</Link>
      : project?.status === "ready_for_quote"
        ? <p className="text-sm text-slate-600">상담 대기 중입니다. 곧 안내드릴게요.</p>
        : <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm">매니저 상담 요청하기</button>;

  return (
    <main className="app-shell">
      <section className="card p-5 sm:p-6">
        <div className="flex items-start justify-between"><div><h1 className="text-lg font-semibold">의뢰 진행 상태</h1><p className="mt-1 text-sm text-slate-600">{statusText[project?.status || "draft"]}</p></div><span className="rounded-full bg-brand-50 px-3 py-1 text-xs text-brand-700">{project?.status}</span></div>
        <div className="mt-4 grid gap-1 text-sm"><p>프로젝트명: {project?.project_title}</p><p>디자인 분야: {project?.design_type}</p><p>제출일: {project?.created_at ? new Date(project.created_at).toLocaleString() : "-"}</p></div>
        <p className="mt-4 rounded-xl bg-brand-50 p-3 text-xs text-brand-700">의뢰서가 자세할수록 견적 정확도가 높아지고, 작업 중 추가 소통이나 비용 변동 가능성을 줄일 수 있어요.</p>
      </section>

      <section className="card mt-4 p-5 sm:p-6">
        <h2 className="text-sm font-semibold">진행 타임라인</h2>
        <ol className="mt-3 grid gap-2">{steps.map((s, i)=><li key={s} className={`rounded-lg border px-3 py-2 text-sm ${i<=idx?"border-brand-300 bg-brand-50":"border-slate-200"}`}>{i+1}. {s}</li>)}</ol>
      </section>

      <section className="card mt-4 p-5 sm:p-6">
        <details>
          <summary className="cursor-pointer text-sm font-semibold">제출 내용 요약 보기</summary>
          <pre className="mt-3 overflow-auto rounded-lg bg-slate-50 p-3 text-xs">{JSON.stringify(final?.final_brief_json || {}, null, 2)}</pre>
        </details>
      </section>

      <section className="mt-4">{cta}</section>
    </main>
  );
}
