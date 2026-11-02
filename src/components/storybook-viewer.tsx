"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Maximize2, Sparkles } from "lucide-react";
import { BookCover, CoverStyleSelector } from "@/components/book-cover";
import { useStory } from "@/components/story-provider";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { openingText } from "@/lib/books";
import { formatKoreanDate, formatPeriodRange, volumeCode } from "@/lib/dates";
import type { Book, BookChapter } from "@/lib/types";

const controlClass =
  "static! inset-auto! size-11 translate-none! rotate-0!";

export function StorybookViewer({
  book,
  names,
  defaultFullscreen = false,
}: {
  book: Book;
  names: string;
  defaultFullscreen?: boolean;
}) {
  const { setBookCoverStyle } = useStory();
  const [fullscreen, setFullscreen] = useState(defaultFullscreen);
  const slides = useMemo(() => buildBookSlides(book, names), [book, names]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <CoverStyleSelector
          value={book.coverStyle}
          onChange={(style) => void setBookCoverStyle(book.volume, style)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-10 gap-1.5 bg-card px-3 text-xs"
          onClick={() => setFullscreen(true)}
        >
          <Maximize2 strokeWidth={1.6} className="size-3.5" />
          전체화면
        </Button>
      </div>

      <BookDeck slides={slides} />

      <Button asChild className="h-12 w-full text-base font-semibold">
        <Link href={`/books/${book.volume}/order`}>
          우리의 책으로 간직하기
          <ArrowRight strokeWidth={1.75} />
        </Link>
      </Button>

      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-h-[92dvh] max-w-lg overflow-y-auto p-4 sm:max-w-lg">
          <div className="pr-8">
            <DialogTitle className="text-base font-semibold">
              {book.title}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {volumeCode(book.volume)} · {formatPeriodRange(book.startDate, book.endDate)}
            </DialogDescription>
          </div>
          <BookDeck slides={slides} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BookDeck({
  slides,
}: {
  slides: Array<{ id: string; node: ReactNode }>;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  return (
    <div>
      <Carousel setApi={setApi} opts={{ align: "start" }}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="overflow-hidden rounded-xl ring-1 ring-border">
                {slide.node}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-3 flex items-center justify-center gap-4">
          <CarouselPrevious className={controlClass} />
          <p className="min-w-14 text-center text-xs font-medium text-muted-foreground tabular-nums" aria-live="polite">
            {current} / {count || slides.length}
          </p>
          <CarouselNext className={controlClass} />
        </div>
      </Carousel>
    </div>
  );
}

function buildBookSlides(book: Book, names: string) {
  const opening = openingText(book, names);
  const pages: Array<{ id: string; node: ReactNode }> = [
    {
      id: "cover",
      node: (
        <div className="flex min-h-[27rem] flex-col items-center justify-center bg-background p-5">
          <div className="w-full max-w-[17rem] overflow-visible">
            <BookCover
              volume={book.volume}
              title={book.title}
              names={names}
              startDate={book.startDate}
              endDate={book.endDate}
              photos={book.coverPhotos}
              styleVariant={book.coverStyle}
            />
          </div>
        </div>
      ),
    },
    {
      id: "story-intro",
      node: (
        <PageFrame kicker={`${volumeCode(book.volume)} · 이야기`} title={book.label}>
          <p className="mt-4 text-[15px] leading-7 whitespace-pre-wrap">{opening}</p>

          <div className="mt-6 border-t border-border pt-4">
            <p className="text-xs font-semibold text-muted-foreground">목차</p>
            {book.chapters.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                이 기간에 남긴 기록이 아직 없어요.
              </p>
            ) : (
              <ol className="mt-2.5 space-y-2">
                {book.chapters.map((chapter, index) => (
                  <li
                    key={chapter.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="font-medium">{chapter.title}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <p className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles strokeWidth={1.6} className="size-3.5 text-primary" />
            남긴 기록으로만 구성했어요. 없는 일은 지어내지 않아요.
          </p>
        </PageFrame>
      ),
    },
  ];

  for (const chapter of book.chapters) {
    pages.push(...chapterSpreads(chapter));
  }

  pages.push({
    id: "closing",
    node: (
      <PageFrame
        kicker={formatKoreanDate(book.anniversaryDate)}
        title="마지막 페이지"
      >
        <p className="mt-4 text-[15px] leading-7 whitespace-pre-wrap">{book.closing}</p>
        <Separator className="my-8" />
        <p className="text-xs font-medium text-muted-foreground">
          {names} · {volumeCode(book.volume)}
        </p>
      </PageFrame>
    ),
  });

  return pages;
}

function chapterSpreads(chapter: BookChapter): Array<{ id: string; node: ReactNode }> {
  const photos = chapter.photos;

  if (photos.length === 1) {
    return [
      {
        id: `${chapter.id}-photo-essay`,
        node: (
          <article className="flex min-h-[27rem] flex-col bg-card">
            <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photos[0].src} alt="" className="size-full object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <p className="text-xs font-semibold text-primary">{chapter.title}</p>
                <p className="mt-2.5 text-sm leading-7 whitespace-pre-wrap">
                  {chapter.body}
                </p>
              </div>
            </div>
          </article>
        ),
      },
    ];
  }

  if (photos.length >= 2) {
    return [
      {
        id: `${chapter.id}-full-photo`,
        node: (
          <article className="relative flex min-h-[27rem] flex-col justify-end overflow-hidden bg-foreground text-background">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[0].src}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-foreground/30" />
            <div className="relative p-5">
              <p className="text-xs text-background/80">{chapter.title}</p>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-background">
                {chapter.body}
              </p>
            </div>
          </article>
        ),
      },
      {
        id: `${chapter.id}-grid`,
        node: (
          <PageFrame kicker="포토 에세이" title={chapter.title}>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {photos.slice(0, 4).map((photo) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${photo.memoryId}-${photo.index}`}
                  src={photo.src}
                  alt=""
                  className="aspect-square w-full rounded-lg object-cover"
                />
              ))}
            </div>
            <p className="mt-4 text-sm leading-7 whitespace-pre-wrap">{chapter.body}</p>
          </PageFrame>
        ),
      },
    ];
  }

  return [
    {
      id: `${chapter.id}-story`,
      node: (
        <PageFrame kicker="기록" title={chapter.title}>
          <p className="mt-4 text-[15px] leading-7 whitespace-pre-wrap">{chapter.body}</p>
        </PageFrame>
      ),
    },
  ];
}

function PageFrame({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="min-h-[27rem] bg-card p-5">
      <p className="text-xs font-semibold text-primary">{kicker}</p>
      <h2 className="mt-1.5 text-xl leading-snug font-bold tracking-tight text-balance">
        {title}
      </h2>
      {children}
    </article>
  );
}
