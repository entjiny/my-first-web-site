export type AnalysisResult = {
  designType: string;
  overallStatus: "견적 가능" | "착수 가능" | "추가 질문 필요" | "리스크 있음";
  quoteReady: boolean;
  startReady: boolean;
  score: number;
  categories: { name: string; items: { field: string; value: string; status: "ok" | "question" | "risk" | "missing"; note: string }[] }[];
  missingFields: { field: string; reason: string; impact: string }[];
  riskFlags: { type: string; message: string; severity: "low" | "medium" | "high" }[];
  followUpQuestions: { field: string; question: string; inputType: "text" | "textarea" | "single" | "multi"; options: string[] }[];
  summary: string;
};
