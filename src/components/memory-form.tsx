"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, ImagePlus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DateField } from "@/components/date-field";
import { EmotionPicker } from "@/components/emotion-picker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { MAX_PHOTOS } from "@/lib/constants";
import { todayKey } from "@/lib/dates";
import { isEmotionId } from "@/lib/emotions";
import { fileToCompressedDataUrl } from "@/lib/images";
import type { EmotionId, Memory, MemoryInput } from "@/lib/types";

const memorySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "날짜를 선택해 주세요"),
  emotion: z.string(),
  content: z.string().max(4000, "4000자 안으로 적어 주세요"),
});

type MemoryValues = z.infer<typeof memorySchema>;

export function MemoryForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Memory;
  submitLabel: string;
  onSubmit: (input: MemoryInput) => Promise<void>;
}) {
  const [photos, setPhotos] = useState<string[]>(initial?.photos ?? []);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [compressing, setCompressing] = useState(false);

  const form = useForm<MemoryValues>({
    resolver: zodResolver(memorySchema),
    defaultValues: {
      date: initial?.date ?? todayKey(),
      emotion: initial?.emotion ?? "",
      content: initial?.content ?? "",
    },
  });

  async function addPhotos(list: FileList | null) {
    if (!list?.length) return;
    const room = MAX_PHOTOS - photos.length;
    if (room <= 0) {
      toast(`사진은 한 기록에 ${MAX_PHOTOS}장까지 남길 수 있어요.`);
      return;
    }

    setCompressing(true);
    try {
      const next: string[] = [];
      for (const file of Array.from(list).slice(0, room)) {
        try {
          next.push(await fileToCompressedDataUrl(file));
        } catch {
          toast.error("이 사진은 넣을 수 없어요. 다른 사진을 골라 주세요.");
        }
      }
      if (list.length > room) {
        toast(`사진은 한 기록에 ${MAX_PHOTOS}장까지 남길 수 있어요.`);
      }
      setPhotos((current) => [...current, ...next].slice(0, MAX_PHOTOS));
    } finally {
      setCompressing(false);
    }
  }

  function movePhoto(fromIndex: number, toIndex: number) {
    setPhotos((current) => {
      if (toIndex < 0 || toIndex >= current.length) return current;
      const copy = [...current];
      const [item] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, item);
      return copy;
    });
  }

  async function handleSubmit(values: MemoryValues) {
    const emotion = isEmotionId(values.emotion) ? values.emotion : undefined;
    const content = values.content.trim();
    if (!emotion && !content && photos.length === 0) {
      setFormError("감정, 글, 사진 중 하나 이상을 남겨 주세요.");
      return;
    }

    setFormError("");
    setSaving(true);
    try {
      await onSubmit({
        date: values.date,
        emotion: emotion as EmotionId | undefined,
        content,
        photos,
      });
    } catch {
      toast.error("저장하지 못했어요. 사진을 줄이고 다시 시도해 주세요.");
      setSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">사진</p>
            <p className="text-xs text-muted-foreground tabular-nums">
              {photos.length} / {MAX_PHOTOS}
            </p>
          </div>

          {photos.length === 0 ? (
            <label className="flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card px-4 text-center transition-colors hover:bg-muted/40">
              <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-foreground">
                <ImagePlus strokeWidth={1.6} className="size-5" />
              </span>
              <span className="text-sm font-medium">
                {compressing ? "사진을 불러오는 중" : "사진 추가하기"}
              </span>
              <span className="text-xs text-muted-foreground">
                사진 없이 글이나 감정만 남겨도 괜찮아요
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                disabled={compressing}
                onChange={(event) => {
                  void addPhotos(event.target.files);
                  event.target.value = "";
                }}
              />
            </label>
          ) : (
            <div className="space-y-2.5">
              <ul className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1">
                {photos.map((photo, index) => (
                  <li
                    key={`${index}-${photo.slice(-16)}`}
                    className="relative w-44 shrink-0 overflow-hidden rounded-xl bg-card ring-1 ring-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt=""
                      className="aspect-[4/5] w-full object-cover"
                    />
                    <span className="absolute top-2 left-2 rounded-full bg-foreground/70 px-2 py-0.5 text-[11px] font-medium text-background tabular-nums">
                      {index === 0 ? "대표" : index + 1}
                    </span>
                    <button
                      type="button"
                      className="absolute top-1.5 right-1.5 flex size-9 items-center justify-center rounded-full bg-foreground/75 text-background"
                      aria-label={`${index + 1}번째 사진 삭제`}
                      onClick={() =>
                        setPhotos((current) => current.filter((_, item) => item !== index))
                      }
                    >
                      <X strokeWidth={1.75} className="size-4" />
                    </button>
                    {photos.length > 1 ? (
                      <div className="flex border-t border-border bg-card">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => movePhoto(index, index - 1)}
                          aria-label="앞으로 이동"
                          className="flex h-10 flex-1 items-center justify-center text-xs text-foreground disabled:opacity-30"
                        >
                          <ChevronLeft strokeWidth={1.6} className="size-4" />
                        </button>
                        <button
                          type="button"
                          disabled={index === photos.length - 1}
                          onClick={() => movePhoto(index, index + 1)}
                          aria-label="뒤로 이동"
                          className="flex h-10 flex-1 items-center justify-center border-l border-border text-xs text-foreground disabled:opacity-30"
                        >
                          <ChevronRight strokeWidth={1.6} className="size-4" />
                        </button>
                      </div>
                    ) : null}
                  </li>
                ))}
                {photos.length < MAX_PHOTOS ? (
                  <li className="w-32 shrink-0">
                    <label className="flex aspect-[4/5] h-full w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-card text-xs font-medium text-muted-foreground">
                      <ImagePlus strokeWidth={1.6} className="size-5 text-foreground" />
                      {compressing ? "추가 중" : "사진 더하기"}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        disabled={compressing}
                        onChange={(event) => {
                          void addPhotos(event.target.files);
                          event.target.value = "";
                        }}
                      />
                    </label>
                  </li>
                ) : null}
              </ul>
            </div>
          )}
        </section>

        <FormField
          control={form.control}
          name="emotion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>오늘의 감정</FormLabel>
              <EmotionPicker
                value={isEmotionId(field.value) ? field.value : undefined}
                onChange={(emotion) => field.onChange(emotion ?? "")}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>글</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="오늘 우리에게 어떤 일이 있었나요?"
                  className="min-h-36 rounded-xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <DateField
                id="memory-date"
                label="날짜"
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

        <div className="sticky bottom-0 -mx-5 border-t border-border bg-background/95 px-5 py-3 backdrop-blur-md">
          <Button type="submit" className="h-12 w-full text-base" disabled={saving || compressing}>
            {saving ? "저장하는 중" : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
