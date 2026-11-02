"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";

function InstagramIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

type Screen = "landing" | "home" | "demo" | "waitlist" | "thanks";

const photos = {
  cover: "/demo/moa-cover.jpg",
  cafe: "/demo/moa-cafe.jpg",
  beach: "/demo/moa-beach.jpg",
  walk: "/demo/moa-walk.jpg",
};

const feedPosts = [
  {
    id: "cafe",
    author: "우리",
    when: "어제 · 성수동",
    mood: "편안한",
    photo: photos.cafe,
    caption: "느린 토요일 오후. 말 없이 앉아 있어도 괜찮은 날.",
    date: "2026.10.31",
  },
  {
    id: "beach",
    author: "우리",
    when: "3일 전 · 양양",
    mood: "설레는",
    photo: photos.beach,
    caption: "계획 없이 떠난 하루. 바람만 기억에 남았어.",
    date: "2026.10.29",
  },
  {
    id: "walk",
    author: "우리",
    when: "지난주 · 한강",
    mood: "따뜻한",
    photo: photos.walk,
    caption: "그냥 걸었는데, 그게 제일 좋았던 저녁.",
    date: "2026.10.24",
  },
] as const;

function MoaLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const text = size === "lg" ? 30 : size === "sm" ? 17 : 20;
  return (
    <div className="moa-logo" aria-label="MOA" style={{ fontSize: text }}>
      <span className="moa-word">MOA</span>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      className="primary-button button-primary"
      onClick={onClick}
      disabled={disabled}
    >
      <span>{children}</span>
      <ArrowRight size={18} />
    </button>
  );
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <main className="landing moa-landing">
      <header className="landing-header">
        <MoaLogo />
        <span className="header-note">둘만의 순간을 한 권에</span>
      </header>

      <section className="landing-copy">
        <span className="eyebrow">INSTAGRAM DEMO</span>
        <h1>
          흩어진 기록이
          <br />
          한권의 이야기가
          <br />
          되어
        </h1>
        <p>
          인스타에 남긴 순간들을
          <br />
          한 권의 포토북으로 모아보세요.
        </p>
      </section>

      <section className="hero-art" aria-label="MOA 포토북 데모">
        <div className="floating-photo photo-one">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos.cafe} alt="카페에서 보낸 하루" />
          <span>느린 토요일</span>
        </div>
        <div className="floating-photo photo-two">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos.beach} alt="바닷가 산책" />
        </div>
        <div className="hero-book">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos.cover} alt="MOA 포토북 표지" />
          <div className="book-title">
            <span>OUR DAYS</span>
            <strong>우리만의 기록</strong>
            <small>MADE WITH MOA</small>
          </div>
        </div>
        <div className="story-line">
          <span>흩어진 사진</span>
          <ArrowRight size={15} />
          <span>한 권의 책</span>
        </div>
      </section>

      <div className="landing-action">
        <PrimaryButton onClick={onStart}>30초 데모 보기</PrimaryButton>
        <small>가입 없이, 홈부터 책까지 먼저 느껴보세요</small>
      </div>
    </main>
  );
}

function DemoHome({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <main className="app-screen moa-home">
      <header className="moa-home-top">
        <button className="icon-button" aria-label="뒤로" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <MoaLogo size="sm" />
        <div className="couple-avatars">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos.walk} alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos.cafe} alt="" />
        </div>
      </header>

      <div className="home-scroll">
        <section className="moa-home-hero">
          <div className="moa-home-hero-row">
            <span>OUR STORY</span>
            <em>D+128</em>
          </div>
          <div className="moa-home-progress">
            <div className="mini-cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photos.cover} alt="" />
            </div>
            <div>
              <strong>이번 달 책 만드는 중</strong>
              <span>기록 12개 · 페이지 18장</span>
            </div>
            <div className="moa-home-ring" aria-hidden>
              <svg viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" />
                <circle cx="18" cy="18" r="15" className="progress" />
              </svg>
              <b>72%</b>
            </div>
          </div>
        </section>

        <div className="feed-heading">
          <div>
            <h2>우리 피드</h2>
            <span>앱에서 이렇게 쌓여요</span>
          </div>
        </div>

        {feedPosts.map((post) => (
          <article className="memory-card moa-feed-card" key={post.id}>
            <div className="memory-meta">
              <div className="author">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.photo} alt="" />
                <div>
                  <strong>{post.author}</strong>
                  <span>{post.when}</span>
                </div>
              </div>
              <div className="memory-tools">
                <span className="mood">{post.mood}</span>
                <button className="icon-button" type="button" aria-label="더보기">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
            <div className="memory-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.photo} alt={post.caption} />
            </div>
            <div className="moa-feed-actions">
              <Heart size={18} strokeWidth={1.8} />
              <span>{post.mood}</span>
            </div>
            <div className="memory-copy">
              <p>
                <strong>{post.author}</strong> {post.caption}
              </p>
              <span>{post.date}</span>
            </div>
          </article>
        ))}
      </div>

      <footer className="moa-home-bar">
        <PrimaryButton onClick={onContinue}>이 기록이 책이 되면</PrimaryButton>
      </footer>
    </main>
  );
}

