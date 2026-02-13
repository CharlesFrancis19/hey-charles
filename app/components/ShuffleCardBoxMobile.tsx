"use client";

import { useRef, useState } from "react";

export type CardData = {
  id: string;
  title: string;
  description: string;
  buttonText?: string;
  link?: string;
};

export default function ShuffleCardBoxMobile({
  cards,
}: {
  cards: CardData[];
}) {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const currentX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const next = () =>
    setIndex((prev) => (prev + 1) % cards.length);

  const prev = () =>
    setIndex((prev) =>
      prev === 0 ? cards.length - 1 : prev - 1
    );

  /* Swipe */
  const handlePointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    isDragging.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    currentX.current = e.clientX;
  };

  const handlePointerUp = () => {
    if (!startX.current || !currentX.current) {
      isDragging.current = false;
      return;
    }

    const dx = currentX.current - startX.current;
    const threshold = 60;

    if (Math.abs(dx) > threshold) {
      if (dx < 0) next();
      else prev();
    }

    isDragging.current = false;
    startX.current = null;
    currentX.current = null;
  };

  const card = cards[index];

  return (
    <div className="relative w-full flex justify-center px-4">

      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="
          relative
          w-full
          max-w-[420px]
          h-[380px]
          rounded-3xl
          flex flex-col
          p-6
          bg-black/60
          backdrop-blur-2xl
          border border-white/20
          shadow-[0_40px_100px_rgba(0,0,0,0.9)]
          transition-all duration-300
          overflow-hidden
        "
      >
        {/* Glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 blur-2xl -z-10" />

        {/* Counter */}
        <div className="text-xs tracking-widest uppercase text-gray-300 mb-4">
          {index + 1} / {cards.length}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-3 leading-tight">
          {card.title}
        </h2>

        {/* Description */}
        <p className="text-gray-200 text-sm leading-relaxed mb-6">
          {card.description}
        </p>

        {/* Bottom Section */}
        <div className="mt-auto flex flex-col gap-4">

          {card.buttonText && (
            <button
              onClick={() => {
                if (card.link) window.open(card.link, "_blank");
              }}
              className="
                w-full
                px-6 py-3
                rounded-full
                bg-gradient-to-r from-blue-500 to-blue-600
                text-white font-semibold
                transition-all duration-300
                shadow-[0_0_25px_rgba(59,130,246,0.6)]
              "
            >
              {card.buttonText}
            </button>
          )}

          {/* Arrows same style as desktop */}
          <div className="flex justify-end gap-3">
            <button
              onClick={prev}
              className="
                w-9 h-9
                rounded-full
                bg-white/10
                border border-white/20
                text-white
                hover:bg-blue-500
                transition-all
                flex items-center justify-center
              "
            >
              ←
            </button>

            <button
              onClick={next}
              className="
                w-9 h-9
                rounded-full
                bg-blue-500
                text-white
                hover:bg-blue-400
                transition-all
                flex items-center justify-center
                shadow-[0_0_20px_rgba(59,130,246,0.8)]
              "
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
