import { Suspense } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto min-h-dvh w-full max-w-lg px-5 pt-8 lg:max-w-xl">
          <div className="h-5 w-24 animate-pulse rounded-md bg-muted" />
          <div className="mt-4 h-14 w-40 animate-pulse rounded-md bg-muted" />
        </div>
      }
    >
      <div className="page-enter">{children}</div>
    </Suspense>
  );
}
