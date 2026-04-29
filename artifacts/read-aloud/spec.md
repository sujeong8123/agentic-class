# Read Aloud 섹션 Spec

## 개요

각 레벨 페이지(Beginner / Intermediate / Advanced) 하단의 "📖 Read Aloud" 섹션에,
해당 레벨의 Read Aloud 영상을 AR지수 오름차순으로 최대 8개 표시한다.

---

## 시나리오

### S-1. Read Aloud 영상 8개 표시

**Given** 사용자가 Beginner 레벨 페이지에 진입했을 때  
**When** 페이지가 로드되면  
**Then**
- "📖 Read Aloud" 섹션이 기존 VideoGrid 아래에 표시된다
- 타이틀에 "Read Aloud"(대소문자 무관)가 포함된 Beginner 레벨 영상만 표시된다
- AR지수 오름차순으로 정렬되어 최대 8개 표시된다
- 각 영상 카드에는 썸네일, 타이틀, 채널명, AR지수가 표시된다

> Intermediate / Advanced 레벨 페이지에도 동일하게 적용된다

---

### S-2. 영상 카드 클릭

**Given** Read Aloud 섹션의 영상 카드가 표시된 상태에서  
**When** 사용자가 카드를 클릭하면  
**Then** 해당 레벨의 watch 페이지(`/[level]/watch/[videoId]`)로 이동한다

---

### S-3. 시드 데이터 충족 (데이터 전제조건)

**Given** 시드 데이터 기준  
**When** 각 레벨별 Read Aloud 영상 수를 확인하면  
**Then** Beginner / Intermediate / Advanced 각각 8개 이상의 Read Aloud 영상이 존재한다

---

## 불변 규칙

- Read Aloud 필터 기준: 영상 타이틀에 "read aloud" 포함 (대소문자 무관)
- 정렬: AR지수 오름차순
- 표시 개수: 최대 8개 (8개 미만이면 있는 것만 표시)
- 레벨 필터: 해당 레벨의 영상만 표시 (다른 레벨 혼합 없음)

---

## 제외 항목

- 페이지네이션 / "더 보기" 버튼: 8개로 고정, 추가 탐색 불필요 (MVP 범위 밖)
- Read Aloud 섹션 내 장르 필터: 기존 VideoGrid의 장르 필터와 별개로, Read Aloud 섹션은 필터 없음
