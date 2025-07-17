"use client";

import Script from "next/script";

export default function ScriptLoader() {
  return (
    <Script
      src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"
      strategy="lazyOnload"
      onLoad={() => {
        // Esta función ahora se ejecuta de forma segura en el cliente
        window.dispatchEvent(new CustomEvent("animeLoaded"));
      }}
    />
  );
}
