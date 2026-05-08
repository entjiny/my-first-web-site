export type DraftStatus = "draft" | "pending_info" | "ai_review" | "manager_review" | "submitted";

export type BriefDraft = {
  project_id: string;
  design_type: string;
  status: DraftStatus;
  answers: Record<string, string>;
  custom_answers: Record<string, string>;
  uploaded_files: Record<string, unknown[]>;
  url_inputs: Record<string, string>;
  current_step: number;
  updated_at: string;
};

const KEY = "ai-brief-draft-v1";

export const draftStorage = {
  load(): BriefDraft | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BriefDraft) : null;
  },
  save(payload: BriefDraft) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(payload));
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(KEY);
  },
};
