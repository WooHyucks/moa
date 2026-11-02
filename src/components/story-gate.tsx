"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { useStory } from "@/components/story-provider";
import { Skeleton } from "@/components/ui/skeleton";

export function StoryGate({ children }: { children: React.ReactNode }) {
  const { ready, state } = useStory();
  const router = useRouter();

  useEffect(() => {
    if (ready && !state.couple) router.replace("/");
  }, [ready, state.couple, router]);

  if (!ready || !state.couple) {
    return (
      <AppShell>
        <div className="space-y-4" aria-hidden>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-14 w-40" />
          <Skeleton className="mx-auto mt-8 h-80 w-56" />
          <Skeleton className="h-12 w-full" />
        </div>
      </AppShell>
    );
  }

  return children;
}
