import { NextResponse } from "next/server";
import type { FinalBriefResult } from "@/lib/final-brief-types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "OPENAI_API_KEY missing" }, { status: 500 });
    const schema = { projectTitle:"", designType:"", briefStatus:"견적 요청 가능 | 착수 가능 | 매니저 확인 필요", quoteReady:true, startReady:false, finalBrief:{ basicInfo:{designItem:"",purpose:"",workType:"",target:""}, spec:{platformOrFormat:"",sizeOrStandard:"",quantity:"",deadline:""}, scope:{planningScope:"",deliverables:"",originalFile:""}, materials:{providedMaterials:[],missingMaterials:[],requiredElements:[]}, designDirection:{toneAndManner:[],reference:[],avoidStyle:[]}, operationRisk:{risks:[],costImpact:[],communicationNotes:[]} }, designerSummary:"", clientSummary:"", managerNotes:[""] };
    const prompt = `JSON만 반환. 스키마: ${JSON.stringify(schema)}. 입력:${JSON.stringify(body)}`;
    const res = await fetch("https://api.openai.com/v1/responses", { method:"POST", headers:{"Content-Type":"application/json", Authorization:`Bearer ${apiKey}`}, body:JSON.stringify({model:"gpt-4.1-mini", input:prompt}) });
    const data = await res.json();
    const text = data.output_text || data.output?.[0]?.content?.[0]?.text || "";
    return NextResponse.json(JSON.parse(text) as FinalBriefResult);
  } catch {
    return NextResponse.json({ error: "최종 의뢰서 생성 중 오류가 발생했어요." }, { status: 500 });
  }
}
