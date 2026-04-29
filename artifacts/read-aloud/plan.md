# Read Aloud 구현 계획

## 아키텍처 결정

| 결정 | 선택 | 이유 |
|---|---|---|
| 데이터 함수 위치 | `lib/videos.ts`에 `getReadAloudVideos` 추가 | 기존 `getVideosByLevel` 패턴 준수 |
| ReadAloudSection 컴포넌트 유형 | Server Component | 클라이언트 상태 불필요, props로 videos 수신 |
| VideoCard 재사용 여부 | 기존 `VideoCard` 재사용 | 동일한 카드 UI — 중복 구현 없음 |
| 필터 로직 | 데이터 레이어(`lib/`)에서 처리 | 컴포넌트가 필터 규칙을 알지 않아도 됨 |

## 인프라 리소스

None

## 데이터 모델

기존 `Video` 타입 변경 없음. 시드 데이터(`data/videos.json`)에 Read Aloud 영상 추가만 수행.

## 필요 스킬

| 스킬 | 적용 Task | 용도 |
|---|---|---|
| next-best-practices (rsc-boundaries) | Task 3 | ReadAloudSection을 Server Component로 올바르게 배치 |
| shadcn (styling) | Task 3 | 섹션 헤더 스타일 |

## 영향 받는 파일

| 파일 경로 | 변경 유형 | 관련 Task |
|---|---|---|
| `lib/videos.ts` | Modify | Task 1 |
| `lib/videos.test.ts` | Modify | Task 1 |
| `data/videos.json` | Modify | Task 2 |
| `components/english-youtube-curator/ReadAloudSection.tsx` | New | Task 3 |
| `components/english-youtube-curator/ReadAloudSection.test.tsx` | New | Task 3 |
| `app/[level]/page.tsx` | Modify | Task 3 |

---

## Tasks

### Task 1: getReadAloudVideos 데이터 함수

- **담당 시나리오**: S-1 (데이터 레이어), 불변 규칙 (필터·정렬·개수 제한)
- **크기**: S (2 파일)
- **의존성**: None
- **참조**:
  - `lib/videos.ts` — 기존 `getVideosByLevel` 패턴 참고
  - `lib/videos.test.ts` — 기존 mock 패턴 참고
- **구현 대상**:
  - `lib/videos.ts` — `getReadAloudVideos(level)` 함수 추가
  - `lib/videos.test.ts` — 해당 함수 테스트 추가
- **수용 기준**:
  - [ ] beginner 레벨에서 타이틀에 "Read Aloud"가 포함된 영상만 반환된다
  - [ ] intermediate, advanced 레벨에서도 각각 해당 레벨 영상만 반환된다
  - [ ] "read aloud", "READ ALOUD" 등 대소문자 무관하게 필터링된다
  - [ ] 반환 결과가 arLevel 오름차순으로 정렬된다
  - [ ] 해당 레벨에 9개 이상의 Read Aloud 영상이 있을 때 최대 8개만 반환된다
  - [ ] 다른 레벨의 Read Aloud 영상은 포함되지 않는다
- **검증**: `bun run test -- videos`

---

### Task 2: Read Aloud 시드 데이터 보강

- **담당 시나리오**: S-3 (데이터 전제조건)
- **크기**: S (1 파일)
- **의존성**: None
- **참조**:
  - `data/videos.json` — 기존 데이터 구조
  - YouTube에서 실제 Read Aloud 영상 youtubeId 조사 필요 (레벨별 8개 이상)
- **구현 대상**:
  - `data/videos.json` — 레벨별 Read Aloud 영상 추가 (레벨별 각 8개 이상)
- **수용 기준**:
  - [ ] `getReadAloudVideos('beginner')`가 8개를 반환한다
  - [ ] `getReadAloudVideos('intermediate')`가 8개를 반환한다
  - [ ] `getReadAloudVideos('advanced')`가 8개를 반환한다
- **검증**: `bun run test -- videos` (Task 1 테스트가 실데이터 기반으로 통과)

---

### Checkpoint: Tasks 1-2 이후
- [ ] 모든 테스트 통과: `bun run test`
- [ ] `getReadAloudVideos`가 레벨별로 정렬된 8개 영상을 반환하는 것 확인

---

### Task 3: ReadAloudSection 컴포넌트 + 레벨 페이지 통합

- **담당 시나리오**: S-1 (UI 표시), S-2 (카드 클릭)
- **크기**: M (3 파일)
- **의존성**: Task 1 (`getReadAloudVideos` 함수), Task 2 (시드 데이터)
- **참조**:
  - `components/english-youtube-curator/VideoCard.tsx` — 재사용
  - `app/[level]/page.tsx` — `{/* read-aloud 섹션 */}` 주석 위치에 통합
  - `artifacts/read-aloud/wireframe.html` — 섹션 헤더, 그리드 레이아웃
  - next-best-practices (rsc-boundaries) — Server Component 배치
- **구현 대상**:
  - `components/english-youtube-curator/ReadAloudSection.tsx`
  - `components/english-youtube-curator/ReadAloudSection.test.tsx`
  - `app/[level]/page.tsx` — `getReadAloudVideos` 호출 + `ReadAloudSection` 삽입
- **수용 기준**:
  - [ ] Beginner 레벨 페이지에서 "📖 Read Aloud" 섹션 헤더가 기존 VideoGrid 아래에 표시된다
  - [ ] Read Aloud 섹션에 해당 레벨의 Read Aloud 영상 카드 8개가 표시된다
  - [ ] 각 카드에 썸네일, 타이틀, 채널명, AR지수가 표시된다
  - [ ] 카드 클릭 시 `/beginner/watch/[videoId]` 경로로 이동하는 링크가 렌더링된다
  - [ ] Intermediate, Advanced 레벨 페이지에도 동일하게 섹션이 표시된다
- **검증**:
  - `bun run test -- ReadAloudSection`
  - `bun run build`

---

### Checkpoint: Task 3 이후
- [ ] 모든 테스트 통과: `bun run test`
- [ ] 빌드 성공: `bun run build`
- [ ] `/beginner`, `/intermediate`, `/advanced` 페이지에서 Read Aloud 섹션이 AR 오름차순 8개 카드로 표시됨 (end-to-end 동작)

---

## 미결정 항목

- 시드 데이터의 실제 YouTube ID: 구현 시 YouTube에서 레벨별 적절한 Read Aloud 영상을 선별해 추가
