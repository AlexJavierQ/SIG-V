"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";

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
    if (!contentRef.current) return;

    anime({
      targets: contentRef.current,
      height: isOpen ? contentRef.current.scrollHeight : 0,
      opacity: isOpen ? [0, 1] : [1, 0],
      paddingTop: isOpen ? ["0rem", "1rem"] : ["1rem", "0rem"],
      paddingBottom: isOpen ? ["0rem", "1rem"] : ["1rem", "0rem"],
      duration: 400,
      easing: "easeOutSine",
      complete: () => {
        if (isOpen && contentRef.current) {
          contentRef.current.style.height = "auto";
        }
      },
    });
  }, [isOpen]);

  return (
    <div
      ref={contentRef}
      style={{
        overflow: "hidden",
        height: 0,
        opacity: 0,
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      {children}
    </div>
  );
}
