import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const { projectId, url, label, linkCategory } = await req.json();
  const sb = supabaseAdmin();
  const { data, error } = await sb.from("brief_links").insert({ project_id: projectId, url, label, link_category: linkCategory || "reference" }).select("*").single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, link: data });
}
