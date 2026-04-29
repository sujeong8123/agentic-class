---
category: task-ordering
applied: not-yet
---
## Task 1·2 병렬 가능이지만 순차 실행

**상황**: Step 2, Task 의존성 식별. Task 1(데이터 함수)과 Task 2(시드 데이터)는 서로 의존하지 않아 병렬 가능.
**판단**: 순차 실행을 선택. Task 2의 시드 데이터 수용 기준("레벨별 8개 반환")을 검증하려면 Task 1의 함수가 필요하므로, 순차가 실질적으로 더 깔끔했다. 병렬로 진행하면 Task 2 수용 기준을 Task 1 완료 전에 검증할 수 없다.
**다시 마주칠 가능성**: 중간 — 데이터 함수 + 시드 데이터 조합은 반복 패턴.

---
category: code-review
applied: not-yet
---
## JSON 파일 읽기 기반 데이터 계층의 타입 안전성 허점

**상황**: Step 4, code-reviewer가 `arLevel`이 `undefined`/`NaN`일 때 `.sort()` 결과가 비결정적임을 지적.
**판단**: `sort` 보호 추가(`?? Infinity`). TypeScript 타입이 `number`로 선언되어 있어도, `JSON.parse`로 읽는 경우 런타임에 필드 누락/null이 가능하다. 테스트 픽스처가 항상 유효한 값을 쓰므로 자동으로 잡히지 않았다.
**다시 마주칠 가능성**: 높음 — JSON 파일 기반 데이터 레이어를 계속 사용하는 한 동일 문제 재발 가능. `readFileSync` → `zod.parse` 같은 런타임 검증을 도입하면 구조적으로 해결된다.

---
category: spec-ambiguity
applied: discarded
---
## 시드 데이터 YouTube ID의 정확성

**상황**: Task 2, 실제 YouTube Read Aloud 영상 ID를 웹 검색으로 수집.
**판단**: 검색 결과 기반 ID를 사용. 실제 접근 가능 여부는 region/저작권에 따라 다를 수 있다. 교육용 데모 목적이므로 허용 범위로 판단. 프로덕션이라면 공식 YouTube Data API로 검증이 필요하다.
**다시 마주칠 가능성**: 낮음 — 이번 feature 특유의 시드 데이터 수집 이슈.
