"use client";

import React, { useEffect, useRef, useState } from "react";
import "./watermark.scss";

// Имена файлов в public: поправьте, если у вас иначе (в hero у вас "/ILYA MEDVEDEV.svg")
const LOGO_SRC = "/ilya-medvedev.svg";
const ICON_SRC = "/Group 49.1.svg";
const SITE = "ilyamedvedev.com";

type Variant = "signature" | "full";
type Position = "bottom-center" | "bottom-right" | "bottom-left";

interface WatermarkProps {
  /** signature: один знак внизу. full: знак + слабая диагональная сетка (для больших картин) */
  variant?: Variant;
  position?: Position;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export default function Watermark({ variant = "signature", position = "bottom-center" }: WatermarkProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  // Измеряем участок картины, на который наложен знак (вертикальный, горизонтальный, увеличенный)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      setBox((p) => (p && p.w === w && p.h === h ? p : { w, h }));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const u = box ? Math.min(box.w, box.h) : 0; // размер по меньшей стороне

  // Уровень подписи по размеру: xs только имя, s иконка + имя, m полный знак
  const level: "xs" | "s" | "m" = u < 150 ? "xs" : u < 340 ? "s" : "m";
  const sigW = level === "xs" ? Math.max(36, u * 0.5) : level === "s" ? u * 0.42 : clamp(u * 0.3, 110, 190);
  const off = Math.max(6, u * 0.04);
  const fs = Math.max(7, sigW * 0.062);
  const iconSize = sigW * 0.26;
  const gap = sigW * 0.05;

  // Диагональная сетка: только на крупных картинах
  const showTiles = variant === "full" && u >= 200;
  let tiles: React.ReactNode = null;
  if (showTiles && box) {
    const tileW = clamp(u * 0.24, 46, 140);
    const colW = tileW * 2.4;
    const rowH = tileW * 1.3;
    const diag = Math.hypot(box.w, box.h);
    const rows = Math.min(24, Math.ceil(diag / rowH) + 1);
    const cols = Math.min(14, Math.ceil(diag / colW) + 2);

    tiles = (
      <div className="wm-tiles" style={{ width: diag, height: diag }}>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="wm-row" style={{ height: rowH, marginLeft: r % 2 ? colW / 2 : 0 }}>
            {Array.from({ length: cols }).map((__, c) => (
              <span key={c} className="wm-cell" style={{ width: colW }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="wm-tile" src={LOGO_SRC} alt="" draggable={false} style={{ width: tileW }} />
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="wm" aria-hidden="true">
      {tiles}

      {box && (
        <div
          className={`wm-sig wm-sig--${position}`}
          style={
            {
              "--wm-w": `${sigW}px`,
              "--wm-off": `${off}px`,
              "--wm-fs": `${fs}px`,
              "--wm-icon": `${iconSize}px`,
              "--wm-gap": `${gap}px`,
            } as React.CSSProperties
          }
        >
          {level !== "xs" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="wm-icon" src={ICON_SRC} alt="" draggable={false} />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="wm-logo" src={LOGO_SRC} alt="" draggable={false} />
          {level === "m" && (
            <>
              <span className="wm-line" />
              <span className="wm-site">{SITE}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}