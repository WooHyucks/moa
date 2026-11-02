"use client";

import { ArrowRight } from "lucide-react";
import { DEMO_PHOTOS } from "@/lib/demo";

export function LandingHero() {
  return (
    <section
      className="relative mx-[-20px] mt-[26px] h-[290px] overflow-hidden bg-secondary"
      aria-label="우리의 추억으로 완성되는 포토북"
    >
      <div
        aria-hidden
        className="absolute top-[70px] -left-[65px] size-[200px] rounded-full border border-primary/20"
      />

      {/* Polaroid — cafe */}
      <div className="absolute top-[105px] left-3 z-30 w-[93px] rotate-[-7deg] bg-card px-1.5 pt-1.5 pb-[18px] shadow-[0_8px_24px_rgb(83_55_48_/_13%)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={DEMO_PHOTOS.cafe}
          alt="함께한 카페의 순간"
          className="aspect-[81/86] w-full object-cover"
        />
        <span className="absolute bottom-1 left-[7px] text-[7px] text-muted-foreground">
          느린 토요일
        </span>
      </div>

      {/* Snap — beach */}
      <div className="absolute top-[52px] right-[5px] z-10 w-[94px] rotate-[7deg] bg-card px-1.5 pt-1.5 pb-[18px] shadow-[0_8px_24px_rgb(83_55_48_/_13%)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={DEMO_PHOTOS.beach}
          alt="바다 여행의 순간"
          className="aspect-[82/83] w-full object-cover"
        />
      </div>

      {/* Center photobook */}
      <div className="absolute top-[23px] left-1/2 z-20 h-[205px] w-[154px] -translate-x-1/2 rotate-[-2deg] bg-card shadow-[14px_18px_32px_rgb(79_45_39_/_20%),5px_0_0_#f0e9e5]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={DEMO_PHOTOS.couple}
          alt="커플 포토북 표지"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-[rgb(29_22_20_/_16%)]" />
        <div className="absolute inset-0 z-[1] flex flex-col items-center justify-end px-3 pb-[18px] text-center text-white">
          <span className="text-[22px] font-extrabold tracking-[0.03em]">
            OUR DAYS
          </span>
          <strong className="mt-[3px] text-[10px] font-semibold">
            서윤 그리고 지호
          </strong>
          <small className="mt-2.5 text-[7px] tracking-[0.16em]">
            2024 — 2025
          </small>
        </div>
      </div>

      <div className="absolute bottom-[19px] left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[9px] font-bold tracking-[0.06em] text-[#716a68]">
        <span>36개의 순간</span>
        <ArrowRight className="size-[15px]" strokeWidth={2} />
        <span>1권의 이야기</span>
      </div>
    </section>
  );
}
