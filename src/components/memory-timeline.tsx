"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Ellipsis, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DeleteMemoryDialog } from "@/components/delete-memory-dialog";
import { useStory } from "@/components/story-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { formatShortDate } from "@/lib/dates";
import { emotionLabel, emotionMark } from "@/lib/emotions";
import { initialOf, selfPartner } from "@/lib/partners";
import type { Memory, Partner } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MemoryTimeline({
  memories,
  emptyText = "첫 번째 순간을 사진이나 짧은 글로 남겨 보세요.",
  showEmptyCta = true,
}: {
  memories: Memory[];
  emptyText?: string;
  showEmptyCta?: boolean;
}) {
  const router = useRouter();
  const { state, deleteMemory } = useStory();
  const [menuTarget, setMenuTarget] = useState<Memory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Memory | null>(null);

  const ordered = [...memories].sort(
    (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
  );

  if (ordered.length === 0) {
    return (
      <Card size="sm" className="items-center px-5 py-10 text-center">
        <CardContent className="flex flex-col items-center px-0">
          <p className="text-sm leading-relaxed text-muted-foreground">{emptyText}</p>
          {showEmptyCta ? (
            <Button asChild className="mt-4 h-11 rounded-full px-5 text-sm font-medium">
              <Link href="/write">
                <Plus strokeWidth={1.75} />
                추억 남기기
              </Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <ol className="divide-y divide-border">
        {ordered.map((memory) => {
          const author =
            state.partners.find((partner) => partner.id === memory.authorId) ??
            selfPartner(state.partners);
          return (
            <li key={memory.id} className="py-6 first:pt-2">
              <MemoryPostCard
                memory={memory}
                author={author}
                onOpenMenu={() => setMenuTarget(memory)}
              />
            </li>
          );
        })}
      </ol>

      <Drawer open={Boolean(menuTarget)} onOpenChange={(open) => !open && setMenuTarget(null)}>
        <DrawerContent>
          {menuTarget ? (
            <>
              <DrawerHeader className="text-left">
                <DrawerTitle className="text-base font-semibold">
                  {formatShortDate(menuTarget.date)}
                </DrawerTitle>
                <DrawerDescription>기록을 수정하거나 삭제할 수 있어요.</DrawerDescription>
              </DrawerHeader>
              <DrawerFooter className="pb-[max(1rem,env(safe-area-inset-bottom))]">
                <Button className="h-12" asChild>
                  <Link href={`/write/${menuTarget.id}`}>
                    <Pencil strokeWidth={1.6} />
                    수정하기
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-12 bg-card text-destructive hover:text-destructive"
                  onClick={() => {
                    setDeleteTarget(menuTarget);
                    setMenuTarget(null);
                  }}
                >
                  <Trash2 strokeWidth={1.6} />
                  삭제하기
                </Button>
              </DrawerFooter>
            </>
          ) : null}
        </DrawerContent>
      </Drawer>

      <DeleteMemoryDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          const id = deleteTarget.id;
          setDeleteTarget(null);
          void deleteMemory(id)
            .then(() => {
              toast("기록을 지웠어요.");
              router.refresh();
            })
            .catch(() => toast.error("기록을 지우지 못했어요."));
        }}
      />
    </>
  );
}

function MemoryPostCard({
  memory,
  author,
  onOpenMenu,
}: {
  memory: Memory;
  author: Partner | null;
  onOpenMenu: () => void;
}) {
  const emotion = emotionLabel(memory.emotion);
  const mark = emotionMark(memory.emotion);
  const authorName = author?.name ?? "우리";
  const hasPhotos = memory.photos.length > 0;

  return (
    <article className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarFallback className="bg-secondary text-xs font-semibold text-foreground">
              {initialOf(authorName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight">{authorName}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{formatShortDate(memory.date)}</p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="-mr-2 size-11 text-muted-foreground"
          aria-label={`${formatShortDate(memory.date)} 기록 메뉴`}
          onClick={onOpenMenu}
        >
          <Ellipsis strokeWidth={1.75} className="size-5" />
        </Button>
      </div>

      {hasPhotos ? (
        <PhotoCarousel photos={memory.photos} />
      ) : (
        <div className="rounded-xl bg-card p-5 ring-1 ring-border">
          {emotion ? (
            <Badge variant="secondary" className="mb-3 gap-1">
              <span aria-hidden>{mark}</span>
              {emotion}
            </Badge>
          ) : null}
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
            {memory.content?.trim() || "감정으로 남긴 하루"}
          </p>
        </div>
      )}

      {hasPhotos ? (
        <div className="space-y-1.5 pt-0.5">
          {emotion ? (
            <div>
              <Badge variant="secondary" className="gap-1">
                <span aria-hidden>{mark}</span>
                {emotion}
              </Badge>
            </div>
          ) : null}
          {memory.content?.trim() ? (
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
              <span className="mr-1.5 font-semibold">{authorName}</span>
              {memory.content.trim()}
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function PhotoCarousel({ photos }: { photos: string[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  if (photos.length === 1) {
    return (
      <div className="-mx-5 overflow-hidden bg-card sm:mx-0 sm:rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[0]}
          alt=""
          className="aspect-[4/5] w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative -mx-5 sm:mx-0">
      <Carousel setApi={setApi} opts={{ align: "start" }}>
        <CarouselContent className="-ml-0">
          {photos.map((photo, index) => (
            <CarouselItem key={`${index}-${photo.slice(-16)}`} className="pl-0">
              <div className="overflow-hidden bg-card sm:rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt=""
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <span
        className="pointer-events-none absolute top-3 right-3 rounded-full bg-foreground/70 px-2.5 py-1 text-[11px] font-medium text-background tabular-nums"
        aria-live="polite"
      >
        {current} / {photos.length}
      </span>

      <div className="mt-2.5 flex justify-center gap-1.5" aria-hidden>
        {photos.map((_, index) => (
          <span
            key={index}
            className={cn(
              "size-1.5 rounded-full transition-colors",
              index + 1 === current ? "bg-primary" : "bg-foreground/20",
            )}
          />
        ))}
      </div>
    </div>
  );
}
