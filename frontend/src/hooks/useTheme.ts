import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "system";
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (t: Theme) => {
      if (t === "dark") {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else if (t === "light") {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      } else {
        localStorage.removeItem("theme");
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        if (prefersDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    applyTheme(theme);

    // Keep "system" theme in sync with OS changes after mount
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (theme === "system") {
        if (mql.matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };
    try {
      mql.addEventListener("change", onChange);
    } catch {
      // Safari < 14 fallback: use legacy addListener if available
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mql.addListener?.(onChange);
    }
    return () => {
      try {
        mql.removeEventListener("change", onChange);
      } catch {
        // Safari < 14 fallback: use legacy removeListener if available
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mql.removeListener?.(onChange);
      }
    };
  }, [theme]);

  return { theme, setTheme };
}
