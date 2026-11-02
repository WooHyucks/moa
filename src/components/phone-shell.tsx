import { cn } from "@/lib/utils";

export function PhoneShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="site-shell flex min-h-dvh justify-center bg-[var(--shell)]">
      <div
        className={cn(
          "phone-shell relative w-full max-w-[390px] min-h-dvh overflow-x-clip bg-background shadow-[0_0_60px_rgb(59_44_40_/_10%)]",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
