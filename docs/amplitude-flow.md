# MOA Amplitude 이벤트 & 플로우

클라이언트 SDK(`@amplitude/analytics-browser`)로만 전송.  
환경변수: `AMPLITUDE_API_KEY`

---

## 유저 플로우

```
landing
  ├─ 그림책 미리보기 → preview → offer → apply → success
  └─ 무료 제작 신청하기 → offer → apply → success
```

| Screen | 화면 |
|---|---|
| `landing` | 랜딩 |
| `preview` | 그림책 미리보기 (표지 + 스프레드) |
| `offer` | 무료 제작 안내 |
| `apply` | 인스타그램 아이디 신청 |
| `success` | 신청 완료 |

---

## 이벤트 목록

| 이벤트 | 언제 | 프로퍼티 |
|---|---|---|
| `landing_view` | 랜딩 진입 | — |
| `hero_cta_clicked` | 랜딩 CTA 클릭 | `source`: `header` \| `primary` |
| `onboarding_started` | 그림책 미리보기 진입 | — |
| `storybook_preview_viewed` | 미리보기 페이지 볼 때 | `page`: `1`~`4` |
| `free_application_clicked` | 무료 제작 CTA 클릭 | `source`: `landing` \| `landing_secondary` \| `preview` \| `offer` |
| `application_completed` | 인스타 신청 완료 | `instagram_id` |

### CTA `source` 상세

| source | 위치 |
|---|---|
| `header` | 랜딩 상단 「무료 체험하기」 |
| `primary` | 랜딩 히어로 「그림책 미리보기」 |
| `landing` | 랜딩 하단 이벤트 패널 「무료 제작 신청하기」 |
| `landing_secondary` | 랜딩 「무료 제작 신청하기」 보조 버튼 |
| `preview` | 미리보기 마지막 장 「무료 제작 신청하기」 |
| `offer` | 무료 제작 안내 화면 CTA |

---

## Identify (유저 프로퍼티)

신청 완료 시:

1. `setUserId("ig:{instagram_id}")`
2. User property `instagram_id` = 신청한 인스타 아이디

---

## 전환율 보는 법 (권장)

1. **랜딩 → 체험 시작**  
   `landing_view` → `onboarding_started` 또는 `hero_cta_clicked`

2. **체험 → 무료 제작 관심**  
   `storybook_preview_viewed` → `free_application_clicked`

3. **관심 → 신청 완료**  
   `free_application_clicked` → `application_completed`

4. **최종 전환**  
   `landing_view` → `application_completed`

---

## 참고

- Autocapture: 세션만 ON (`pageViews` / `elementInteractions` OFF)
- UTM은 `sessionStorage`에 보관 후 신청 API에 전달 (Amplitude 이벤트에는 미포함)
- Supabase 미연결이어도 `application_completed` + `instagram_id`는 클라이언트에서 바로 전송
