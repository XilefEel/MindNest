"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

export function ThemeProvider({
  children,
  ...props
}: {
  children: ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="mindnest-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
