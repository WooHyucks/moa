import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageHeader({
  title,
  backHref,
  trailing,
}: {
  title: string;
  backHref?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <header className="mb-5 flex items-center gap-1">
      {backHref ? (
        <Button variant="ghost" size="icon" className="-ml-2 size-11 shrink-0" asChild>
          <Link href={backHref} aria-label="뒤로">
            <ChevronLeft strokeWidth={1.75} />
          </Link>
        </Button>
      ) : null}
      <h1 className="min-w-0 flex-1 truncate text-lg font-semibold tracking-tight">{title}</h1>
      {trailing}
    </header>
  );
}
