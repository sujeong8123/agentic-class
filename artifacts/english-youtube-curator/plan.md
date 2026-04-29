# English YouTube Curator 구현 계획

## 아키텍처 결정

| 결정 | 선택 | 이유 |
|---|---|---|
| 데이터 저장 | `data/videos.json` + `lib/videos.ts` (fs) | DB 설정 없이 MVP 즉시 가능. 관리자 1명, 동시 쓰기 없음 |
| 관리자 인증 | `ADMIN_PASSWORD` env var + 세션 쿠키 | 환경변수 1개로 충분, 로그인 폼 UX 유지 |
| 라우팅 | Next.js App Router `/[level]` → `/[level]/watch/[videoId]` | URL로 레벨 컨텍스트 보존, 뒤로가기 자연스럽게 동작 |
| 상태 관리 | URL 기반 (`searchParams`) + 컴포넌트 local state | 서버 컴포넌트 최대 활용, 장르 필터는 client state |
| 영상 임베드 | YouTube IFrame API (`youtube-nocookie.com`) | 외부 이탈 차단 불변 규칙 준수 |

## 인프라 리소스

| 리소스 | 유형 | 선언 위치 | 생성 Task |
|---|---|---|---|
| `ADMIN_PASSWORD` | Env var | `.env.local` | Task 5 |

## 데이터 모델

### Video
- `id` string (required) — `crypto.randomUUID()`
- `youtubeId` string (required) — URL에서 추출
- `title` string (required)
- `channelName` string (required)
- `level` `"beginner" | "intermediate" | "advanced"` (required)
- `genre` `"story" | "song" | "science" | "other"` (required)
- `isKidsFriendly` boolean (required)
- `arLevel` number (required) — 예: `1.2`
- `duration` string — 예: `"3:24"`
- `createdAt` string (ISO 8601)

## 필요 스킬

| 스킬 | 적용 Task | 용도 |
|---|---|---|
| next-best-practices | 전체 | RSC boundary, async params, Server Actions |
| shadcn | Task 2–6 | Badge, Button, Card, Dialog(AlertDialog), Input, Select, Field 사용 |
| vercel-react-best-practices | Task 3, 4 | 클라이언트 컴포넌트 분리, 리렌더 최소화 |

## 영향 받는 파일

| 파일 경로 | 변경 유형 | 관련 Task |
|---|---|---|
| `types/video.ts` | New | Task 1 |
| `data/videos.json` | New | Task 1 |
| `lib/videos.ts` | New | Task 1 |
| `lib/videos.test.ts` | New | Task 1 |
| `app/page.tsx` | Modify | Task 2 |
| `app/page.test.tsx` | New | Task 2 |
| `app/[level]/page.tsx` | New | Task 3 |
| `components/english-youtube-curator/VideoCard.tsx` | New | Task 3 |
| `components/english-youtube-curator/VideoGrid.tsx` | New | Task 3 |
| `components/english-youtube-curator/GenreFilter.tsx` | New | Task 3 |
| `components/english-youtube-curator/VideoGrid.test.tsx` | New | Task 3 |
| `app/[level]/watch/[videoId]/page.tsx` | New | Task 4 |
| `components/english-youtube-curator/YoutubePlayer.tsx` | New | Task 4 |
| `components/english-youtube-curator/YoutubePlayer.test.tsx` | New | Task 4 |
| `middleware.ts` | New | Task 5 |
| `app/admin/login/page.tsx` | New | Task 5 |
| `app/admin/page.tsx` | New | Task 5 |
| `app/admin/actions.ts` | New | Task 5, 6 |
| `components/english-youtube-curator/AdminVideoList.tsx` | New | Task 5 |
| `app/admin/add/page.tsx` | New | Task 6 |
| `app/admin/edit/[id]/page.tsx` | New | Task 6 |
| `components/english-youtube-curator/VideoForm.tsx` | New | Task 6 |
| `components/english-youtube-curator/VideoForm.test.tsx` | New | Task 6 |
| `app/layout.tsx` | Modify | Task 2 (메타데이터 YoungYouTube) |

---

## Tasks

### Task 1: Video 타입 + 데이터 접근 레이어 + 시드 데이터

- **담당 시나리오**: 전체 Task의 데이터 기반 (시나리오 직접 없음) — 불변 규칙 "영상 수 제한" 구현 위치
- **크기**: S (3 파일)
- **의존성**: None
- **참조**:
  - next-best-practices — Server Components data patterns
- **구현 대상**:
  - `types/video.ts` — Video 인터페이스
  - `data/videos.json` — 시드 데이터 10개 (레벨·장르 고르게 분포)
  - `lib/videos.ts` — `getVideos()`, `getVideosByLevel()`, `addVideo()`, `updateVideo()`, `deleteVideo()`
  - `lib/videos.test.ts`
- **수용 기준**:
  - [ ] `getVideosByLevel("beginner")` → beginner 영상만 반환, 최대 10개
  - [ ] `addVideo(input)` → 새 Video가 `data/videos.json`에 추가된다
  - [ ] `deleteVideo(id)` → 해당 id의 Video가 `data/videos.json`에서 사라진다
  - [ ] YouTube URL `https://www.youtube.com/watch?v=dQw4w9WgXcQ` → `youtubeId` = `"dQw4w9WgXcQ"` 추출
