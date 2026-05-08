"use client";
import { useState } from "react";

export function CopyBlock({ label, value }: { label: string; value: string }) {
  const [ok, setOk] = useState(false);
  return <div className="rounded-xl border border-slate-200 p-3"><div className="mb-2 flex items-center justify-between"><p className="text-sm font-medium">{label}</p><button type="button" onClick={async()=>{await navigator.clipboard.writeText(value);setOk(true);setTimeout(()=>setOk(false),1200);}} className="rounded-lg border border-brand-200 px-2 py-1 text-xs text-brand-700">{ok?"복사됨":"복사"}</button></div><textarea readOnly value={value} className="min-h-28 w-full rounded-lg border border-slate-200 p-2 text-xs"/></div>;
}
