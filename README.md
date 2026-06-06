# AI 디자인 의뢰서 MVP

## 실행 방법
1. `npm install`
2. `.env.local` 생성
3. `npm run dev`

## 환경변수
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 주요 폴더
- `app/brief/*`: 클라이언트 작성/상태/보완
- `app/admin/*`: 관리자 검토/승인/패키지
- `app/api/*`: OpenAI, Supabase 연동 API
- `components/*`: 공통 UI
- `lib/*`: 타입/스토리지/클라이언트 유틸

## 상태 흐름
`draft -> ai_review -> manager_review -> pending_info -> ready_for_quote -> submitted`

## 현재 MVP 범위
- AI 의뢰서 생성
- 누락 탐지
- 리스크 안내
- 최종 의뢰서 생성
- 관리자 검토
- 버전 관리

## 아직 미구현
- 실제 디자이너 매칭
- 자동 견적
- 카카오톡 연동
- AI 파일 분석
- Vision/VLM 기반 검수
- 자동 일정 관리

## 향후 확장 포인트
- Supabase Auth 관리자 권한
- 견적 발송 자동화
- 파일 분석 파이프라인
