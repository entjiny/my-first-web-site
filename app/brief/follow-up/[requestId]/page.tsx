"use client";
import { useEffect, useState } from "react";

export default function FollowUpPage({ params }: { params: { requestId: string } }) {
  const [reqData, setReqData] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/followup/request?id=${params.requestId}`);
      if (res.ok) setReqData(await res.json());
    })();
  }, [params.requestId]);

  const submit = async () => {
    if (!reqData) return;
    const res = await fetch('/api/followup/submit', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ requestId: params.requestId, projectId: reqData.project_id, answers })});
    if (res.ok) setDone(true);
  };

  if (done) return <main className="app-shell"><section className="card p-6"><h1 className="text-lg font-semibold">보완 정보가 제출되었습니다.</h1><p className="mt-2 text-sm">매니저가 내용을 확인하고 다음 단계를 안내드릴게요.</p></section></main>;
  return <main className="app-shell"><section className="card p-6"><h1 className="text-lg font-semibold">정확한 견적과 빠른 작업 진행을 위해 아래 항목만 추가로 확인이 필요합니다.</h1><p className="mt-2 text-xs text-amber-700">해당 정보가 부족하면 작업 중 추가 소통이 필요하거나, 디자인 비용/일정이 달라질 수 있어요.</p><div className="mt-4 grid gap-3">{(reqData?.requested_fields_json||[]).map((f:any)=><div key={f.field} className="rounded-xl border border-slate-200 p-3"><p className="text-sm font-medium">{f.field}</p><textarea className="mt-2 w-full rounded-lg border border-slate-200 p-2 text-sm" onChange={(e)=>setAnswers((p)=>({...p,[f.field]:e.target.value}))} /><div className="mt-2 flex gap-2"><button type="button" className="rounded-full border px-3 py-1 text-xs" onClick={()=>setAnswers((p)=>({...p,[f.field]:"잘 모르겠어요"}))}>잘 모르겠어요</button><button type="button" className="rounded-full border px-3 py-1 text-xs" onClick={()=>setAnswers((p)=>({...p,[f.field]:"매니저와 상담하고 싶어요"}))}>매니저와 상담하고 싶어요</button></div></div>)}</div><button onClick={submit} className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-sm text-white">보완 답변 제출</button></section></main>;
}
