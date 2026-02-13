"use client";

import { useRef, useState } from "react";

export type CardData = {
  id: string;
  title: string;
  description: string;
  buttonText?: string;
  link?: string;
};

export default function ShuffleCardBox({ cards }: { cards: CardData[] }) {
  const [index, setIndex] = useState(0);
  const startY = useRef<number | null>(null);
  const currentY = useRef<number | null>(null);
  const isDragging = useRef(false);

  const next = () => setIndex((prev) => (prev + 1) % cards.length);
  const prev = () =>
    setIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));

  /* =========================
     GESTURE
  ========================= */

  const handlePointerDown = (e: React.PointerEvent) => {
    startY.current = e.clientY;
    isDragging.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    currentY.current = e.clientY;
  };

  const handlePointerUp = () => {
    if (!startY.current || !currentY.current) {
      isDragging.current = false;
      return;
    }

    const dy = currentY.current - startY.current;
    const threshold = 60;

    if (Math.abs(dy) > threshold) {
      if (dy > 0) next();
      else prev();
    }

    isDragging.current = false;
    startY.current = null;
    currentY.current = null;
  };

  return (
    <div className="relative w-[92vw] max-w-[520px] h-[420px] sm:h-[420px] perspective-1000 select-none">
      {cards.map((card, i) => {
        const position = (i - index + cards.length) % cards.length;

        return (
          <div
            key={card.id}
            className="
              absolute inset-0 
              rounded-3xl 
              flex flex-col
              p-6 sm:p-10
              bg-black/60
              backdrop-blur-2xl
              border border-white/20
              transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]
              shadow-[0_40px_100px_rgba(0,0,0,0.9)]
              overflow-hidden
            "
            style={{
              transform: `
                translateY(${position * 16}px)
                scale(${1 - position * 0.05})
                rotateX(${position * 3}deg)
              `,
              zIndex: cards.length - position,
              opacity: position > 3 ? 0 : 1,
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 blur-2xl -z-10" />

            {/* Counter */}
            <div className="text-xs tracking-widest uppercase text-gray-300 mb-4">
              {index + 1} / {cards.length}
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
              {card.title}
            </h2>

            {/* Description */}
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-6">
              {card.description}
            </p>

            {/* Push everything below to bottom */}
            <div className="mt-auto flex flex-col gap-4">

              {/* Action Button */}
              {card.buttonText && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (card.link) {
                      window.open(card.link, "_blank");
                    }
                  }}
                  className="
                    w-full
                    px-6 py-3
                    rounded-full
                    bg-gradient-to-r from-blue-500 to-blue-600
                    hover:from-blue-400 hover:to-blue-500
                    text-white font-semibold
                    transition-all duration-300
                    shadow-[0_0_25px_rgba(59,130,246,0.6)]
                  "
                >
                  {card.buttonText}
                </button>
              )}

              {/* Arrows Row */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className="
                    w-10 h-10 
                    rounded-full 
                    bg-white/10 
                    border border-white/20
                    text-white
                    hover:bg-blue-500
                    transition-all duration-300
                    flex items-center justify-center
                  "
                >
                  ↑
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="
                    w-10 h-10 
                    rounded-full 
                    bg-blue-500
                    text-white
                    hover:bg-blue-400
                    transition-all duration-300
                    flex items-center justify-center
                    shadow-[0_0_20px_rgba(59,130,246,0.8)]
                  "
                >
                  ↓
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Bottom Glow */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-72 h-24 bg-blue-500/30 blur-3xl rounded-full" />
    </div>
  );
}
