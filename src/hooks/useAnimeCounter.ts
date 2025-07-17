// src/hooks/useAnimeCounter.ts
import { useEffect, useRef } from "react";

declare const anime: (params: Record<string, unknown>) => void;

interface AnimeCounterOptions {
  value: number;
  duration?: number;
  round?: number;
}

// 1. Añadimos un tipo genérico <T> que debe ser un tipo de elemento HTML
export function useAnimeCounter<T extends HTMLElement>({
  value,
  duration = 1500,
  round = 1,
}: AnimeCounterOptions) {
  // 2. La ref ahora usará este tipo genérico T en lugar de HTMLElement
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const runAnimation = () => {
      if (elementRef.current) {
        anime({
          targets: elementRef.current,
          innerHTML: [0, value],
          easing: "easeOutExpo",
          duration,
          round,
        });
      }
    };

    if (typeof anime !== "undefined") {
      runAnimation();
    } else {
      window.addEventListener("animeLoaded", runAnimation);
    }

    return () => {
      window.removeEventListener("animeLoaded", runAnimation);
    };
  }, [value, duration, round]);

  return elementRef;
}
