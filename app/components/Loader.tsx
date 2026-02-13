"use client";

import { useEffect, useMemo, useState } from "react";

const WORD = "CHARLES";

const letters: Record<string, number[][]> = {
  C: [[1,1,1,1],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,1,1]],
  H: [[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1]],
  A: [[0,1,1,0],[1,0,0,1],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1]],
  R: [[1,1,1,0],[1,0,0,1],[1,0,0,1],[1,1,1,0],[1,0,1,0],[1,0,0,1],[1,0,0,1]],
  L: [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,1,1]],
  E: [[1,1,1,1],[1,0,0,0],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,0,0,0],[1,1,1,1]],
  S: [[1,1,1,1],[1,0,0,0],[1,0,0,0],[1,1,1,1],[0,0,0,1],[0,0,0,1],[1,1,1,1]],
};

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedIndex, setCompletedIndex] = useState(-1);
  const [scale, setScale] = useState(1);

  const CELL = 26;

  const { blocks, colOffset } = useMemo(() => {
    const blocks: { row: number; col: number }[] = [];
    let colOffset = 0;
    WORD.split("").forEach((letter) => {
      const pattern = letters[letter];
      pattern.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell === 1) blocks.push({ row: r, col: c + colOffset });
        });
      });
      colOffset += 6;
    });
    return { blocks, colOffset };
  }, []);

  useEffect(() => {
    if (activeIndex >= blocks.length) {
      setTimeout(onComplete, 800);
      return;
    }
    const timer = setTimeout(() => {
      setCompletedIndex(activeIndex);
      setActiveIndex((prev) => prev + 1);
    }, 18);
    return () => clearTimeout(timer);
  }, [activeIndex, blocks.length, onComplete]);

  useEffect(() => {
    const updateScale = () => {
      const gridWidth = colOffset * CELL;
      const availableWidth = window.innerWidth * 0.9;
      setScale(Math.min(availableWidth / gridWidth, 1));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [colOffset]);

  return (
    <div className="absolute inset-0 bg-black z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-[linear-gradient(#1a1a1a_1px,transparent_1px),linear-gradient(to_right,#1a1a1a_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div style={{ transform: `scale(${scale})` }}>
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${colOffset}, ${CELL}px)`,
            gridTemplateRows: `repeat(7, ${CELL}px)`,
          }}
        >
          {blocks.map((block, i) => {
            const isActive = i === activeIndex;
            const isCompleted = i <= completedIndex;

            return (
              <div
                key={i}
                style={{
                  width: `${CELL}px`,
                  height: `${CELL}px`,
                  gridColumnStart: block.col + 1,
                  gridRowStart: block.row + 1,
                }}
              >
                <div
                  className={`transition-all duration-150 ${
                    isActive
                      ? "w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.9)]"
                      : isCompleted
                      ? "w-4 h-4 bg-white"
                      : "opacity-0"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
