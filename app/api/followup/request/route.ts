import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  const sb = supabaseAdmin();
  const { data, error } = await sb.from("brief_followup_requests").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}
