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
     GESTURE LOGIC (FIXED)
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
      if (dy > 0) {
        next(); // swipe down
      } else {
        prev(); // swipe up
      }
    }

    isDragging.current = false;
    startY.current = null;
    currentY.current = null;
  };

  return (
    <div
      className="relative w-[90vw] max-w-[460px] h-[340px] perspective-1000 select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {cards.map((card, i) => {
        const position = (i - index + cards.length) % cards.length;

        return (
          <div
            key={card.id}
            className="
              absolute inset-0 
              rounded-3xl 
              p-8 
              backdrop-blur-xl 
              bg-white/5 
              border border-white/10 
              transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]
              shadow-[0_40px_80px_rgba(0,0,0,0.8)]
            "
            style={{
              transform: `
                translateY(${position * 14}px)
                scale(${1 - position * 0.06})
                rotateX(${position * 3}deg)
              `,
              zIndex: cards.length - position,
              opacity: position > 3 ? 0 : 1,
            }}
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 blur-xl -z-10" />

            {/* Header */}
            <div className="flex justify-between items-center text-white mb-6">
              <span className="text-xs tracking-widest uppercase opacity-60">
                {index + 1} / {cards.length}
              </span>

              <div className="flex gap-3">
                <button
                  onClick={prev}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-blue-500 transition flex items-center justify-center"
                >
                  ↑
                </button>
                <button
                  onClick={next}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-blue-500 transition flex items-center justify-center"
                >
                  ↓
                </button>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
              {card.title}
            </h2>

            {/* Description */}
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
              {card.description}
            </p>

            {/* Button */}
            {card.buttonText && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent swipe trigger
                  if (card.link) {
                    window.open(card.link, "_blank");
                  }
                }}
                className="
                  px-6 py-2 
                  rounded-full 
                  bg-gradient-to-r from-blue-500 to-blue-600
                  hover:from-blue-400 hover:to-blue-500
                  text-white font-medium
                  transition-all duration-300
                  shadow-[0_0_25px_rgba(59,130,246,0.6)]
                  hover:shadow-[0_0_40px_rgba(59,130,246,1)]
                "
              >
                {card.buttonText}
              </button>
            )}
          </div>
        );
      })}

      {/* Bottom Glow */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-60 h-20 bg-blue-500/20 blur-3xl rounded-full" />
    </div>
  );
}
