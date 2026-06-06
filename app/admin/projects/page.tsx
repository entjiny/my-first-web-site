import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

export default async function AdminProjectsPage({ searchParams }: { searchParams?: { status?: string } }) {
  const status = searchParams?.status || "all";
  const sb = supabaseAdmin();
  let q = sb.from("projects").select("id, project_title, design_type, status, created_at, brief_analysis(quote_ready,start_ready,risk_flags_json)").order("created_at", { ascending: false }).limit(100);
  if (status !== "all") q = q.eq("status", status);
  const { data } = await q;
  const statuses = ["all", "draft", "pending_info", "ai_review", "manager_review", "ready_for_quote", "submitted"];
  return <main className="app-shell"><h1 className="mb-4 text-xl font-semibold">관리자 · 프로젝트 목록</h1><div className="mb-4 flex flex-wrap gap-2">{statuses.map((s)=><Link key={s} className={`rounded-full border px-3 py-1 text-xs ${status===s?"border-brand-500 bg-brand-50":"border-slate-200"}`} href={`/admin/projects?status=${s}`}>{s}</Link>)}</div><div className="grid gap-2">{data?.map((p:any)=>{const a=p.brief_analysis?.[0];const risk=(a?.risk_flags_json||[]).length;return <div key={p.id} className="card p-4"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold">{p.project_title}</p><p className="text-xs text-slate-500">{p.design_type} · {new Date(p.created_at).toLocaleString()}</p></div><span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{p.status}</span></div><div className="mt-2 grid grid-cols-3 gap-2 text-xs"><p>견적: {a?.quote_ready ? "가능" : "검토"}</p><p>착수: {a?.start_ready ? "가능" : "검토"}</p><p>리스크: {risk}개</p></div><Link className="mt-3 inline-block text-sm text-brand-700" href={`/admin/projects/${p.id}`}>상세 보기</Link></div>})}</div></main>;
}