function DemoBook({
  onBack,
  onDone,
}: {
  onBack: () => void;
  onDone: () => void;
}) {
  const [page, setPage] = useState(0);
  const pages = useMemo(
    () => [
      <div className="preview-cover" key="cover">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photos.cover} alt="표지" />
        <div>
          <small>VOL. 01</small>
          <strong>OUR DAYS</strong>
          <span>사진이 책이 되는 순간</span>
        </div>
      </div>,
      <div className="preview-editorial" key="editorial">
        <span>CHAPTER 01</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photos.beach} alt="해변" />
        <div>
          <strong>계획 없이 떠난 하루</strong>
          <p>목적보다 함께 걷는 속도가 더 오래 남아요.</p>
        </div>
      </div>,
      <div className="preview-collage" key="collage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photos.cafe} alt="카페" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photos.walk} alt="우리" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photos.beach} alt="바다" />
        <p>평범해서 더 좋았던 우리의 순간들</p>
      </div>,
      <div className="preview-story" key="story">
        <span>MOA DEMO</span>
        <strong>
          “흩어진 기록이
          <br />
          한권의 이야기가 되어”
        </strong>
        <p>
          이름도, 설문도 없이. 책이 완성되는 느낌만 먼저 보여드릴게요. 준비가
          되면 인스타 DM으로 알려드릴게요.
        </p>
        <small>이 데모는 미리보기용 샘플 페이지입니다.</small>
      </div>,
    ],
    [],
  );

  const isLast = page === pages.length - 1;

  return (
    <main className="preview-screen moa-demo">
      <header className="preview-header">
        <button
          className="icon-button"
          aria-label="뒤로"
          onClick={() => (page === 0 ? onBack() : setPage(page - 1))}
        >
          <ArrowLeft size={21} />
        </button>
        <div>
          <strong>MOA 데모 북</strong>
          <span>이렇게 책이 돼요</span>
        </div>
        <span className="page-number">
          {page + 1} / {pages.length}
        </span>
      </header>

      <div className="preview-area">
        <div className="book-page" key={page}>
          {pages[page]}
        </div>
        <button
          className="page-control prev"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          aria-label="이전 페이지"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          className="page-control next"
          disabled={isLast}
          onClick={() => setPage(page + 1)}
          aria-label="다음 페이지"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      <div className="page-dots">
        {pages.map((_, index) => (
          <span key={index} className={page === index ? "active" : ""} />
        ))}
      </div>

      <footer className="preview-footer">
        <div>
          <span>데모 체험</span>
          <strong>{isLast ? "거의 다 왔어요" : "페이지를 넘겨보세요"}</strong>
        </div>
        <PrimaryButton
          onClick={() => {
            if (isLast) onDone();
            else setPage(page + 1);
          }}
        >
          {isLast ? "오픈 알림 받기" : "다음 장 넘기기"}
        </PrimaryButton>
      </footer>
    </main>
  );
}

