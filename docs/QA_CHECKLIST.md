# STEP 12 QA 체크리스트

## 1) 클라이언트 플로우
- [ ] 프로젝트 기본 등록
- [ ] 디자인 분야 선택
- [ ] 단계별 질문 입력
- [ ] 자료 업로드
- [ ] 자동 저장
- [ ] 이어쓰기
- [ ] AI 분석
- [ ] 추가 질문
- [ ] 최종 의뢰서 생성
- [ ] 제출 완료
- [ ] 상태 확인

## 2) 관리자 플로우
- [ ] 프로젝트 목록
- [ ] 프로젝트 상세
- [ ] AI 분석 결과 확인
- [ ] 리스크 확인
- [ ] finalBrief 수정
- [ ] 추가 정보 요청
- [ ] 버전 관리
- [ ] 최종 승인
- [ ] 견적 요청 패키지 생성

## 3) 예외 상황
- [ ] 네트워크 실패 fallback
- [ ] OpenAI API 실패 fallback
- [ ] 저장 실패 메시지
- [ ] 파일 업로드 실패 메시지
- [ ] localStorage 손상 대응
- [ ] draft 없음 처리
- [ ] 잘못된 projectId 처리
- [ ] follow-up 링크 만료/미존재 처리

## 4) 모바일 UX
- [ ] iPhone/Android 반응형
- [ ] chip overflow
- [ ] textarea 입력 UX
- [ ] 파일 업로드 UX
- [ ] sticky CTA
- [ ] progress bar

## 5) 접근성/UX
- [ ] disabled 버튼 명확성
- [ ] loading 상태 표시
- [ ] 긴 텍스트 줄바꿈
- [ ] placeholder 문구
- [ ] “잘 모르겠어요” 보조 안내

## 6) 상태 흐름 검증
- [ ] draft -> ai_review -> manager_review -> pending_info -> ready_for_quote -> submitted

## 7) 테스트 데이터
- [ ] PPT 샘플 1개
- [ ] 편집 디자인 샘플 1개
- [ ] 브랜딩 샘플 1개
- [ ] 상세페이지 샘플 1개

## 운영 목표
실제 클라이언트 1~3명이 사용 가능한 수준까지 안정화.
