// src/components/ui/CollapsibleSection.tsx
"use client";

import { useEffect, useRef } from "react";

declare const anime: { (params: Record<string, unknown>): void };

interface CollapsibleSectionProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export default function CollapsibleSection({
  isOpen,
  children,
}: CollapsibleSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const runAnimation = () => {
      if (contentRef.current) {
        anime({
          targets: contentRef.current,
          height: isOpen ? contentRef.current.scrollHeight : 0,
          opacity: isOpen ? [0, 1] : [1, 0],
          paddingTop: isOpen ? ["0rem", "1rem"] : ["1rem", "0rem"],
          paddingBottom: isOpen ? ["0rem", "1rem"] : ["1rem", "0rem"],
          duration: 400,
          easing: "easeOutSine",
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
  }, [isOpen]);

  return (
    <div ref={contentRef} style={{ overflow: "hidden", height: 0 }}>
      {children}
    </div>
  );
}