- **검증**: `bun run test -- lib/videos`

---

### Task 2: 레벨 선택 홈 화면

- **담당 시나리오**: Scenario 1 (partial — 홈 화면의 레벨 버튼 표시까지)
- **크기**: S (2 파일)
- **의존성**: Task 1 (Video 타입)
- **참조**:
  - shadcn — Card, Button (레벨 카드 컴포넌트)
  - wireframe.html — Screen 0 레이아웃 (레벨 카드 3종, 이모지 + AR 범위)
- **구현 대상**:
  - `app/page.tsx` — YoungYouTube 헤더 + 레벨 선택 카드 3종 (Beginner/Intermediate/Advanced)
  - `app/layout.tsx` — metadata title "YoungYouTube" 업데이트
  - `app/page.test.tsx`
- **수용 기준**:
  - [ ] 앱을 열면 "Beginner", "Intermediate", "Advanced" 세 레벨 버튼이 화면에 표시된다
  - [ ] Beginner 카드 클릭 → `/beginner` 경로로 이동한다
  - [ ] Intermediate 카드 클릭 → `/intermediate` 경로로 이동한다
  - [ ] Advanced 카드 클릭 → `/advanced` 경로로 이동한다
- **검증**: `bun run test -- app/page`

---

### Checkpoint: Tasks 1–2 이후
- [ ] 모든 테스트 통과: `bun run test`
- [ ] 빌드 성공: `bun run build`
- [ ] 홈 화면에 레벨 카드 3종이 표시되고 각각 클릭 가능

---

### Task 3: 영상 목록 + 장르 필터 + Kids 배지

- **담당 시나리오**: Scenario 1 (full), Scenario 2 (full), Scenario 4 (full)
- **크기**: M (4 파일)
- **의존성**: Task 1 (데이터 접근), Task 2 (레벨 라우팅)
- **참조**:
  - shadcn — Badge (Kids-friendly 배지), Tabs → Tabs 없으면 커스텀 chip
  - vercel-react-best-practices — 클라이언트 컴포넌트 분리
  - wireframe.html — Screen 1 레이아웃 (genre chips, 2열 그리드, 카드 구조)
- **구현 대상**:
  - `app/[level]/page.tsx` — Server Component, `getVideosByLevel(level)` 호출 후 VideoGrid에 전달
  - `components/english-youtube-curator/VideoCard.tsx` — 썸네일·제목·채널·AR pill·Kids 배지
  - `components/english-youtube-curator/GenreFilter.tsx` — `"use client"`, 장르 chip 필터
  - `components/english-youtube-curator/VideoGrid.tsx` — `"use client"`, GenreFilter + 필터된 VideoCard 그리드
  - `components/english-youtube-curator/VideoGrid.test.tsx`
- **수용 기준**:
  - [ ] `/beginner` 진입 → 장르 필터 탭("전체", "Story", "Song", "Science", "기타")이 표시되며 "전체" 탭이 기본 활성화 상태다
  - [ ] `/beginner` 진입 → Beginner 레벨 영상 카드들이 화면에 표시된다
  - [ ] "Song" 탭 클릭 → Song 장르 카드만 표시되고 다른 장르 카드는 사라진다
  - [ ] "전체" 탭 클릭 → 해당 레벨의 모든 카드가 다시 표시된다
  - [ ] 어떤 필터 조합에서도 표시되는 카드 수는 10개를 초과하지 않는다
  - [ ] `isKidsFriendly=true` 영상 카드 → "Kids" 배지가 카드에 표시된다
  - [ ] `isKidsFriendly=false` 영상 카드 → 카드에 Kids 배지가 없다
- **검증**: `bun run test -- VideoGrid`

---

### Task 4: 앱 내 YouTube 임베드 재생

- **담당 시나리오**: Scenario 3 (full)
- **크기**: S (2 파일)
- **의존성**: Task 3 (영상 목록에서 카드 클릭으로 진입)
- **참조**:
  - [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference)
  - next-best-practices — scripts.md (`next/script` 대신 iframe 직접 사용)
  - wireframe.html — Screen 2 레이아웃 (전체 너비 플레이어, 영상 정보, 뒤로가기)
- **구현 대상**:
  - `app/[level]/watch/[videoId]/page.tsx` — `getVideoById(videoId)`로 Video 조회, YoutubePlayer에 전달
  - `components/english-youtube-curator/YoutubePlayer.tsx` — `"use client"`, `youtube-nocookie.com` iframe 임베드
  - `components/english-youtube-curator/YoutubePlayer.test.tsx`
- **수용 기준**:
  - [ ] 카드 클릭 → URL은 앱 내 라우트(`/[level]/watch/[videoId]`)에 머무르며 YouTube 외부 도메인으로 이동하지 않는다
  - [ ] 플레이어 화면에 `youtube-nocookie.com` iframe이 렌더링된다
  - [ ] 재생 화면에 "← 목록으로" 버튼이 표시된다
  - [ ] "← 목록으로" 클릭 → 이전 영상 목록 화면(`/[level]`)으로 돌아간다
