"use client";
import { ThemeProvider } from "next-themes";

export default function Provider({ children }) {
  return <ThemeProvider defaultTheme="light">{children}</ThemeProvider>;
}
