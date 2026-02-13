"use client";

import { useEffect, useRef, useState } from "react";
import { DndContext, useDraggable, DragEndEvent } from "@dnd-kit/core";

export type StickerItem = {
  id: string;
  image: string;
  x?: number; // percentage 0-100
  y?: number; // percentage 0-100
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

const CANVAS_WIDTH = 1400;
const CANVAS_HEIGHT = 850;

export default function StickerBoard({ items }: { items: StickerItem[] }) {
  const [stickers, setStickers] = useState<PositionedSticker[]>([]);
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [screen, setScreen] = useState({ width: 0, height: 0 });
  const [zCounter, setZCounter] = useState(100);
  const popupRef = useRef<HTMLDivElement | null>(null);

  /* SCREEN SIZE */
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

  /* CLOSE POPUP */
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [popup]);

  /* PERFECT CENTERED CANVAS POSITIONING */
  useEffect(() => {
    if (!screen.width) return;

    const scale = Math.min(
      screen.width / CANVAS_WIDTH,
      screen.height / CANVAS_HEIGHT
    );

    const canvasWidth = CANVAS_WIDTH * scale;
    const canvasHeight = CANVAS_HEIGHT * scale;

    const offsetX = (screen.width - canvasWidth) / 2;
    const offsetY = (screen.height - canvasHeight) / 2;

    const positioned: PositionedSticker[] = items.map((item, index) => {
      const pxX =
        offsetX +
        ((item.x ?? 50) / 100) * canvasWidth;

      const pxY =
        offsetY +
        ((item.y ?? 50) / 100) * canvasHeight;

      return {
        ...item,
        x: pxX,
        y: pxY,
        rotate: item.rotate ?? 0,
        z: index,
      };
    });

    setStickers(positioned);
  }, [items, screen]);

  /* DRAG END */
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

          if (sticker.link) {
            window.open(sticker.link, "_blank");
            return;
          }

          if (sticker.description && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const popupWidth = 260;

            const stickerCenterY =
              rect.top + rect.height / 2;

            let posX;
            let side: "left" | "right";

            if (
              rect.right + popupWidth + 20 <
              window.innerWidth
            ) {
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
              arrowTop:
                stickerCenterY - rect.top - 8,
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
          draggable={false}
          className="drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
        />
      </div>
    );
  }

  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        {stickers.map((sticker) => (
          <Draggable key={sticker.id} sticker={sticker} />
        ))}
      </DndContext>

      {popup && (
        <div
          className="fixed z-[9999]"
          style={{ left: popup.x, top: popup.y }}
        >
          <div
            ref={popupRef}
            className="relative bg-white text-black text-sm px-6 py-4 rounded-2xl shadow-xl max-w-[260px]"
          >
            {popup.text}
          </div>
        </div>
      )}
    </>
  );
}
