import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function DELETE(req: Request) {
  try {
    const { id, storagePath } = await req.json();
    const sb = supabaseAdmin();
    if (storagePath) await sb.storage.from("project-files").remove([storagePath]);
    if (id) await sb.from("brief_files").delete().eq("id", id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "delete failed" }, { status: 500 });
  }
}
