"use client";

import { EMOTIONS } from "@/lib/emotions";
import type { EmotionId } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EmotionPickerProps {
  value?: EmotionId;
  onChange: (value?: EmotionId) => void;
}

export function EmotionPicker({ value, onChange }: EmotionPickerProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="오늘의 감정">
      {EMOTIONS.map((emotion) => {
        const selected = value === emotion.id;
        return (
          <button
            key={emotion.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(selected ? undefined : emotion.id)}
            className={cn(
              "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors",
              selected
                ? "border-primary bg-secondary text-foreground"
                : "border-border bg-card text-foreground",
            )}
          >
            <span aria-hidden>{emotion.mark}</span>
            {emotion.label}
          </button>
        );
      })}
    </div>
  );
}
