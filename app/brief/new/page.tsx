"use client";

import { AppHeader } from "@/components/layouts/app-header";
import { MaterialUploadField } from "@/components/brief/material-upload";
import { draftStorage } from "@/lib/draft-storage";
import type { AnalysisResult } from "@/lib/analysis-types";
import type { FinalBriefResult } from "@/lib/final-brief-types";
import { useEffect, useMemo, useState } from "react";

type CategoryKey = "ppt" | "editorial" | "branding" | "detail";
type Question = { id: string; label: string; type: "chips" | "input" | "textarea" | "upload"; options?: string[] };

const categoryInfo: Record<CategoryKey, string> = {
  ppt: "프레젠테이션 디자인(PPT)",
  editorial: "편집 디자인",
  branding: "브랜딩 디자인",
  detail: "상세페이지 디자인",
};

const questions: Question[] = [
  { id: "workType", label: "작업 유형", type: "chips", options: ["신규 제작", "리뉴얼", "수정·보완", "잘 모르겠어요"] },
  { id: "purpose", label: "목적/용도", type: "chips", options: ["홍보", "제안", "판매 전환", "정보 전달", "브랜드 정리"] },
  { id: "materialsUpload", label: "프로젝트 자료 업로드", type: "upload" },
  { id: "extra", label: "추가 요청사항", type: "textarea" },
];

export default function NewBriefPage({ searchParams }: { searchParams?: { type?: string } }) {
  const raw = (searchParams?.type || "ppt") as CategoryKey;
  const designType = categoryInfo[raw] ? raw : "ppt";

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [uploads, setUploads] = useState<Record<string, any[]>>({});
  const [urlInputs, setUrlInputs] = useState<Record<string, string>>({});
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [finalBrief, setFinalBrief] = useState<FinalBriefResult | null>(null);
  const [stage, setStage] = useState<"question" | "loading" | "result">("question");

  const current = questions[step];
  const progress = Math.round(((step + 1) / questions.length) * 100);

  useEffect(() => {
    const draft = draftStorage.load();
    if (!draft) return;
    setAnswers(draft.answers || {});
    setUploads((draft.uploaded_files as Record<string, any[]>) || {});
    setUrlInputs((draft.url_inputs as Record<string, string>) || {});
    setStep(Math.min(draft.current_step || 0, questions.length - 1));
  }, []);

  useEffect(() => {
    setSaveState("saving");
    const t = setTimeout(() => {
      try {
        draftStorage.save({
          project_id: "local-project",
          design_type: designType,
          status: "draft",
          answers,
          custom_answers: {},
          uploaded_files: uploads,
          url_inputs: urlInputs,
          current_step: step,
          updated_at: new Date().toISOString(),
        } as any);
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    }, 600);
    return () => clearTimeout(t);
  }, [answers, uploads, urlInputs, step, designType]);

  const runAnalysis = async () => {
    setStage("loading");
    try {
      const res = await fetch("/api/brief/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designType: categoryInfo[designType], answers, uploads }),
      });
      if (!res.ok) throw new Error();
      setAnalysis(await res.json());
    } catch {
      setAnalysis({
        designType: categoryInfo[designType], overallStatus: "추가 질문 필요", quoteReady: true, startReady: false, score: 60,
        categories: [], missingFields: [], riskFlags: [], followUpQuestions: [], summary: "기본 분석 결과",
      });
    }
    setStage("result");
  };

  const runFinalize = async () => {
    try {
      const res = await fetch("/api/brief/finalize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers, uploads, analysisResult: analysis }) });
      if (!res.ok) throw new Error();
      setFinalBrief(await res.json());
    } catch {
      setFinalBrief({ projectTitle: "디자인 의뢰서", designType: categoryInfo[designType], briefStatus: "매니저 확인 필요", quoteReady: true, startReady: false, finalBrief: { basicInfo: { designItem: "", purpose: "", workType: "", target: "" }, spec: { platformOrFormat: "", sizeOrStandard: "", quantity: "", deadline: "" }, scope: { planningScope: "", deliverables: "", originalFile: "" }, materials: { providedMaterials: [], missingMaterials: [], requiredElements: [] }, designDirection: { toneAndManner: [], reference: [], avoidStyle: [] }, operationRisk: { risks: [], costImpact: [], communicationNotes: [] } }, designerSummary: "요약", clientSummary: "요약", managerNotes: [] });
    }
  };

  return (
    <main className="app-shell">
      <AppHeader />
      <p className="mb-2 text-right text-xs text-slate-500">{saveState === "saving" ? "저장 중..." : saveState === "saved" ? "저장됨 ✓" : saveState === "error" ? "저장 실패" : ""}</p>

      {stage === "question" && (
        <section className="card p-5 sm:p-6">
          <p className="text-xs font-medium text-brand-600">STEP 3/4 · {categoryInfo[designType]}</p>
          <div className="mt-3 h-2 rounded-full bg-brand-100"><div className="h-full rounded-full bg-brand-600" style={{ width: `${progress}%` }} /></div>
          <h3 className="mt-4 text-lg font-semibold">{current.label}</h3>

          {current.type === "chips" && <div className="mt-3 flex flex-wrap gap-2">{current.options?.map((opt) => <button key={opt} onClick={() => setAnswers((p) => ({ ...p, [current.id]: opt }))} className={`rounded-full border px-3 py-1 text-sm ${answers[current.id] === opt ? "bg-brand-600 text-white" : "border-slate-200"}`}>{opt}</button>)}</div>}
          {current.type === "textarea" && <textarea className="mt-3 w-full rounded-lg border border-slate-200 p-2 text-sm" value={answers[current.id] || ""} onChange={(e) => setAnswers((p) => ({ ...p, [current.id]: e.target.value }))} />}
          {current.type === "upload" && <div className="mt-3"><MaterialUploadField value={uploads[current.id] || []} onChange={(v) => setUploads((p) => ({ ...p, [current.id]: v }))} urlInput={urlInputs[current.id] || ""} setUrlInput={(v) => setUrlInputs((p) => ({ ...p, [current.id]: v }))} /></div>}

          <div className="mt-5 flex gap-2">
            <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>이전</button>
            <button className="rounded-lg bg-brand-600 px-3 py-2 text-sm text-white" onClick={() => (step + 1 >= questions.length ? runAnalysis() : setStep((s) => s + 1))}>{step + 1 >= questions.length ? "분석 시작" : "다음"}</button>
          </div>
        </section>
      )}

      {stage === "loading" && <section className="card p-6 text-center"><p className="text-sm">AI가 의뢰서를 분석하고 있어요...</p></section>}

      {stage === "result" && (
        <section className="card p-5 sm:p-6">
          <h3 className="text-lg font-semibold">분석 결과</h3>
          <p className="mt-2 text-sm">상태: {analysis?.overallStatus}</p>
          <p className="text-sm">점수: {analysis?.score}</p>
          <button className="mt-3 rounded-lg bg-brand-600 px-3 py-2 text-sm text-white" onClick={runFinalize}>최종 의뢰서 생성하기</button>
          {finalBrief && <pre className="mt-3 overflow-auto rounded-lg bg-slate-50 p-3 text-xs">{JSON.stringify(finalBrief, null, 2)}</pre>}
        </section>
      )}
    </main>
  );
}
