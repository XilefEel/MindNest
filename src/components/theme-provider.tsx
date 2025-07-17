// components/theme-provider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}) {
  return (
    <NextThemesProvider
      attribute="class" // <== very important!
      defaultTheme="system"
      enableSystem
      storageKey="mindnest-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
