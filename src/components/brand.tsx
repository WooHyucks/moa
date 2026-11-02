import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="grid size-[29px] place-items-center rounded-[9px_9px_9px_3px] bg-primary text-primary-foreground">
        <BookOpen strokeWidth={2} className="size-[17px]" />
      </span>
      <span className="text-base font-extrabold tracking-[-0.04em]">우리의 책</span>
    </div>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "block text-[10px] font-extrabold tracking-[0.18em] text-primary uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
