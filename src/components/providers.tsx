"use client";

import { ThemeProvider } from "next-themes";
import { StoryProvider } from "@/components/story-provider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider forcedTheme="light" enableSystem={false} attribute="class">
      <StoryProvider>
        {children}
        <Toaster position="top-center" />
      </StoryProvider>
    </ThemeProvider>
  );
}
