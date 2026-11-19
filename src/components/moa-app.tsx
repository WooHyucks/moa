"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Gift,
  Image,
  Share2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { campaign, isCampaignOpen } from "@/lib/campaign";
import { identifyInstagram, initAmplitude, track } from "@/lib/amplitude";
import { sampleStorybookPages } from "@/lib/storybook";
import { loadUtm, persistUtm, readUtmFromSearch, type UtmParams } from "@/lib/utm";

type Screen = "landing" | "preview" | "offer" | "apply" | "success";

function MoaLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const text = size === "lg" ? 28 : size === "sm" ? 20 : 23;
  return (
    <div className="moa-logo" aria-label="MOA" style={{ fontSize: text }}>
      <span className="moa-word">MOA</span>
      <i className="moa-dot" aria-hidden />
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

function Landing({
  onStart,
  onPreview,
  campaignOpen,
}: {
  onStart: () => void;
  onPreview: () => void;
  campaignOpen: boolean;
}) {
  return (
    <main className="landing moa-landing moa-story-landing">
      <header className="landing-header sticky-header">
        <MoaLogo />
        <button
          type="button"
          className="header-cta filled"
          onClick={() => {
            track("hero_cta_clicked", { source: "header" });
            onStart();
          }}
        >
          무료 제작 신청
        </button>
      </header>

      <section className="hero">
        <div className="landing-copy">
          <span className="eyebrow">COUPLE PICTURE BOOK</span>
          <h1>
            우리 이야기,
            <br />
            한 권의 그림책이
            <br />
            되다.
          </h1>
          <p>
            두 사람의 사진과 이야기를 보내주세요.
            <br />
            MOA가 세상에 하나뿐인 그림책으로 만들어요.
          </p>
        </div>

        <section className="hero-stage" aria-label="그림책 미리보기">
          <span className="hero-watermark" aria-hidden>
            MOA
          </span>
          <span className="hero-chip">실제 제작 샘플</span>
          <div className="hero-book">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/demo/moa-sea.webp" alt="MOA 그림책 표지" />
            <i className="hero-book-spine" aria-hidden />
            <div className="hero-book-veil" aria-hidden />
            <div className="hero-book-copy">
              <small>A STORY OF US</small>
              <strong>우리라는 계절</strong>
              <span>민지와 현우의 이야기</span>
            </div>
          </div>
          <div className="hero-note">
            <strong>Our story, illustrated.</strong>
            <span>사진에서 그림으로, 기억에서 이야기로</span>
          </div>
        </section>

        <div className="landing-action">
          <PrimaryButton
            onClick={() => {
              track("hero_cta_clicked", { source: "primary" });
              onStart();
            }}
          >
            내 이야기 무료로 만들기
          </PrimaryButton>
          <button
            type="button"
            className="preview-link"
            onClick={() => {
              track("hero_cta_clicked", { source: "sample_link" });
              onPreview();
            }}
          >
            샘플 그림책 먼저 보기 <ChevronRight size={16} />
          </button>
        </div>
        <div className="trust-row">
          <span>
            <ShieldCheck size={15} /> 사진은 제작 후 안전하게 삭제
          </span>
          <span>
            <Clock3 size={15} /> 신청은 3분이면 충분해요
          </span>
        </div>
      </section>

      <section className="ticket-section">
        <button
          type="button"
          className={`moa-ticket ${campaignOpen ? "" : "closed"}`}
          onClick={() => {
            if (!campaignOpen) {
              onPreview();
              return;
            }
            track("free_application_clicked", { source: "landing_ticket" });
            onStart();
          }}
        >
          <div className="moa-ticket-main">
            <span className="moa-ticket-badge">
              <Gift size={13} />
              {campaignOpen ? `선착순 ${campaign.freeSlots}커플` : "모집 마감"}
            </span>
            <strong>디지털 그림책 무료 제작</strong>
            <small>
              {campaign.pageRangeLabel} · 디지털 PDF · 선정 커플 한정
            </small>
          </div>
          <div className="moa-ticket-side">
            <b>FREE</b>
            <span>{campaignOpen ? "신청하기" : "샘플 보기"}</span>
          </div>
        </button>
      </section>

      <section className="intro-section">
        <span className="section-number">01</span>
        <div className="section-heading">
          <span className="eyebrow">WHY MOA</span>
          <h2>
            사진만 넘기던 추억을,
            <br />
            오래 읽고 싶은 이야기로.
          </h2>
          <p>
            기념일 선물을 고민하는 시간을 줄이고, 두 사람다운 장면은 더
            선명하게 남겨드려요.
          </p>
        </div>
        <div className="feature-grid">
          <article>
            <span className="feature-icon">
              <Image size={22} />
            </span>
            <strong>
              사진에서 찾는
              <br />
              우리다운 장면
            </strong>
            <p>표정과 분위기까지 섬세하게 담아요.</p>
          </article>
          <article>
            <span className="feature-icon">
              <Sparkles size={22} />
            </span>
            <strong>
              한 편의 이야기로
              <br />
              완성하는 구성
            </strong>
            <p>작가가 사연을 읽고 직접 엮어요.</p>
          </article>
          <article>
            <span className="feature-icon">
              <BookOpen size={22} />
            </span>
            <strong>
              꺼내 볼수록 좋은
              <br />
              프리미엄 한 권
            </strong>
            <p>소장에 어울리는 종이와 제본을 써요.</p>
          </article>
        </div>
      </section>

      <section className="sample-section">
        <div className="section-heading">
          <span className="eyebrow">STORY SAMPLE</span>
          <h2>
            먼저, 한 장면을
            <br />
            천천히 넘겨보세요.
          </h2>
        </div>
        <button type="button" className="sample-card" onClick={onPreview}>
          <div className="sample-art">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/demo/moa-cafe.webp" alt="비 오는 날의 카페 그림책 샘플" />
            <span>PREVIEW 01</span>
          </div>
          <div className="sample-info">
            <div>
              <small>일상 · 연애 3년 차</small>
              <strong>비가 오면, 우리는</strong>
            </div>
            <span className="round-arrow">
              <ArrowRight size={18} />
            </span>
          </div>
        </button>
        <div className="sample-quote">
          <span>“</span>
          <p>
            처음 만났던 날도 비가 왔다.
            <br />
            우산은 하나였고, 우리는 조금 가까워졌다.
          </p>
        </div>
        <button
          type="button"
          className="primary-button button-line"
          onClick={onPreview}
        >
          <span>그림책 전체 미리보기</span>
          <ArrowRight size={18} />
        </button>
      </section>

      <section className="process-section">
        <div className="section-heading">
          <span className="eyebrow">HOW IT WORKS</span>
          <h2>
            어렵지 않아요.
            <br />
            이야기만 들려주세요.
          </h2>
        </div>
        <ol className="process-list">
          <li>
            <span>01</span>
            <div>
              <strong>무료 제작 신청</strong>
              <p>두 사람의 사연과 사진을 보내주세요.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <strong>작가의 1:1 제작</strong>
              <p>그림과 글로 두 사람의 이야기를 엮어요.</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <strong>시안 확인 후 결정</strong>
              <p>완성된 미리보기를 보고 구매를 결정하세요.</p>
            </div>
          </li>
        </ol>
        <div className="risk-free">
          <ShieldCheck size={20} />
          <div>
            <strong>결제는 완성된 시안을 본 다음</strong>
            <p>마음에 들지 않으면 구매하지 않아도 괜찮아요.</p>
          </div>
        </div>
      </section>

      <section className={`final-cta ${campaignOpen ? "" : "closed"}`}>
        <MoaLogo />
        <h2>
          첫 {campaign.freeSlots}커플에게
          <br />
          디지털 그림책을 선물합니다
        </h2>
        <p>
          선정된 커플에게 {campaign.pageRangeLabel} 디지털 그림책을
          무료로 제작해 드려요.
        </p>
        {campaignOpen ? (
          <PrimaryButton
            onClick={() => {
              track("free_application_clicked", { source: "landing" });
              onStart();
            }}
          >
            무료로 제작 시작하기
          </PrimaryButton>
        ) : (
          <p className="closed-note">현재 무료 제작 모집이 마감되었습니다.</p>
        )}
        <button type="button" className="preview-link light-link" onClick={onPreview}>
          샘플부터 더 둘러보기 <ChevronRight size={16} />
        </button>
      </section>
    </main>
  );
}

function StoryPreview({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  const pages = sampleStorybookPages;
  const [page, setPage] = useState(0);
  const current = pages[page];

  useEffect(() => {
    track("storybook_preview_viewed", { page: page + 1 });
  }, [page]);

  return (
    <main className="preview-screen moa-reader">
      <header className="sub-header">
        <button className="icon-button" aria-label="이전" onClick={onBack}>
          <ArrowLeft size={21} />
        </button>
        <MoaLogo size="sm" />
        <span className="page-number">
          {page + 1} / {pages.length}
        </span>
      </header>

      <div className="preview-title">
        <span className="eyebrow">STORY SAMPLE</span>
        <h1>비가 오면, 우리는</h1>
        <p>실제 제작된 그림책의 일부를 각색한 샘플이에요.</p>
      </div>

      <div className="reader">
        <article className={`reader-page reader-${current.type}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.image} alt={current.title} />
          <div className="reader-copy">
            <small>
              {current.type === "cover" ? "A STORY OF US" : `PAGE 0${page + 1}`}
            </small>
            <strong>{current.title}</strong>
            <p>{current.body}</p>
          </div>
        </article>
        <button
          className="reader-nav reader-prev"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          aria-label="이전 페이지"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          className="reader-nav reader-next"
          disabled={page === pages.length - 1}
          onClick={() => setPage(page + 1)}
          aria-label="다음 페이지"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      <div className="reader-dots">
        {pages.map((p, index) => (
          <button
            key={p.id}
            type="button"
            className={page === index ? "active" : ""}
            onClick={() => setPage(index)}
            aria-label={`${index + 1}페이지`}
          />
        ))}
      </div>

      <div className="preview-bottom">
        <div>
          <strong>우리 이야기도 그림책이 될 수 있을까요?</strong>
          <span>완성 시안을 무료로 먼저 받아보세요.</span>
        </div>
        <PrimaryButton
          onClick={() => {
            track("free_application_clicked", { source: "preview" });
            onContinue();
          }}
        >
          무료 제작 신청하기
        </PrimaryButton>
      </div>
    </main>
  );
}

function FreeOffer({
  campaignOpen,
  onBack,
  onApply,
}: {
  campaignOpen: boolean;
  onBack: () => void;
  onApply: () => void;
}) {
  const perks = [
    { label: "분량", value: campaign.pageRangeLabel },
    { label: "형태", value: "디지털 PDF" },
    { label: "대상", value: `선정 ${campaign.freeSlots}커플` },
    { label: "비용", value: "무료 제작" },
  ];

  return (
    <main className="moa-offer">
      <header className="sub-header">
        <button className="icon-button" aria-label="이전" onClick={onBack}>
          <ArrowLeft size={21} />
        </button>
        <MoaLogo size="sm" />
        <span className="step-count" />
      </header>

      <section className="offer-body">
        <div className="offer-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/demo/moa-sea.webp" alt="MOA 디지털 그림책" />
          <div className="offer-visual-copy">
            <span>A STORY OF US</span>
            <strong>우리라는 계절</strong>
          </div>
        </div>

        <div className="offer-copy">
          <p className="offer-kicker">첫 {campaign.freeSlots}커플 초대</p>
          <h2>
            미리본 그 그림책,
            <br />
            우리 이야기로 만들어볼까요?
          </h2>
          <p className="offer-desc">
            모아의 첫 이야기를 함께 열어갈 커플을 찾고 있어요.
            선정되면 {campaign.pageRangeLabel} 디지털 그림책을 만들어 드려요.
          </p>
        </div>

        <ul className="offer-perks">
          {perks.map((perk) => (
            <li key={perk.label}>
              <span>{perk.label}</span>
              <strong>{perk.value}</strong>
            </li>
          ))}
        </ul>

        <p className="offer-note">
          신청은 무료이며, 제작은 선정된 커플에 한해 진행됩니다.
        </p>
      </section>

      <footer className="offer-footer">
        {campaignOpen ? (
          <PrimaryButton
            onClick={() => {
              track("free_application_clicked", { source: "offer" });
              onApply();
            }}
          >
            무료 제작 신청하기
          </PrimaryButton>
        ) : (
          <p className="closed-note">현재 무료 제작 모집이 마감되었습니다.</p>
        )}
      </footer>
    </main>
  );
}

function ApplyForm({
  storageReady,
  utm,
  onBack,
  onSuccess,
}: {
  storageReady: boolean;
  utm: UtmParams;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [instagramId, setInstagramId] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const cleaned = instagramId.trim().replace(/^@/, "");
  const valid =
    cleaned.length >= 2 && /^[a-zA-Z0-9._]+$/.test(cleaned) && consent;

  return (
    <main className="moa-apply">
      <header className="sub-header">
        <button className="icon-button" aria-label="이전" onClick={onBack}>
          <ArrowLeft size={21} />
        </button>
        <MoaLogo size="sm" />
        <span className="step-count" />
      </header>
      <section className="apply-body">
        <div className="offer-copy">
          <p className="offer-kicker">Instagram</p>
          <h2>
            연락받을
            <br />
            인스타그램을 남겨주세요
          </h2>
          <p className="offer-desc">
            선정 결과와 제작 안내는 DM으로 전해드릴 수 있어요.
          </p>
        </div>

        <form
          className="field-stack"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!valid || submitting) return;
            setSubmitting(true);
            try {
              if (storageReady) {
                const res = await fetch("/api/applications", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    instagram_username: cleaned,
                    consent_given: true,
                    consent_version: campaign.consentVersion,
                    utm_source: utm.utm_source,
                    utm_campaign: utm.utm_campaign,
                  }),
                });
                if (!res.ok) {
                  const data = (await res.json().catch(() => null)) as {
                    error?: string;
                  } | null;
                  toast.error(data?.error ?? "신청에 실패했습니다.");
                  return;
                }
              } else {
                try {
                  const prev = JSON.parse(
                    window.localStorage.getItem("moa.waitlist") || "[]",
                  ) as string[];
                  window.localStorage.setItem(
                    "moa.waitlist",
                    JSON.stringify(Array.from(new Set([cleaned, ...prev]))),
                  );
                } catch {
                  // ignore
                }
              }

              identifyInstagram(cleaned);
              track("application_completed", { instagram_id: cleaned });
              onSuccess();
            } catch {
              toast.error("네트워크 오류가 발생했습니다.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <label className="field">
            <span>Instagram ID</span>
            <div className="ig-input">
              <em>@</em>
              <input
                value={instagramId}
                onChange={(e) => setInstagramId(e.target.value)}
                placeholder="your_instagram"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
          </label>

          <label className="consent-row">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>
              인스타그램 아이디 수집 및 이벤트 관련 DM 수신에 동의합니다.
            </span>
          </label>
          <p className="offer-note">
            {campaign.privacyNote}
            <br />
            {campaign.dmDisclaimer}
          </p>

          <footer className="offer-footer in-form">
            <PrimaryButton type="submit" disabled={!valid || submitting}>
              {submitting ? "접수 중…" : "신청 완료하기"}
            </PrimaryButton>
          </footer>
        </form>
      </section>
    </main>
  );
}

function Success({ onHome }: { onHome: () => void }) {
  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const payload = {
      title: "MOA",
      text: "우리의 연애가 그림책이 된다면? moa.에서 이야기 만들어보기",
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("링크를 복사했어요.");
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("링크를 복사했어요.");
      } catch {
        toast.error("공유에 실패했습니다.");
      }
    }
  };

  return (
    <main className="complete-screen moa-thanks">
      <div className="complete-top">
        <span className="spark-badge">
          <Sparkles size={16} /> RECEIVED
        </span>
        <h2>
          우리의 이야기가
          <br />
          접수됐어요!
        </h2>
        <p>
          모아의 첫 번째 그림책을 함께 만들어주셔서 감사합니다.
          <br />
          선정된 커플에게 인스타그램 DM으로 안내드릴 수 있어요.
        </p>
      </div>

      <div className="complete-action">
        <PrimaryButton onClick={onHome}>모아 다시 둘러보기</PrimaryButton>
        <button type="button" className="share-button" onClick={share}>
          <Share2 size={16} /> 친구 커플에게 공유하기
          <Copy size={14} />
        </button>
      </div>
    </main>
  );
}

export default function MoaApp({
  amplitudeApiKey = "",
  storageReady = false,
}: {
  amplitudeApiKey?: string;
  storageReady?: boolean;
}) {
  const [screen, setScreen] = useState<Screen>("landing");
  const [utm, setUtm] = useState<UtmParams>({});
  const campaignOpen = isCampaignOpen();

  useEffect(() => {
    initAmplitude(amplitudeApiKey);
    const fromUrl = readUtmFromSearch(window.location.search);
    if (Object.keys(fromUrl).length) {
      persistUtm(fromUrl);
      setUtm(fromUrl);
    } else {
      setUtm(loadUtm());
    }
  }, [amplitudeApiKey]);

  useEffect(() => {
    if (screen === "landing") track("landing_view");
    if (screen === "preview") track("onboarding_started");
  }, [screen]);

  return (
    <div className="site-shell">
      <div className="phone-shell">
        {screen === "landing" ? (
          <Landing
            campaignOpen={campaignOpen}
            onStart={() => setScreen(campaignOpen ? "offer" : "preview")}
            onPreview={() => setScreen("preview")}
          />
        ) : null}

        {screen === "preview" ? (
          <StoryPreview
            onBack={() => setScreen("landing")}
            onContinue={() => setScreen("offer")}
          />
        ) : null}

        {screen === "offer" ? (
          <FreeOffer
            campaignOpen={campaignOpen}
            onBack={() => setScreen("preview")}
            onApply={() => setScreen("apply")}
          />
        ) : null}

        {screen === "apply" ? (
          <ApplyForm
            storageReady={storageReady}
            utm={utm}
            onBack={() => setScreen("offer")}
            onSuccess={() => setScreen("success")}
          />
        ) : null}

        {screen === "success" ? (
          <Success onHome={() => setScreen("landing")} />
        ) : null}
      </div>
    </div>
  );
}
