"use client";
import { type ClipboardEventHandler, useMemo, useRef, useState } from "react";

type UploadItem = { id: string; file_name?: string; file_size?: number; file_type?: string; public_url?: string; storage_path?: string; url?: string; preview?: string; kind: "image" | "file" | "url"; status?: "uploading" | "done" | "error"; progress?: number };
const imageExt = ["jpg", "jpeg", "png"];
const allowedExt = [...imageExt, "pdf", "ppt", "pptx", "doc", "docx", "txt", "hwp"];

export function MaterialUploadField({ value = [], onChange, urlInput, setUrlInput, projectId = "temp-project" }: { value?: UploadItem[]; onChange: (v: UploadItem[]) => void; urlInput: string; setUrlInput: (v: string) => void; projectId?: string }) {
  const safeValue = useMemo<UploadItem[]>(() => (Array.isArray(value) ? value : []), [value]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploadOne = async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!allowedExt.includes(ext)) return;
    const isImage = imageExt.includes(ext);
    const localId = crypto.randomUUID();
    onChange([...safeValue, { id: localId, file_name: file.name, file_size: file.size, file_type: file.type, kind: isImage ? "image" : "file", preview: isImage ? URL.createObjectURL(file) : undefined, status: "uploading", progress: 30 }]);
    const form = new FormData(); form.append("file", file); form.append("projectId", projectId); form.append("dir", "originals"); form.append("category", "original");
    try {
      const res = await fetch("/api/files/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error();
      const next = safeValue.map((v) => (v.id === localId ? { ...v, ...data.file, status: "done", progress: 100 } : v));
      onChange(next);
    } catch {
      const next = safeValue.map((v) => (v.id === localId ? { ...v, status: "error" } : v));
      onChange(next);
    }
  };

  const addFiles = async (files: FileList | null) => { if (!files) return; setUploading(true); for (const f of Array.from(files)) await uploadOne(f); setUploading(false); };
  const onPaste: ClipboardEventHandler<HTMLDivElement> = (e) => { if (e.clipboardData.files?.length) addFiles(e.clipboardData.files); };

  const addUrls = async () => {
    const urls = urlInput.split("\n").map((v) => v.trim()).filter(Boolean);
    if (!urls.length) return;
    const newItems: UploadItem[] = [];
    for (const u of urls) {
      const res = await fetch("/api/links/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId, url: u, label: u, linkCategory: "reference" }) });
      const data = await res.json();
      newItems.push({ id: data.link?.id || crypto.randomUUID(), url: u, kind: "url", status: res.ok ? "done" : "error" });
    }
    onChange([...(Array.isArray(safeValue) ? safeValue : []), ...newItems]);
    setUrlInput("");
  };

  const remove = async (item: UploadItem) => {
    const currentList = Array.isArray(safeValue) ? safeValue : [];
    if (item.kind !== "url") {
      await fetch("/api/files/delete", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, storagePath: item.storage_path }) });
    }
    onChange(currentList.filter((v) => v.id !== item.id));
  };

  return <div className="space-y-4"><div onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }} onDragOver={(e) => e.preventDefault()} onPaste={onPaste} className="rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/40 p-4 text-center transition hover:bg-brand-50"><p className="text-sm font-medium">작업에 필요한 자료가 있다면 업로드해주세요.</p><button type="button" onClick={() => inputRef.current?.click()} className="mt-3 rounded-full bg-brand-600 px-4 py-2 text-xs font-medium text-white">파일 선택</button><p className="mt-2 text-xs text-slate-500">{uploading ? "업로드 중..." : "Drag & Drop 또는 Ctrl+V 이미지 붙여넣기 지원"}</p><input ref={inputRef} type="file" multiple className="hidden" accept={allowedExt.map((ext) => `.${ext}`).join(",")} onChange={(e) => addFiles(e.target.files)} /></div><div className="rounded-xl border border-slate-200 p-3"><p className="text-xs font-medium">레퍼런스 URL (여러 줄 입력)</p><textarea value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://..." className="mt-2 min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /><button type="button" onClick={addUrls} className="mt-2 rounded-lg border border-brand-200 px-3 py-1 text-xs text-brand-700">URL 추가</button></div><div className="grid gap-2">{(Array.isArray(safeValue) ? safeValue : []).map((item) => <div key={item.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2">{item.kind === "image" ? <img src={item.preview || item.public_url} alt={item.file_name || "image"} className="h-12 w-12 rounded-lg object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xs">{item.kind === "url" ? "URL" : "FILE"}</div>}<div className="min-w-0 flex-1 text-xs text-slate-700"><p>{item.url || item.file_name}</p><p className="text-[11px] text-slate-500">{item.file_type} {item.file_size ? `· ${(item.file_size / 1024).toFixed(1)}KB` : ""}</p>{item.status && <p className="text-[11px]">{item.status === "uploading" ? `업로드 중 ${item.progress || 0}%` : item.status === "done" ? "업로드 완료" : "업로드 실패"}</p>}</div><button type="button" onClick={() => remove(item)} className="text-xs text-rose-600">삭제</button></div>)}</div></div>;
}
