"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Copy,
  Share2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { campaign, isCampaignOpen } from "@/lib/campaign";
import { identifyInstagram, initAmplitude, track } from "@/lib/amplitude";
import { sampleStorybookPages } from "@/lib/storybook";
import { loadUtm, persistUtm, readUtmFromSearch, type UtmParams } from "@/lib/utm";

type Screen = "landing" | "preview" | "offer" | "apply" | "success";

function MoaLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const text = size === "lg" ? 28 : size === "sm" ? 18 : 20;
  return (
    <div className="moa-logo" aria-label="MOA" style={{ fontSize: text }}>
      <span className="moa-word">{campaign.brandWordmark}</span>
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

function GhostButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button type="button" className="ghost-button" onClick={onClick}>
      {children}
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
      <header className="landing-header">
        <MoaLogo />
        <button
          type="button"
          className="header-cta"
          onClick={() => {
            track("hero_cta_clicked", { source: "header" });
            onStart();
          }}
        >
          무료 체험하기
        </button>
      </header>

      <section className="landing-copy">
        <span className="eyebrow">
          {campaignOpen
            ? `첫 ${campaign.freeSlots}커플 디지털 그림책 무료 제작`
            : "무료 제작 모집 마감"}
        </span>
        <h1>
          우리의 연애가
          <br />
          한 권의 그림책이
          <br />
          된다면?
        </h1>
        <p>
          처음 만난 날부터 가장 행복했던 순간까지.
          <br />
          우리의 이야기를 세상에 하나뿐인
          <br />
          그림책으로 만들어보세요.
        </p>
      </section>

      <section className="hero-book-open" aria-label="그림책 미리보기">
        <div className="open-spread">
          <div className="open-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/demo/story-meet.jpg" alt="그림책 일러스트" />
          </div>
          <div className="open-right">
            <small>01</small>
            <strong>처음 마주친 오후</strong>
            <p>
              어느 따뜻한 오후,
              <br />
              서로의 이름조차 낯설었던
              <br />
              두 사람이 처음 만났어요.
            </p>
          </div>
        </div>
      </section>

      <div className="landing-action dual">
        <PrimaryButton
          onClick={() => {
            track("hero_cta_clicked", { source: "primary" });
            onPreview();
          }}
        >
          그림책 미리보기
        </PrimaryButton>
        <GhostButton
          onClick={() => {
            track("free_application_clicked", { source: "landing_secondary" });
            onStart();
          }}
        >
          무료 제작 신청하기
        </GhostButton>
      </div>

      <section className="moa-section">
        <h2>
          평범했던 우리의 순간이
          <br />
          특별한 이야기가 됩니다.
        </h2>
        <div className="sample-spread ghibli">
          {[
            { src: "/demo/story-cover.jpg", label: "표지" },
            { src: "/demo/story-meet.jpg", label: "첫 만남" },
            { src: "/demo/story-rain.jpg", label: "특별한 날" },
            { src: "/demo/story-sea.jpg", label: "약속" },
          ].map((item) => (
            <figure key={item.label}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.label} />
              <figcaption>{item.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="moa-section">
        <h2>우리의 이야기를 만드는 방법</h2>
        <ol className="how-steps">
          <li>
            <strong>STEP 01</strong>
            <span>그림책 미리보기를 살펴보세요.</span>
          </li>
          <li>
            <strong>STEP 02</strong>
            <span>무료 제작에 인스타그램으로 신청하세요.</span>
          </li>
          <li>
            <strong>STEP 03</strong>
            <span>선정되면 우리만의 그림책을 만나요.</span>
          </li>
        </ol>
      </section>

      <section className={`moa-section event-panel ${campaignOpen ? "" : "closed"}`}>
        <div className="event-panel-art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/demo/story-cover.jpg" alt="" />
        </div>
        <div className="event-panel-copy">
          <p className="offer-kicker">첫 {campaign.freeSlots}커플</p>
          <h2>
            디지털 그림책을
            <br />
            선물합니다
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
              무료 제작 신청하기
            </PrimaryButton>
          ) : (
            <p className="closed-note">현재 무료 제작 모집이 마감되었습니다.</p>
          )}
          <p className="offer-note">
            신청 무료 · 선정 커플 한정 · 디지털 PDF 제공
          </p>
        </div>
      </section>

      <footer className="moa-footer">
        <MoaLogo size="sm" />
        <p>{campaign.slogan}</p>
        <div>
          <a href="mailto:hello@moa.story">문의하기</a>
          <span>·</span>
          <span>개인정보 처리 안내</span>
        </div>
      </footer>
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
  const isLast = page === pages.length - 1;
  const current = pages[page];

  useEffect(() => {
    track("storybook_preview_viewed", { page: page + 1 });
  }, [page]);

  return (
    <main className="preview-screen moa-picturebook">
      <header className="preview-header">
        <button className="icon-button" aria-label="뒤로" onClick={onBack}>
          <ArrowLeft size={21} />
        </button>
        <div>
          <strong>그림책 미리보기</strong>
          <span>이렇게 한 권이 완성돼요</span>
        </div>
        <span className="page-number">
          {page + 1} / {pages.length}
        </span>
      </header>

      <div className="picturebook-stage">
        {current.kind === "cover" ? (
          <article className="picturebook-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.image} alt="" />
            <div className="picturebook-cover-copy">
              <small>{current.chapter}</small>
              <h2>{current.title}</h2>
              <p>{current.body}</p>
            </div>
          </article>
        ) : (
          <article className="picturebook-spread">
            <div className="spread-art">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={current.image} alt="" />
            </div>
            <div className="spread-text">
              <span className="spread-chapter">{current.chapter}</span>
              <h2>{current.title}</h2>
              <p>{current.body}</p>
            </div>
          </article>
        )}

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
        {pages.map((p, i) => (
          <span key={p.id} className={page === i ? "active" : ""} />
        ))}
      </div>

      <footer className="preview-footer">
        <div>
          <span>샘플 그림책</span>
          <strong>{isLast ? "마음에 드시나요?" : "장을 넘겨보세요"}</strong>
        </div>
        <PrimaryButton
          onClick={() => {
            if (isLast) {
              track("free_application_clicked", { source: "preview" });
              onContinue();
            } else setPage(page + 1);
          }}
        >
          {isLast ? "무료 제작 신청하기" : "다음 장 넘기기"}
        </PrimaryButton>
      </footer>
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
          <img src="/demo/story-cover.jpg" alt="MOA 디지털 그림책" />
          <div className="offer-visual-copy">
            <span>DIGITAL STORYBOOK</span>
            <strong>Our Story</strong>
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
