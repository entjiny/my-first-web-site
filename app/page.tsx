import Link from "next/link";
import { AppHeader } from "@/components/layouts/app-header";

const categories = [
  {
    title: "프레젠테이션 디자인(PPT)",
    description: "제안서·IR·보고용 프레젠테이션 디자인",
    emoji: "📊",
    href: "/brief/new?type=ppt",
  },
  {
    title: "편집 디자인",
    description: "명함·리플렛·브로슈어 등 인쇄/편집물 디자인",
    emoji: "📰",
    href: "/brief/new?type=editorial",
  },
  {
    title: "브랜딩 디자인",
    description: "로고 및 브랜드 톤앤매너 방향 수립",
    emoji: "✨",
    href: "/brief/new?type=branding",
  },
  {
    title: "상세페이지 디자인",
    description: "상품/서비스 판매 전환을 위한 상세페이지",
    emoji: "🛍️",
    href: "/brief/new?type=detail",
  },
];

export default function HomePage() {
  return (
    <main className="app-shell">
      <AppHeader />

      <section className="card p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-brand-600">STEP 1/4</p>
            <h2 className="mt-1 text-lg font-semibold">디자인 분야를 선택해주세요</h2>
            <p className="mt-1 text-sm text-slate-600">선택한 분야에 맞춰 다음 단계 질문이 자동 구성됩니다.</p>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">자동 저장됨</span>
        </div>

        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-brand-100">
            <div className="h-full w-1/4 rounded-full bg-brand-600" />
          </div>
          <p className="mt-2 text-xs text-slate-500">진행률 25% · 마지막 저장: 방금 전</p>
        </div>
      </section>

      <section className="mt-5 grid gap-3 sm:gap-4">
        {categories.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="card group p-4 transition duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-300"
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-xl">{item.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <span className="text-sm font-medium text-brand-600 transition group-hover:translate-x-0.5">선택</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