function Waitlist({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: (instagramId: string) => void;
}) {
  const [instagramId, setInstagramId] = useState("");
  const cleaned = instagramId.trim().replace(/^@/, "");
  const valid = cleaned.length >= 2 && /^[a-zA-Z0-9._]+$/.test(cleaned);

  return (
    <main className="onboarding moa-waitlist">
      <header className="sub-header">
        <button className="icon-button" aria-label="이전" onClick={onBack}>
          <ArrowLeft size={21} />
        </button>
        <MoaLogo size="sm" />
        <span className="step-count">IG</span>
      </header>

      <section className="form-section">
        <div className="form-heading">
          <span className="eyebrow">EARLY ACCESS</span>
          <h2>
            MOA가 시작되면
            <br />
            DM으로 알려드릴게요
          </h2>
          <p>이름·설문 없이, 인스타 아이디만 남겨주세요.</p>
        </div>

        <div className="ig-card">
          <span className="ig-icon">
            <InstagramIcon size={22} />
          </span>
          <div>
            <strong>Instagram DM 알림</strong>
            <small>오픈하면 가장 먼저 메시지를 보내드려요</small>
          </div>
        </div>

        <form
          className="field-stack"
          onSubmit={(event) => {
            event.preventDefault();
            if (!valid) return;
            onSubmit(cleaned);
          }}
        >
          <label className="field">
            <span>인스타그램 아이디</span>
            <div className="ig-input">
              <em>@</em>
              <input
                value={instagramId}
                onChange={(event) => setInstagramId(event.target.value)}
                placeholder="your_id"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                autoFocus
              />
            </div>
          </label>

          <footer className="form-footer">
            <PrimaryButton type="submit" disabled={!valid}>
              알림 신청하기
            </PrimaryButton>
            <small className="waitlist-note">
              광고 데모용 수집이며, 오픈 안내 외 용도로 쓰지 않아요.
            </small>
          </footer>
        </form>
      </section>
    </main>
  );
}

function Thanks({ instagramId, onRestart }: { instagramId: string; onRestart: () => void }) {
  return (
    <main className="complete-screen moa-thanks">
      <div className="complete-top">
        <span className="spark-badge">
          <Sparkles size={16} /> YOU&apos;RE ON THE LIST
        </span>
        <h2>
          @{instagramId} 님,
          <br />
          명단에 올렸어요.
        </h2>
        <p>
          MOA가 시작되면
          <br />
          인스타그램 DM으로 알려드릴게요.
        </p>
      </div>

      <div className="book-stage">
        <div className="book-shadow" />
        <div className="personal-book">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos.cover} alt="MOA 포토북" />
          <div className="personal-book-copy">
            <small>COMING SOON</small>
            <strong>MOA</strong>
            <span>둘만의 순간을 한 권에</span>
          </div>
        </div>
        <span className="volume-tag">
          <Check size={12} /> SAVED
        </span>
      </div>

      <div className="complete-action">
        <PrimaryButton onClick={onRestart}>데모 다시 보기</PrimaryButton>
        <p className="thanks-note">지금은 미리보기 데모예요. 곧 만나요.</p>
      </div>
    </main>
  );
}

export default function PrototypeApp() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [instagramId, setInstagramId] = useState("");

  return (
    <div className="site-shell">
      <div className="phone-shell">
        {screen === "landing" ? (
          <Landing onStart={() => setScreen("home")} />
        ) : null}
        {screen === "home" ? (
          <DemoHome
            onBack={() => setScreen("landing")}
            onContinue={() => setScreen("demo")}
          />
        ) : null}
        {screen === "demo" ? (
          <DemoBook
            onBack={() => setScreen("home")}
            onDone={() => setScreen("waitlist")}
          />
        ) : null}
        {screen === "waitlist" ? (
          <Waitlist
            onBack={() => setScreen("demo")}
            onSubmit={(id) => {
              setInstagramId(id);
              try {
                const prev = JSON.parse(
                  window.localStorage.getItem("moa.waitlist") || "[]",
                ) as string[];
                const next = Array.from(new Set([id, ...prev]));
                window.localStorage.setItem("moa.waitlist", JSON.stringify(next));
              } catch {
                // ignore storage failures in demo
              }
              setScreen("thanks");
            }}
          />
        ) : null}
        {screen === "thanks" ? (
          <Thanks
            instagramId={instagramId}
            onRestart={() => {
              setScreen("landing");
              setInstagramId("");
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
