export function AppHeader() {
  return (
    <header className="mb-6 flex items-center justify-between rounded-2xl border border-brand-100 bg-white/90 px-4 py-3 shadow-card backdrop-blur">
      <div>
        <p className="text-xs font-medium text-brand-600">AI Design Brief</p>
        <h1 className="text-base font-semibold text-slate-900">디자인 의뢰서</h1>
      </div>
      <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">MVP</span>
    </header>
  );
}
