import {
  addDays,
  differenceInCalendarDays,
  format,
  parseISO,
  startOfDay,
} from "date-fns";
import { ko } from "date-fns/locale";
import type { BookStatus } from "@/lib/types";

const BASE_MILESTONES: { days: number; label: string }[] = [
  { days: 100, label: "100일" },
  { days: 200, label: "200일" },
  { days: 365, label: "1주년" },
  { days: 500, label: "500일" },
  { days: 730, label: "2주년" },
  { days: 1000, label: "1000일" },
  { days: 1095, label: "3주년" },
];

export interface VolumeWindow {
  volume: number;
  days: number;
  label: string;
  title: string;
  startDate: string;
  endDate: string;
  anniversaryDate: string;
  status: BookStatus;
}

export function toDateKey(date: Date) {
  return format(startOfDay(date), "yyyy-MM-dd");
}

export function todayKey(now = new Date()) {
  return toDateKey(now);
}

export function formatKoreanDate(dateKey: string) {
  return format(parseISO(dateKey), "yyyy년 M월 d일", { locale: ko });
}

export function formatMonthHeading(monthKey: string) {
  return format(parseISO(`${monthKey}-01`), "yyyy년 M월", { locale: ko });
}

export function formatShortDate(dateKey: string) {
  return format(parseISO(dateKey), "M월 d일 EEEE", { locale: ko });
}

export function formatPeriodRange(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) return "2026.01 — 2026.12";
  const start = startDate.slice(0, 7).replace("-", ".");
  const end = endDate.slice(0, 7).replace("-", ".");
  return start === end ? start : `${start} — ${end}`;
}

export function volumeCode(volume: number) {
  return `Vol. ${String(volume).padStart(2, "0")}`;
}

export function daysTogether(startDate: string, now = new Date()) {
  return Math.max(
    differenceInCalendarDays(startOfDay(now), parseISO(startDate)) + 1,
    1,
  );
}

export function daysUntil(dateKey: string, now = new Date()) {
  return differenceInCalendarDays(parseISO(dateKey), startOfDay(now));
}

function milestoneDate(startDate: string, dayNumber: number) {
  return addDays(parseISO(startDate), dayNumber - 1);
}

function milestonesFor(startDate: string, now = new Date()) {
  const list = [...BASE_MILESTONES];
  let year = 4;
  const today = startOfDay(now);

  while (list.length < 40) {
    const last = list[list.length - 1];
    if (milestoneDate(startDate, last.days) > today) break;

    const days = year * 365;
    if (days <= last.days) {
      year += 1;
      continue;
    }

    list.push({ days, label: `${year}주년` });
    year += 1;
  }

  return list;
}

export function getVolumeWindows(startDate: string, now = new Date()): VolumeWindow[] {
  const milestones = milestonesFor(startDate, now);
  const today = todayKey(now);

  return milestones.map((milestone, index) => {
    const end = milestoneDate(startDate, milestone.days);
    const start =
      index === 0
        ? parseISO(startDate)
        : addDays(milestoneDate(startDate, milestones[index - 1].days), 1);
    const endKey = toDateKey(end);

    return {
      volume: index + 1,
      days: milestone.days,
      label: milestone.label,
      title: index === 0 ? "우리의 첫 번째 이야기" : `${milestone.label}의 이야기`,
      startDate: toDateKey(start),
      endDate: endKey,
      anniversaryDate: endKey,
      status: endKey <= today ? "ready" : "collecting",
    };
  });
}

export function getShelfVolumes(volumes: VolumeWindow[]) {
  const ready = volumes.filter((volume) => volume.status === "ready");
  const current = volumes.find((volume) => volume.status === "collecting");
  return current ? [...ready, current] : ready;
}

export function getFeaturedVolume(volumes: VolumeWindow[], now = new Date()) {
  const today = todayKey(now);
  const unlockedToday = volumes.find(
    (volume) => volume.status === "ready" && volume.anniversaryDate === today,
  );
  if (unlockedToday) return unlockedToday;
  return volumes.find((volume) => volume.status === "collecting") ?? volumes.at(-1) ?? null;
}
