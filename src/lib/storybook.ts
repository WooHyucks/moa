export type StoryPage = {
  id: string;
  kind: "cover" | "spread";
  chapter?: string;
  title: string;
  body: string;
  image: string;
};

/** Fixed sample picture book for ads demo — no personalization required. */
export const sampleStorybookPages: StoryPage[] = [
  {
    id: "cover",
    kind: "cover",
    chapter: "MOA · Our Story Vol. 01",
    title: "우리가 서로를 발견한 날",
    body: "두 사람의 연애가\n한 권의 그림책이 된다면.",
    image: "/demo/story-cover.jpg",
  },
  {
    id: "meet",
    kind: "spread",
    chapter: "01",
    title: "처음 마주친 오후",
    body: "어느 따뜻한 오후,\n서로의 이름조차 낯설었던\n두 사람이 처음 만났어요.\n\n짧은 인사가\n긴 이야기의 시작이 되었죠.",
    image: "/demo/story-meet.jpg",
  },
  {
    id: "rain",
    kind: "spread",
    chapter: "02",
    title: "비 오는 날의 우산",
    body: "갑자기 내린 비 속에서\n하나뿐인 우산을 나누며\n나란히 걸었어요.\n\n말보다 더 가까운\n사이가 되었던 날.",
    image: "/demo/story-rain.jpg",
  },
  {
    id: "sea",
    kind: "spread",
    chapter: "03",
    title: "바다 앞의 약속",
    body: "바람이 스치던 저녁,\n멀리 보이는 수평선을 보며\n우리는 조용히 웃었어요.\n\n그날의 마음이\n지금도 페이지 위에 남아 있어요.",
    image: "/demo/story-sea.jpg",
  },
];
