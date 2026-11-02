"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { formatPeriodRange, volumeCode } from "@/lib/dates";
import type { CoverStyle } from "@/lib/types";
import { cn } from "@/lib/utils";

export const COVER_STYLE_OPTIONS: { id: CoverStyle; label: string }[] = [
  { id: "full", label: "Full Photo" },
  { id: "editorial", label: "Editorial" },
  { id: "collage", label: "Collage" },
];

interface BookCoverProps {
  volume: number;
  title: string;
  names: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  photos?: string[];
  styleVariant?: CoverStyle;
  size?: "md" | "sm" | "xs";
  animated?: boolean;
  className?: string;
}

export function BookCover({
  volume,
  title,
  names,
  period,
  startDate,
  endDate,
  photos = [],
  styleVariant = "full",
  size = "md",
  animated = false,
  className,
}: BookCoverProps) {
  const reduce = useReducedMotion();
  const rangeText = period ?? formatPeriodRange(startDate, endDate);
  const code = volumeCode(volume);
  const tiny = size === "xs";
  const compact = size === "sm" || tiny;

  return (
    <motion.div
      className={cn("w-full min-w-0 select-none", className)}
      initial={animated && !reduce ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-card text-left",
          "shadow-[13px_15px_27px_rgb(74_43_36_/_22%),6px_0_0_#e2d8d4]",
          tiny ? "aspect-[3/4]" : compact ? "aspect-[190/260]" : "aspect-[190/260]",
        )}
      >
        {styleVariant === "full" ? (
          <FullPhotoFace
            code={code}
            title={title}
            names={names}
            photo={photos[0]}
            compact={compact}
            tiny={tiny}
          />
        ) : null}
        {styleVariant === "editorial" ? (
          <EditorialFace
            code={code}
            title={title}
            names={names}
            period={rangeText}
            photo={photos[0]}
            compact={compact}
            tiny={tiny}
          />
        ) : null}
        {styleVariant === "collage" ? (
          <CollageFace photos={photos} tiny={tiny} />
        ) : null}
      </div>
    </motion.div>
  );
}

function FullPhotoFace({
  code,
  title,
  names,
  photo,
  compact,
  tiny,
}: {
  code: string;
  title: string;
  names: string;
  photo?: string;
  compact: boolean;
  tiny: boolean;
}) {
  return (
    <div className="relative size-full bg-secondary">
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" className="absolute inset-0 size-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-primary" />
      )}
      <div className="absolute inset-0 bg-[rgb(28_21_20_/_15%)]" />
      {!tiny ? (
        <div
          className={cn(
            "absolute inset-0 z-[1] flex flex-col items-center justify-end text-white",
            compact ? "pb-5" : "pb-7",
          )}
        >
          <small className="text-[7px] tracking-[0.2em]">{code.toUpperCase()}</small>
          <strong
            className={cn(
              "mt-1.5 font-extrabold tracking-[0.02em]",
              compact ? "text-lg" : "text-2xl",
            )}
          >
            {/[A-Za-z]/.test(title) ? title : "OUR DAYS"}
          </strong>
          <em className="mt-1.5 text-[8px] not-italic">{names}</em>
        </div>
      ) : null}
    </div>
  );
}

function EditorialFace({
  code,
  title,
  names,
  period,
  photo,
  compact,
  tiny,
}: {
  code: string;
  title: string;
  names: string;
  period: string;
  photo?: string;
  compact: boolean;
  tiny: boolean;
}) {
  return (
    <div
      className={cn(
        "flex size-full flex-col items-center bg-[#f7f2ec] text-center text-foreground",
        tiny ? "p-2" : compact ? "p-3.5" : "p-5",
      )}
    >
      {!tiny ? (
        <small className="text-[6px] tracking-[0.15em] text-muted-foreground">
          OUR SECOND YEAR
        </small>
      ) : (
        <small className="text-[6px] tracking-[0.12em] text-primary">{code}</small>
      )}

      <div
        className={cn(
          "w-full overflow-hidden bg-muted",
          tiny ? "mt-1.5 min-h-0 flex-1" : compact ? "mt-3 h-[100px]" : "mt-5 h-[150px]",
        )}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="size-full object-cover" />
        ) : null}
      </div>

      {!tiny ? (
        <>
          <strong
            className={cn(
              "mt-4 font-bold",
              compact ? "text-sm" : "text-base",
            )}
          >
            {/[A-Za-z]/.test(title) ? "매일의 우리" : title}
          </strong>
          <span className="mt-1.5 text-[6px] tracking-[0.12em] text-muted-foreground">
            {period}
          </span>
          <span className="sr-only">{names}</span>
        </>
      ) : null}
    </div>
  );
}

function CollageFace({
  photos,
  tiny,
}: {
  photos: string[];
  tiny: boolean;
}) {
  const left = photos[0];
  const topRight = photos[1] ?? photos[0];
  const bottomRight = photos[2] ?? photos[1] ?? photos[0];

  return (
    <div className="relative grid size-full grid-cols-2 grid-rows-2 gap-[3px] bg-card">
      <div className="row-span-2 overflow-hidden bg-muted">
        {left ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={left} alt="" className="size-full object-cover" />
        ) : null}
      </div>
      <div className="overflow-hidden bg-muted">
        {topRight ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={topRight} alt="" className="size-full object-cover" />
        ) : null}
      </div>
      <div className="overflow-hidden bg-muted">
        {bottomRight ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bottomRight} alt="" className="size-full object-cover" />
        ) : null}
      </div>
      {!tiny ? (
        <span className="absolute bottom-3.5 left-3 bg-card px-[7px] py-[7px] text-sm leading-[1.05] font-extrabold text-foreground">
          US,
          <br />
          LATELY
        </span>
      ) : null}
    </div>
  );
}

export function CoverStyleSelector({
  value,
  onChange,
  className,
}: {
  value: CoverStyle;
  onChange: (style: CoverStyle) => void;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="표지 스타일"
      className={cn("grid grid-cols-3 gap-1.5", className)}
    >
      {COVER_STYLE_OPTIONS.map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "inline-flex min-h-[42px] items-center justify-center gap-1 rounded-[13px] border px-2 text-xs font-semibold transition-colors",
              active
                ? "border-primary bg-[#fff7f5] text-primary"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {active ? <Check strokeWidth={2.5} className="size-3.5" /> : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
