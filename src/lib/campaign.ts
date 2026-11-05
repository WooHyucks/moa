export type CampaignStatus = "open" | "closed";

/** Free digital storybook campaign — edit here or via env overrides. */
export const campaign = {
  brandName: "MOA",
  brandWordmark: "MOA",
  slogan: "우리의 이야기를 그림으로 남기다.",
  freeSlots: Number(process.env.NEXT_PUBLIC_MOA_FREE_SLOTS ?? 10),
  status: (process.env.NEXT_PUBLIC_MOA_CAMPAIGN_STATUS ?? "open") as CampaignStatus,
  pageRangeLabel: "10~12페이지",
  consentVersion: "2026-11-05.v1",
  privacyNote:
    "수집 목적: 무료 디지털 그림책 이벤트 안내 및 선정 연락. 보관: 이벤트 종료 후 최대 6개월. 삭제 요청: 인스타그램 DM 또는 문의 채널로 요청해 주세요.",
  dmDisclaimer:
    "인스타그램 DM 수신은 계정 설정·플랫폼 정책에 따라 달라질 수 있으며, 연락이 반드시 도착한다고 보장하지 않습니다.",
} as const;

export function isCampaignOpen() {
  return campaign.status === "open";
}
