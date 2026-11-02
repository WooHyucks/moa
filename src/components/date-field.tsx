"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatKoreanDate } from "@/lib/dates";

interface DateFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function useIsDesktop() {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return matches;
}

export function DateField({ id, label, value, onChange }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const selected = value ? parseISO(value) : undefined;

  const calendar = (
    <Calendar
      mode="single"
      required
      selected={selected}
      defaultMonth={selected ?? new Date()}
      onSelect={(date) => {
        onChange(format(date, "yyyy-MM-dd"));
        setOpen(false);
      }}
      disabled={{ after: new Date() }}
      locale={ko}
      labels={{
        labelNav: () => "달력",
        labelPrevious: () => "이전 달",
        labelNext: () => "다음 달",
        labelMonthDropdown: () => "월 선택",
        labelYearDropdown: () => "연도 선택",
        labelDayButton: (date, modifiers) => {
          const formatted = format(date, "yyyy년 M월 d일 EEEE", { locale: ko });
          const today = modifiers.today ? "오늘, " : "";
          const selected = modifiers.selected ? ", 선택됨" : "";
          return `${today}${formatted}${selected}`;
        },
      }}
      captionLayout="dropdown"
      startMonth={new Date(1970, 0)}
      endMonth={new Date()}
      className="mx-auto [--cell-size:2.75rem]"
    />
  );

  const trigger = (
    <Button
      id={id}
      type="button"
      variant="outline"
      aria-label={
        value ? `${label}, ${formatKoreanDate(value)}` : `${label}, 날짜를 선택해 주세요`
      }
      className="h-12 w-full justify-start bg-card px-3 text-base font-normal"
    >
      <CalendarHeart strokeWidth={1.5} />
      {value ? formatKoreanDate(value) : "날짜를 선택해 주세요"}
    </Button>
  );

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {isDesktop ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>{trigger}</PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-2">
            {calendar}
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>{trigger}</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-base font-semibold">{label}</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-auto px-1 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {calendar}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
