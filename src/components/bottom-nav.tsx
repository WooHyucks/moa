"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarDays, House, Plus, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/home") return pathname === "/home";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();
  const homeActive = isActive(pathname, "/home");
  const booksActive = isActive(pathname, "/books");
  const profileActive = isActive(pathname, "/profile");

  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[390px] border-t border-[#eee5e1] bg-card/94 backdrop-blur-[14px]"
    >
      <div className="grid h-[76px] grid-cols-5 items-end px-1 pb-[env(safe-area-inset-bottom)]">
        <NavItem href="/home" label="홈" active={homeActive}>
          <House strokeWidth={homeActive ? 2.2 : 1.7} className="size-[22px]" />
        </NavItem>

        <NavItem href="/books" label="우리의 책" active={booksActive}>
          <BookOpen strokeWidth={booksActive ? 2.2 : 1.7} className="size-[22px]" />
        </NavItem>

        <Link
          href="/write"
          aria-label="기록 추가"
          className="relative flex h-full items-start justify-center pt-0"
        >
          <span className="absolute -top-[25px] flex size-[51px] items-center justify-center rounded-[17px] border-4 border-background bg-primary text-primary-foreground shadow-[0_8px_20px_rgb(241_107_104_/_28%)]">
            <Plus strokeWidth={2.4} className="size-6" />
          </span>
        </Link>

        <span className="flex min-h-[50px] flex-col items-center justify-center gap-0.5 text-[8px] font-medium text-[#a29b98]">
          <CalendarDays strokeWidth={1.7} className="size-[22px]" />
          캘린더
        </span>

        <NavItem href="/profile" label="우리" active={profileActive}>
          <UserRound strokeWidth={profileActive ? 2.2 : 1.7} className="size-[22px]" />
        </NavItem>
      </div>
    </nav>
  );
}

function NavItem({
  href,
  label,
  active,
  children,
}: {
  href: string;
  label: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-[50px] flex-col items-center justify-center gap-0.5 text-[8px] font-medium",
        active ? "text-primary" : "text-[#a29b98]",
      )}
    >
      {children}
      {label}
    </Link>
  );
}
