import anime from "animejs";
import { useEffect, useRef } from "react";

interface AnimeCounterOptions {
  value: number;
  duration?: number;
  round?: number;
}

export function useAnimeCounter<T extends HTMLElement>({
  value,
  duration = 1500,
  round = 1,
}: AnimeCounterOptions) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (elementRef.current) {
      anime({
        targets: elementRef.current,
        innerHTML: [0, value],
        easing: "easeOutExpo",
        duration,
        round,
      });
    }
  }, [value, duration, round]);

  return elementRef;
}
