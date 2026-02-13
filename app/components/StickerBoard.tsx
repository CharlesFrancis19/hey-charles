"use client";

import { useEffect, useRef, useState } from "react";
import { DndContext, useDraggable, DragEndEvent } from "@dnd-kit/core";

export type StickerItem = {
  id: string;
  image: string;
  x?: number;
  y?: number;
  size?: number;
  mobileSize?: number;
  rotate?: number;
  link?: string;
  description?: string;
};

type PositionedSticker = StickerItem & {
  x: number;
  y: number;
  z: number;
};

type PopupData = {
  text: string;
  x: number;
  y: number;
  side: "left" | "right";
  arrowTop: number;
};

export default function StickerBoard({
  items,
}: {
  items: StickerItem[];
}) {
  const [stickers, setStickers] = useState<PositionedSticker[]>([]);
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [screen, setScreen] = useState({ width: 0, height: 0 });
  const [zCounter, setZCounter] = useState(100);

  const popupRef = useRef<HTMLDivElement | null>(null);

  /* ============================= */
  /* SCREEN SIZE */
  /* ============================= */
  useEffect(() => {
    const update = () =>
      setScreen({
        width: window.innerWidth,
        height: window.innerHeight,
      });

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ============================= */
  /* CLOSE POPUP ON OUTSIDE CLICK */
  /* ============================= */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popup &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setPopup(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popup]);

  /* ============================= */
  /* INITIAL POSITION */
  /* ============================= */
  useEffect(() => {
    if (!screen.width) return;

    const positioned: PositionedSticker[] = items.map((item, index) => ({
      ...item,
      x: item.x ?? 100 + index * 40,
      y: item.y ?? 100 + index * 40,
      rotate: item.rotate ?? 0,
      z: index,
    }));

    setStickers(positioned);
  }, [items, screen]);

  /* ============================= */
  /* DRAG END */
  /* ============================= */
  const handleDragEnd = (event: DragEndEvent) => {
    const { delta, active } = event;

    setStickers((prev) =>
      prev.map((s) =>
        s.id === active.id
          ? {
              ...s,
              x: s.x + delta.x,
              y: s.y + delta.y,
            }
          : s
      )
    );
  };

  /* ============================= */
  /* DRAGGABLE COMPONENT */
  /* ============================= */
  function Draggable({ sticker }: { sticker: PositionedSticker }) {
    const ref = useRef<HTMLDivElement | null>(null);

    const { attributes, listeners, setNodeRef, transform } =
      useDraggable({ id: sticker.id });

    const isMobile = screen.width < 768;
    const size = isMobile
      ? sticker.mobileSize ?? 100
      : sticker.size ?? 150;

    return (
      <div
        ref={(node) => {
          setNodeRef(node);
          ref.current = node;
        }}
        {...listeners}
        {...attributes}
        onPointerUp={() => {
          setZCounter((prev) => prev + 1);

          setStickers((prev) =>
            prev.map((s) =>
              s.id === sticker.id ? { ...s, z: zCounter } : s
            )
          );

          /* 🔗 HANDLE LINK */
          if (sticker.link) {
            if (isMobile) {
              window.location.href = sticker.link;
            } else {
              window.open(sticker.link, "_blank", "noopener,noreferrer");
            }
            return;
          }

          /* 💬 HANDLE POPUP */
          if (sticker.description && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const popupWidth = 260;

            const stickerCenterY = rect.top + rect.height / 2;

            let posX;
            let side: "left" | "right";

            if (rect.right + popupWidth + 20 < window.innerWidth) {
              posX = rect.right + 16;
              side = "left";
            } else {
              posX = rect.left - popupWidth - 16;
              side = "right";
            }

            setPopup({
              text: sticker.description,
              x: posX,
              y: rect.top,
              side,
              arrowTop: stickerCenterY - rect.top - 8,
            });
          }
        }}
        style={{
          position: "absolute",
          left: sticker.x,
          top: sticker.y,
          zIndex: sticker.z,
          transform: `
            translate(${transform?.x ?? 0}px,
            ${transform?.y ?? 0}px)
            rotate(${sticker.rotate ?? 0}deg)
          `,
          transition: transform ? "none" : "all 0.3s ease",
        }}
        className="cursor-grab active:cursor-grabbing select-none hover:scale-105 transition duration-300"
      >
        <img
          src={sticker.image}
          style={{ width: size }}
          className="drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
          draggable={false}
        />
      </div>
    );
  }

  /* ============================= */
  /* RENDER */
  /* ============================= */

  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        {stickers.map((sticker) => (
          <Draggable key={sticker.id} sticker={sticker} />
        ))}
      </DndContext>

      {/* POPUP */}
      {popup && (
        <div
          className="fixed z-[9999] animate-popupScale"
          style={{ left: popup.x, top: popup.y }}
        >
          <div
            ref={popupRef}
            className="relative bg-white text-black text-sm px-6 py-4 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-gray-200 max-w-[260px]"
          >
            {popup.text}

            {/* Arrow */}
            <div
              className={`absolute w-4 h-4 bg-white rotate-45 border-gray-200
                ${
                  popup.side === "left"
                    ? "-left-2 border-l border-b"
                    : "-right-2 border-r border-t"
                }
              `}
              style={{ top: popup.arrowTop }}
            />
          </div>
        </div>
      )}
    </>
  );
}
