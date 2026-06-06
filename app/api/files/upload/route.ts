import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;
    const projectId = String(form.get("projectId") || "temp-project");
    const category = String(form.get("category") || "etc");
    const dir = String(form.get("dir") || "originals");
    if (!file) return NextResponse.json({ error: "file required" }, { status: 400 });

    const path = `${projectId}/${dir}/${Date.now()}-${file.name}`;
    const sb = supabaseAdmin();
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await sb.storage.from("project-files").upload(path, bytes, { contentType: file.type, upsert: false });
    if (upErr) throw upErr;
    const { data } = sb.storage.from("project-files").getPublicUrl(path);

    const { data: row, error: dbErr } = await sb.from("brief_files").insert({
      project_id: projectId,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      file_category: category,
      storage_path: path,
      public_url: data.publicUrl,
    }).select("*").single();
    if (dbErr) throw dbErr;
    return NextResponse.json({ ok: true, file: row });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "upload failed" }, { status: 500 });
  }
}
