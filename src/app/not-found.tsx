import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center px-5 lg:max-w-xl">
      <p className="text-xs font-semibold text-primary">404</p>
      <h1 className="mt-2 text-2xl leading-snug font-bold tracking-tight">
        찾으시는 페이지가 없어요
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        주소를 다시 확인하거나 첫 화면으로 이동해 주세요.
      </p>
      <Button asChild className="mt-6 h-12 w-fit px-6 text-base font-semibold">
        <Link href="/">첫 화면으로</Link>
      </Button>
    </main>
  );
}