- **검증**: `bun run test -- YoutubePlayer`

---

### Checkpoint: Tasks 3–4 이후
- [ ] 모든 테스트 통과: `bun run test`
- [ ] 빌드 성공: `bun run build`
- [ ] 홈 → 레벨 선택 → 장르 필터 → 카드 클릭 → 임베드 재생 → 목록 복귀 전체 흐름 동작

---

### Task 5: 관리자 인증 + 영상 목록 + 삭제

- **담당 시나리오**: Scenario 6 (full), 불변 규칙: 관리자 격리
- **크기**: M (4 파일)
- **의존성**: Task 1 (deleteVideo)
- **참조**:
  - shadcn — AlertDialog (삭제 확인), Badge, Button
  - next-best-practices — middleware, Server Actions
  - wireframe.html — Screen 4 레이아웃 (목록 행, 삭제 확인 상태, "+ 영상 추가" → Screen 3 진입점)
- **구현 대상**:
  - `middleware.ts` — `/admin` 경로 보호 (`ADMIN_PASSWORD` 쿠키 검증, 미인증 시 `/admin/login` 리다이렉트)
  - `app/admin/login/page.tsx` — 비밀번호 입력 폼 + Server Action (쿠키 발급)
  - `app/admin/page.tsx` — 영상 전체 목록 + 삭제 버튼
  - `app/admin/actions.ts` — `deleteVideoAction(id)` Server Action
  - `components/english-youtube-curator/AdminVideoList.tsx` — `"use client"`, AlertDialog 삭제 확인
- **수용 기준**:
  - [ ] 미인증 상태로 `/admin` 접근 → `/admin/login`으로 리다이렉트된다
  - [ ] 올바른 비밀번호 입력 → `/admin`으로 이동하고 영상 목록이 표시된다
  - [ ] 사용자 화면(`/`, `/beginner` 등)에 `/admin`으로 가는 링크가 없다
  - [ ] 영상 행의 삭제 버튼 클릭 → 삭제 확인 AlertDialog가 표시된다
  - [ ] 확인 버튼 클릭 → 해당 영상이 관리자 목록에서 사라진다
  - [ ] 확인 버튼 클릭 → `/beginner` 등 사용자 화면에서도 해당 영상이 사라진다
- **검증**: `bun run test -- admin` + Human review — `/admin` 직접 접근 시 로그인 화면 확인

---

### Task 6: 관리자 영상 추가 / 수정

- **담당 시나리오**: Scenario 5 (full)
- **크기**: M (4 파일)
- **의존성**: Task 5 (관리자 인증, `actions.ts` 기반)
- **참조**:
  - shadcn — Field, Input, Select, Checkbox, Button (VideoForm 구성)
  - wireframe.html — Screen 3 레이아웃 (URL·제목·레벨·장르·Kids 체크박스, 오류 상태)
- **구현 대상**:
  - `app/admin/add/page.tsx` — VideoForm (빈 초기값)
  - `app/admin/edit/[id]/page.tsx` — VideoForm (기존 Video 값 pre-fill)
  - `components/english-youtube-curator/VideoForm.tsx` — `"use client"`, 유효성 검사 포함 폼
  - `app/admin/actions.ts` — `addVideoAction()`, `updateVideoAction()` 추가
  - `components/english-youtube-curator/VideoForm.test.tsx`
- **수용 기준**:
  - [ ] 필수 필드(URL, 제목, 레벨, 장르) 모두 입력 후 저장 → 영상이 `/beginner` 등 사용자 화면 목록에 나타난다
  - [ ] 필수 필드 하나라도 비어 있고 저장 → 해당 필드 아래 오류 메시지가 표시되고 저장되지 않는다
  - [ ] 유효하지 않은 YouTube URL 입력 후 저장 → "유효하지 않은 YouTube URL입니다" 메시지가 표시된다
  - [ ] 수정 페이지 진입 → 기존 제목·레벨·장르·Kids 값이 폼에 채워져 있다
  - [ ] 수정 후 저장 → 변경된 내용이 사용자 화면에 반영된다
- **검증**: `bun run test -- VideoForm`

---

### Checkpoint: Tasks 5–6 이후
- [ ] 모든 테스트 통과: `bun run test`
- [ ] 빌드 성공: `bun run build`
- [ ] 관리자 로그인 → 영상 추가 → 사용자 화면에서 노출 → 삭제 → 사라짐 전체 흐름 동작

---

## 미결정 항목

- 레벨별 AR 범위 표시 문구 — 영어교육 전문가 검토 전까지 wireframe 값 사용 (Beginner: AR 1.0–2.0, Intermediate: AR 2.0–3.5, Advanced: AR 3.5–5.0)
- 장르 고정 여부 — Story / Song / Science / 기타 4종으로 우선 고정, 관리자 추가 기능은 추후
