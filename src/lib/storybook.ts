export type StoryPage = {
  id: string;
  type: "cover" | "story" | "quote" | "ending";
  title: string;
  body: string;
  image: string;
};

/** Fixed sample picture book for ads demo — no personalization required. */
export const sampleStorybookPages: StoryPage[] = [
  {
    id: "cover",
    type: "cover",
    title: "비가 오면, 우리는",
    body: "수아와 도윤의 세 번째 계절",
    image: "/demo/moa-cafe.webp",
  },
  {
    id: "story",
    type: "story",
    title: "처음 만난 날도 비가 왔다.",
    body: "우산은 하나였고, 우리는 조금 가까워졌다. 도윤은 수아가 비 오는 날을 싫어한다고 생각했지만, 사실 수아는 그날 이후 비를 기다리게 되었다.",
    image: "/demo/moa-cafe.webp",
  },
  {
    id: "quote",
    type: "quote",
    title: "함께 걷는 속도를 배운다는 것",
    body: "빠르지도 느리지도 않게. 서로의 걸음에 맞춰 걷는 일이 사랑과 닮아 있었다.",
    image: "/demo/moa-sea.webp",
  },
  {
    id: "ending",
    type: "ending",
    title: "우리의 다음 장면도 함께",
    body: "평범한 날들이 모여 두 사람만의 한 권이 됩니다.",
    image: "/demo/moa-sea.webp",
  },
];
