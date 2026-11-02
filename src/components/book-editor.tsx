"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CoverStyleSelector } from "@/components/book-cover";
import { useStory } from "@/components/story-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Book, BookChapter, CoverStyle } from "@/lib/types";

export function BookEditor({ book }: { book: Book }) {
  const { state, saveBookDraft, clearBookDraft } = useStory();
  const existing = state.bookDrafts.find((draft) => draft.volume === book.volume);
  const [title, setTitle] = useState(book.title);
  const [closing, setClosing] = useState(book.closing);
  const [coverStyle, setCoverStyle] = useState<CoverStyle>(book.coverStyle);
  const [chapters, setChapters] = useState<BookChapter[]>(book.chapters);
  const [removed, setRemoved] = useState(existing?.removedPhotos ?? []);
  const [saving, setSaving] = useState(false);

  function updateChapter(id: string, patch: Partial<Pick<BookChapter, "title" | "body">>) {
    setChapters((current) =>
      current.map((chapter) => (chapter.id === id ? { ...chapter, ...patch } : chapter)),
    );
  }

  async function save() {
    setSaving(true);
    try {
      await saveBookDraft({
        volume: book.volume,
        title: title.trim() || book.title,
        closing: closing.trim(),
        coverStyle,
        chapters: chapters.map((chapter) => ({
          id: chapter.id,
          title: chapter.title.trim() || chapter.title,
          body: chapter.body,
        })),
        removedPhotos: removed,
        customized: true,
        updatedAt: new Date().toISOString(),
      });
      toast("다듬은 내용을 저장했어요.");
    } catch {
      toast.error("저장하지 못했어요.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-muted-foreground">
        글과 사진 배치만 다듬을 수 있어요. 기록에 없는 일은 새로 쓰지 말아 주세요.
      </p>

      <div className="grid gap-2">
        <Label>표지 스타일</Label>
        <CoverStyleSelector value={coverStyle} onChange={setCoverStyle} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="book-title">책 제목</Label>
        <Input id="book-title" value={title} onChange={(event) => setTitle(event.target.value)} />
      </div>

      {chapters.length === 0 ? (
        <p className="rounded-xl bg-secondary px-4 py-4 text-sm leading-relaxed">
          이 기간의 기록이 없어 비워 두었어요.
        </p>
      ) : (
        chapters.map((chapter) => (
          <section key={chapter.id} className="space-y-3 rounded-xl bg-card p-4 ring-1 ring-border">
            <div className="grid gap-2">
              <Label htmlFor={`chapter-${chapter.id}`}>장 제목</Label>
              <Input
                id={`chapter-${chapter.id}`}
                value={chapter.title}
                onChange={(event) => updateChapter(chapter.id, { title: event.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`body-${chapter.id}`}>내용</Label>
              <Textarea
                id={`body-${chapter.id}`}
                value={chapter.body}
                onChange={(event) => updateChapter(chapter.id, { body: event.target.value })}
                className="min-h-36"
              />
            </div>
            {chapter.photos.length > 0 ? (
              <ul className="grid grid-cols-2 gap-2">
                {chapter.photos.map((photo) => (
                  <li key={`${photo.memoryId}-${photo.index}`} className="space-y-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.src} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-full bg-card"
                      onClick={() => {
                        setRemoved((current) => [
                          ...current,
                          { memoryId: photo.memoryId, index: photo.index },
                        ]);
                        setChapters((current) =>
                          current.map((item) =>
                            item.id === chapter.id
                              ? {
                                  ...item,
                                  photos: item.photos.filter(
                                    (itemPhoto) =>
                                      !(
                                        itemPhoto.memoryId === photo.memoryId &&
                                        itemPhoto.index === photo.index
                                      ),
                                  ),
                                }
                              : item,
                          ),
                        );
                      }}
                    >
                      책에서 빼기
                    </Button>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))
      )}

      <div className="grid gap-2">
        <Label htmlFor="book-closing">마지막 페이지</Label>
        <Textarea
          id="book-closing"
          value={closing}
          onChange={(event) => setClosing(event.target.value)}
          className="min-h-28"
        />
      </div>

      <Button
        type="button"
        className="h-12 w-full text-base font-semibold"
        disabled={saving}
        onClick={() => void save()}
      >
        다듬은 내용 저장
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="button" variant="ghost" className="h-11 w-full text-muted-foreground">
            기록 그대로 되돌리기
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">다시 엮을까요?</AlertDialogTitle>
            <AlertDialogDescription>
              직접 고친 글은 지워지고, 남긴 기록으로만 다시 만들어요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-11">유지하기</AlertDialogCancel>
            <AlertDialogAction
              className="h-11"
              onClick={() => {
                void clearBookDraft(book.volume).then(() => {
                  toast("기록 그대로 다시 엮었어요.");
                });
              }}
            >
              되돌리기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
