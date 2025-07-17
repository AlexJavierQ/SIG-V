"use client";

import { useEffect } from "react";
import anime from "animejs/lib/anime.es.js";
import { useRouter } from "next/navigation";

export default function LogoLandingPage() {
  const router = useRouter();

  useEffect(() => {
    const circle = document.querySelector<SVGCircleElement>(".neon-circle");
    if (!circle) return;

    const length = circle.getTotalLength();

    // Setup inicial: círculo no visible
    circle.style.strokeDasharray = length.toString();
    circle.style.strokeDashoffset = length.toString();

    const timeline = anime.timeline({
      easing: "easeInOutSine",
      complete: () => {
        router.push("/taxis/operacional");
      },
    });

    // 1. Dibuja el círculo (strokeDashoffset baja de length a 0)
    timeline.add(
      {
        targets: circle,
        strokeDashoffset: [length, 0],
        duration: 2000,
      },
      0
    ); // comienza en 0

    // 2. Anima las letras simultáneamente (mismo tiempo que el dibujo)
    timeline.add(
      {
        targets: ".logo-letter",
        scale: [0.8, 1],
        opacity: [0, 1],
        delay: anime.stagger(300, { start: 0 }),
        duration: 1500,
        easing: "easeOutBack",
      },
      0
    ); // empieza en 0

    // 3. Rota el círculo suavemente adelante y atrás, justo después de dibujarlo
    timeline.add(
      {
        targets: circle,
        strokeDashoffset: [0, length / 4],
        duration: 1000,
        direction: "alternate",
        loop: 2,
      },
      2000
    ); // empieza justo después de los 2000ms del dibujo
  }, [router]);

  return (
    <>
      <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-700 gap-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 250 250"
          className="w-[350px] h-[350px]"
        >
          <defs>
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="4"
                result="blur1"
              />
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur2"
              />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ffffff"
            fontSize="48"
            fontFamily="sans-serif"
            filter="url(#neonGlow)"
          >
            <tspan className="logo-letter" x="50%" dy="0">
              C
            </tspan>
            <tspan className="logo-letter" dy="0">
              L
            </tspan>
            <tspan className="logo-letter" dy="0">
              I
            </tspan>
            <tspan className="logo-letter" dy="0">
              P
            </tspan>
            <tspan className="logo-letter" dy="0">
              P
            </tspan>
          </text>

          <circle
            className="neon-circle"
            cx="125"
            cy="125"
            r="90"
            fill="transparent"
            stroke="#ffffff"
            strokeWidth="8"
            filter="url(#neonGlow)"
          />
        </svg>

        <p className="text-white text-lg font-semibold tracking-wide select-none neon-text">
          Viewed using SIG-V
        </p>
      </main>

      <style>{`
        .neon-text {
          text-shadow:
            0 0 5px #ffffff,
            0 0 10px #ffffff,
            0 0 20px #ffffff,
            0 0 40px #ffffff;
          animation: neonPulse 2s ease-in-out infinite alternate;
        }

        @keyframes neonPulse {
          0% {
            text-shadow:
              0 0 5px #ffffff,
              0 0 10px #ffffff,
              0 0 20px #ffffff,
              0 0 40px #ffffff;
            color: #ffffff;
          }
          100% {
            text-shadow:
              0 0 10px #ffffff,
              0 0 20px #ffffff,
              0 0 30px #ffffff,
              0 0 60px #ffffff;
            color: #ffffff;
          }
        }
      `}</style>
    </>
  );
}
