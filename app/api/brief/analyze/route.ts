import { NextResponse } from "next/server";
import type { AnalysisResult } from "@/lib/analysis-types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "OPENAI_API_KEY missing" }, { status: 500 });

    const prompt = `당신은 디자인 의뢰서 분석 매니저입니다. 반드시 JSON만 반환하세요. 스키마: ${JSON.stringify({ designType: "", overallStatus: "견적 가능|착수 가능|추가 질문 필요|리스크 있음", quoteReady: true, startReady: false, score: 0, categories: [{ name: "작업 개요", items: [{ field: "", value: "", status: "ok|question|risk|missing", note: "" }] }], missingFields: [{ field: "", reason: "", impact: "" }], riskFlags: [{ type: "", message: "", severity: "low|medium|high" }], followUpQuestions: [{ field: "", question: "", inputType: "text|textarea|single|multi", options: [] }], summary: "" })} . followUpQuestions는 최대 3개. 입력 데이터: ${JSON.stringify(body)}`;

    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "gpt-4.1-mini", input: prompt }),
    });
    const data = await res.json();
    const text = data.output_text || data.output?.[0]?.content?.[0]?.text || "";
    const parsed = JSON.parse(text) as AnalysisResult;
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "분석 중 오류가 발생했어요." }, { status: 500 });
  }
}
