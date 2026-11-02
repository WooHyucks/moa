import { Suspense } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  nav = true,
  className,
}: {
  children: React.ReactNode;
  nav?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto min-h-dvh w-full bg-background px-[18px] pt-4",
        nav && "pb-[calc(5.5rem+env(safe-area-inset-bottom))]",
        !nav && "pb-8",
        className,
      )}
    >
      {children}
      {nav ? (
        <Suspense
          fallback={
            <div className="fixed inset-x-0 bottom-0 mx-auto h-[76px] max-w-[390px] border-t border-[#eee5e1] bg-card/94" />
          }
        >
          <BottomNav />
        </Suspense>
      ) : null}
    </div>
  );
}
