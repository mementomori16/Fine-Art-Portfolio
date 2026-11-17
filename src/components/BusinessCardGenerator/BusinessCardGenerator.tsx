"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import "./businessCardGenerator.scss";

const CARD_MM = 65;
const MID = CARD_MM / 2;
const PX_PER_MM = 96 / 25.4; // CSS: 96 пикселей на дюйм
const SITE = "https://ilyamedvedev.com";
const STORE_KEY = "bc-card-v4"; // тот же ключ: ваш сохранённый макет не потеряется
const CALIB_KEY = "bc-calib-v1";

// ?v=2: сбрасывает старый кэш шторы. Заменили файл — увеличьте число
const CURTAIN_SRC = "/clean-curtain.png?v=2";
const ICON_SRC = "/Group 49.1.svg";
const LOGO_SRC = "/ilya-medvedev.svg";

const C = "https://res.cloudinary.com/dpayqcrg5/image/upload/";

type Art = {
  key: string;
  url: string;
  label: string;
  paintingId: string; // для ссылки в QR
  category: string;
  detail?: boolean;
};

// Картина + её дополнительные кадры (thumbnail, thumbnail2) как отдельные варианты выбора
const group = (
  paintingId: string,
  category: string,
  label: string,
  main: string,
  details: string[] = []
): Art[] => [
  { key: paintingId, url: C + main, label, paintingId, category },
  ...details.map((d, i) => ({
    key: `${paintingId}-d${i + 1}`,
    url: C + d,
    label,
    paintingId,
    category,
    detail: true,
  })),
];

const ARTWORKS: Art[] = [
  ...group("oil_02", "oil-paintings", "Skulls (memento mori)", "v1780939340/1ph2026_zwllbh.jpg", [
    "v1779781725/detal-2021-ph2026_eu8ac6.jpg",
    "v1791055741/IMG_3357-500kb_rcpa9f.jpg",
  ]),
  ...group("oil_03", "oil-paintings", "Memento mori", "v1779613732/IMG_8469ph2026-500kb_fipv2h.jpg", [
    "v1779613717/The_best_photo_Autopsia_of_a_commited_suicide_girl%D0%B7%D1%8026500kb_bup3cx.jpg",
  ]),
  ...group("oil_04", "oil-paintings", "Nude", "v1769032416/IMG_4906_photoshoped_12.2025-500kb_xdkpzo.jpg", [
    "v1782937567/good_Alla_2026_photoshop-500kb_q5prhs.jpg",
  ]),
  ...group(
    "oil_06",
    "oil-paintings",
    "Nude (Royal Gore)",
    "v1770367743/photoshoped_2025_Royal_Gore._Oil_on_canvas_111_x_200_cm._2008._500kb_e9z43l.jpg"
  ),
  ...group("oil_07", "oil-paintings", "Memento mori", "v1779613731/varnished-and-photoshoped-small-2-500kb_jgndqr.jpg"),
  ...group("oil_08", "oil-paintings", "Portrait", "v1779613701/IMG_4550ph26-500kb_lqn3zn.jpg", [
    "v1781963283/IMG_4840-darker_2025_iwfsdy.jpg",
  ]),
  ...group("oil_09", "oil-paintings", "Memento mori (panorama)", "v1783015237/Untitled_Panorama-24-500b_b4z8vu.jpg", [
    "v1780072416/ed500kb_eb2ppw.jpg",
    "v1782294108/closeup2018-500kb_ihzwdb.jpg",
  ]),
  ...group("oil_11", "oil-paintings", "Drowned", "v1779784466/Portraite_of_drowned_woman_2018500KB_dacbwg.jpg"),
  ...group("oil_12", "oil-paintings", "Nude study", "v1779613717/IMGP3286PH26-2-500b_nidce0.jpg", [
    "v1782300692/IMGP3308-Recovered_r5am4h.jpg",
  ]),
  ...group("oil_13", "oil-paintings", "Memento mori (panorama)", "v1782914928/Photoshoped-panorama2026-5-500kb_x3gypx.jpg", [
    "v1782930873/DSC_0973ph3-2026-500kb_lqj6pp.jpg",
    "v1782932053/IMG_4880photoshoped_2026-2500kb_mxytkz.jpg",
  ]),
  ...group("oil_14", "oil-paintings", "Portrait", "v1791048507/IMG_4285-2ph2026-500kb_gxegvt.jpg", [
    "v1791053467/IMG_4293-2-ph2026-500kb_qygshe.jpg",
  ]),
  ...group("oil_15", "oil-paintings", "Landscape", "v1791054706/IMG_8563paint-ph2026-500kb_lja2dj.jpg"),
  ...group("wat_01", "watercolors", "Watercolor", "v1782023532/No_bordersph2026-500kb_dhhteh.jpg"),
  ...group(
    "wat_02",
    "watercolors",
    "Watercolor (nude)",
    "v1769032419/NO_BORDERS_Pregnant_Celine_in_Caesaria._Watercolors_on_cotton_paper_2025-500kb_l7clzr.jpg"
  ),
  ...group("wat_03", "watercolors", "Watercolor", "v1769032416/IMG_7751photoshoped_2-2025-500kb_gsfrqk.jpg", [
    "v1792149740/IMG_7621ph26-500kb_za607p.jpg",
  ]),
  ...group(
    "psy_01",
    "oil-paintings",
    "McDonald's",
    "v1769032418/Mcdonalds_2010._Oil_on_canvas_145_x_191_cm._Ilya_Medvedev.ph01.26-500kb_damqkv.jpg",
    ["v1769032416/IMG_5405-500kb_xeo7dh.jpg"]
  ),
  ...group("psy_02", "oil-paintings", "Cold World", "v1769032409/Cold_World_2011.ph2026-500kb_uzoqft.jpg"),
  ...group("psy_03", "oil-paintings", "Psychological portrait", "v1792083937/IMG_5474_photoshoped_2025-500kb_c0mv4n.jpg"),
];

const byKey = (k: string) => ARTWORKS.find((a) => a.key === k) ?? ARTWORKS[0];

// Маленькая версия для сетки выбора
const thumbSrc = (url: string) =>
  url.includes("/upload/") ? url.replace("/upload/", "/upload/c_fill,w_72,h_72,q_auto,f_auto/") : url;

// Версия для рамы: размер в мм переводится в пиксели с запасом (~350 dpi)
const frameSrc = (url: string, wMm: number, hMm: number) =>
  url.includes("/upload/")
    ? url.replace(
        "/upload/",
        `/upload/c_fill,w_${Math.round(wMm * 14)},h_${Math.round(hMm * 14)},q_auto:good/`
      )
    : url;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const r1 = (v: number) => Math.round(v * 10) / 10;

/* ───────── Модель элементов карточки ───────── */

type Side = "front" | "back";
type ElType = "logo" | "icon" | "rule" | "text" | "qr" | "frame";

interface El {
  id: string;
  side: Side;
  type: ElType;
  name: string;
  x: number; // центр элемента, мм от левого края
  y: number; // центр элемента, мм от верха
  w: number; // ширина, мм
  h?: number; // высота, мм (рамы)
  visible: boolean;
  custom?: boolean;
  // текст
  text?: string;
  size?: number; // pt
  weight?: number;
  spacing?: number; // em
  upper?: boolean;
  color?: string;
  font?: "sans" | "serif";
  // логотип, иконка, QR
  white?: boolean;
  shade?: boolean; // мягкое затемнение вокруг без краёв
  // линия
  thick?: number;
  // рама
  art?: string;
  fx?: number;
  fy?: number;
}

// Заготовки взяты из ваших PDF: одна крупная рама, QR слева внизу, сайт и почта справа
const DEFAULT_ELS: El[] = [
  // ───── лицо ─────
  { id: "f-icon", side: "front", type: "icon", name: "Icon", x: MID, y: 7.5, w: 10, visible: false, white: false, shade: true },
  { id: "f-logo", side: "front", type: "logo", name: "Name (logo)", x: MID, y: 48, w: 50, visible: true, white: true },
  { id: "f-rule", side: "front", type: "rule", name: "Line", x: MID, y: 54.4, w: 9, thick: 0.25, color: "#e6c9b0", visible: true },
  {
    id: "f-role", side: "front", type: "text", name: "Subtitle", x: MID, y: 58.4, w: 30, visible: true,
    text: "Artist", size: 7.5, weight: 500, spacing: 0.34, upper: true, color: "#ffffff", font: "sans",
  },
  // ───── оборот ─────
  { id: "b-icon", side: "back", type: "icon", name: "Icon", x: MID, y: 6.8, w: 11, visible: false, white: false, shade: true },
  { id: "b-frame1", side: "back", type: "frame", name: "Frame left", x: 14, y: 25.5, w: 14, h: 17, visible: false, art: "oil_08", fx: 50, fy: 50 },
  { id: "b-frame2", side: "back", type: "frame", name: "Frame center", x: MID, y: 20.8, w: 52, h: 32, visible: true, art: "oil_03", fx: 50, fy: 50 },
  { id: "b-frame3", side: "back", type: "frame", name: "Frame right", x: 51, y: 25.5, w: 14, h: 17, visible: false, art: "psy_01", fx: 50, fy: 50 },
  {
    id: "b-l1", side: "back", type: "text", name: "Line 1", x: MID, y: 40.2, w: 40, visible: true,
    text: "Psychological Realism", size: 6.4, weight: 500, spacing: 0.22, upper: true, color: "#ffffff", font: "sans",
  },
  {
    id: "b-l2", side: "back", type: "text", name: "Line 2", x: MID, y: 44.4, w: 40, visible: true,
    text: "Oil Painting · Drawing", size: 6.6, weight: 400, spacing: 0.1, upper: false, color: "#ffffff", font: "sans",
  },
  {
    id: "b-l3", side: "back", type: "text", name: "Line 3", x: MID, y: 47.6, w: 50, visible: false,
    text: "Bezalel MFA · London · Tel Aviv · Jaffa", size: 5.8, weight: 300, spacing: 0.05, upper: false, color: "#f4efe6", font: "sans",
  },
  { id: "b-qr", side: "back", type: "qr", name: "QR code", x: 10.4, y: 53.2, w: 13, visible: true, color: "#f4efe6", shade: true },
  {
    id: "b-site", side: "back", type: "text", name: "Website", x: 45, y: 53.3, w: 30, visible: true,
    text: "ilyamedvedev.com", size: 8, weight: 500, spacing: 0.01, upper: false, color: "#ffffff", font: "sans",
  },
  {
    id: "b-email", side: "back", type: "text", name: "Email", x: 45, y: 57.7, w: 30, visible: true,
    text: "info@profineart.ch", size: 7.5, weight: 400, spacing: 0, upper: false, color: "#ffffff", font: "sans",
  },
];

interface Cfg {
  // лицо
  frontKey: string;
  fZoom: number;
  fX: number;
  fY: number;
  frontCurtains: boolean;
  slit: number; // ширина щели между шторами на лице, мм
  nameShade: number; // 0..1: затемнение под именем
  topShade: number; // 0..1: затемнение сверху
  // оборот
  backCurtains: boolean;
  openW: number; // ширина штор по краям на обороте, мм
  backBg: "wall" | "art";
  backKey: string;
  bgZoom: number;
  bgX: number;
  bgY: number;
  bgDim: number;
  // плёночный фильтр
  film: boolean;
  vig: number;
  grain: number;
  fade: number;
  warm: number;
  sat: number;
  // карточка
  radius: number; // радиус углов, мм
  printRound: boolean;
  qrMode: "frame" | "home" | "custom";
  qrUrl: string;
}

const DEFAULT_CFG: Cfg = {
  frontKey: "oil_02",
  fZoom: 1,
  fX: 50,
  fY: 50,
  frontCurtains: true,
  slit: 20,
  nameShade: 0.66,
  topShade: 0.6,
  backCurtains: false,
  openW: 4,
  backBg: "wall",
  backKey: "oil_02",
  bgZoom: 1,
  bgX: 50,
  bgY: 50,
  bgDim: 0.4,
  film: true,
  vig: 0.45,
  grain: 0.1,
  fade: 0.3,
  warm: 0.1,
  sat: 0.94,
  radius: 3,
  printRound: true,
  qrMode: "frame",
  qrUrl: "",
};

/* ───────── Мелкие компоненты интерфейса ───────── */

function Range({
  label, value, min, max, step = 1, onChange,
}: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void;
}) {
  return (
    <label className="range-row">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <output>{value}</output>
    </label>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="check-row">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function Picker({ value, onPick }: { value: string; onPick: (key: string) => void }) {
  return (
    <div className="art-grid">
      {ARTWORKS.map((a) => (
        <button
          key={a.key}
          className={`thumb ${value === a.key ? "active" : ""}`}
          onClick={() => onPick(a.key)}
          title={`${a.label}${a.detail ? " · detail" : ""} (${a.paintingId})`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumbSrc(a.url)} alt={a.label} loading="lazy" />
        </button>
      ))}
    </div>
  );
}

// Две половины штор, как на сайте
function Curtains({ widthMm }: { widthMm: number }) {
  return (
    <>
      <div className="curtain curtain--left" style={{ width: `${widthMm}mm` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={CURTAIN_SRC} alt="" aria-hidden="true" draggable={false} />
      </div>
      <div className="curtain curtain--right" style={{ width: `${widthMm}mm` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={CURTAIN_SRC} alt="" aria-hidden="true" draggable={false} />
      </div>
    </>
  );
}

// Плёночный слой: виньетка, тёплый оттенок, снижение насыщенности, матовость, зерно.
// Сделан наложением (без CSS-фильтров), чтобы в PDF картины не растрировались в низком разрешении
function FilmLayer() {
  return (
    <div className="film" aria-hidden="true">
      <span className="film-vig" />
      <span className="film-warm" />
      <span className="film-desat" />
      <span className="film-fade" />
      <span className="film-grain" />
    </div>
  );
}

/* ───────── Страница ───────── */

export default function BusinessCardGenerator() {
  const [els, setEls] = useState<El[]>(DEFAULT_ELS);
  const [cfg, setCfg] = useState<Cfg>(DEFAULT_CFG);
  const [sel, setSel] = useState<string | null>("f-logo");
  const [mult, setMult] = useState<number>(1);
  const [calib, setCalib] = useState<number>(PX_PER_MM); // пикселей экрана на 1 мм
  const [guides, setGuides] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [qrSvg, setQrSvg] = useState("");
  const [warns, setWarns] = useState<string[]>([]);

  const drag = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number } | null>(null);

  // Сохранённый макет и калибровка возвращаются при следующем открытии страницы
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (Array.isArray(s.els) && s.els.length) setEls(s.els);
        if (s.cfg) setCfg({ ...DEFAULT_CFG, ...s.cfg });
      }
      const c = Number(localStorage.getItem(CALIB_KEY));
      if (c >= 2.5 && c <= 7) setCalib(c);
    } catch {
      /* localStorage недоступен: остаётся макет по умолчанию */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ els, cfg }));
    } catch {
      /* не критично */
    }
  }, [els, cfg, loaded]);

  const changeCalib = (v: number) => {
    setCalib(v);
    try {
      localStorage.setItem(CALIB_KEY, String(v));
    } catch {
      /* не критично */
    }
  };

  const updateEl = (id: string, patch: Partial<El>) =>
    setEls((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const patchCfg = (p: Partial<Cfg>) => setCfg((c) => ({ ...c, ...p }));

  // Стрелки двигают выбранный элемент (Shift = крупнее). Внутри полей ввода не работают
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!sel) return;
      const t = e.target as HTMLElement | null;
      if (t && ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      const step = e.shiftKey ? 2 : 0.5;
      let dx = 0;
      let dy = 0;
      if (e.key === "ArrowLeft") dx = -step;
      else if (e.key === "ArrowRight") dx = step;
      else if (e.key === "ArrowUp") dy = -step;
      else if (e.key === "ArrowDown") dy = step;
      if (!dx && !dy) return;
      e.preventDefault();
      setEls((prev) => prev.map((el) => (el.id === sel ? { ...el, x: r1(el.x + dx), y: r1(el.y + dy) } : el)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel]);

  const front = byKey(cfg.frontKey);
  const centerFrame = els.find((e) => e.id === "b-frame2");
  const centerArt = byKey(centerFrame?.art ?? "oil_03");
  const qrEl = els.find((e) => e.type === "qr");
  const qrColor = qrEl?.color ?? "#f4efe6";

  // QR ведёт на страницу центральной работы, на главную или по вашей ссылке
  const qrTarget = useMemo(() => {
    if (cfg.qrMode === "home") return `${SITE}/`;
    if (cfg.qrMode === "custom") return cfg.qrUrl.trim() || `${SITE}/`;
    return `${SITE}/artwork/${centerArt.category}/${centerArt.paintingId}`;
  }, [cfg.qrMode, cfg.qrUrl, centerArt.category, centerArt.paintingId]);

  // QR строится локально как вектор с прозрачным фоном: сливается с фоном карточки
  useEffect(() => {
    let cancelled = false;
    QRCode.toString(qrTarget, {
      type: "svg",
      margin: 0,
      errorCorrectionLevel: "M",
      color: { dark: qrColor, light: "#00000000" },
    })
      .then((s) => {
        if (!cancelled) setQrSvg(s);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [qrTarget, qrColor]);

  // Проверки печати: безопасная зона 3 мм, минимальный размер текста и QR
  useEffect(() => {
    if (!loaded) return;
    const t = window.setTimeout(() => {
      const out: string[] = [];
      document.querySelectorAll<HTMLElement>(".card-sheet").forEach((sheet) => {
        const side = sheet.dataset.side === "front" ? "Front" : "Back";
        const sr = sheet.getBoundingClientRect();
        const k = sr.width / CARD_MM; // пикселей на мм при текущем масштабе
        if (!k) return;
        sheet.querySelectorAll<HTMLElement>("[data-el]").forEach((node) => {
          const el = els.find((e) => e.id === node.dataset.el);
          if (!el || el.type === "frame" || el.type === "rule") return;
          const r = node.getBoundingClientRect();
          const left = (r.left - sr.left) / k;
          const top = (r.top - sr.top) / k;
          const right = (r.right - sr.left) / k;
          const bottom = (r.bottom - sr.top) / k;
          if (left < 3 || top < 3 || right > CARD_MM - 3 || bottom > CARD_MM - 3) {
            out.push(`${side} · ${el.name}: outside the 3 mm safe zone`);
          }
          if (el.type === "text" && (el.size ?? 7) < 6) {
            out.push(`${side} · ${el.name}: text under 6 pt may print unreadable`);
          }
          if (el.type === "qr" && el.w < 15) {
            out.push(`${side} · QR is under 15 mm: scanning may fail`);
          }
        });
      });
      setWarns(out);
    }, 80);
    return () => window.clearTimeout(t);
  }, [els, cfg, mult, calib, qrSvg, loaded]);

  /* ───── Перетаскивание ───── */
  const onElDown = (e: React.PointerEvent<HTMLDivElement>, el: El) => {
    e.stopPropagation();
    setSel(el.id);
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id: el.id, sx: e.clientX, sy: e.clientY, ox: el.x, oy: el.y };
  };

  const onElMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const k = calib * mult; // пикселей на мм
    let x = d.ox + (e.clientX - d.sx) / k;
    const y = d.oy + (e.clientY - d.sy) / k;
    if (Math.abs(x - MID) < 0.7) x = MID; // прилипание к центру
    updateEl(d.id, { x: r1(clamp(x, -5, CARD_MM + 5)), y: r1(clamp(y, -5, CARD_MM + 5)) });
  };

  const onElUp = () => {
    drag.current = null;
  };

  const handlePrint = async () => {
    setSel(null);
    // дожидаемся, пока все картины полностью декодированы (иначе в PDF бывают пустые места)
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>(".card-sheet img"));
    await Promise.all(imgs.map((img) => img.decode?.().catch(() => undefined) ?? Promise.resolve()));

    // имя файла PDF берётся из заголовка страницы
    const prevTitle = document.title;
    document.title = "Ilya-Medvedev-Business-Card";
    const restore = () => {
      document.title = prevTitle;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);

    window.print();
  };

  const resetAll = () => {
    setEls(DEFAULT_ELS);
    setCfg(DEFAULT_CFG);
    setSel("f-logo");
    try {
      localStorage.removeItem(STORE_KEY);
    } catch {
      /* не критично */
    }
  };

  const addText = (side: Side) => {
    const id = `t-${Date.now()}`;
    setEls((prev) => [
      ...prev,
      {
        id, side, type: "text", name: "Text", x: MID, y: MID, w: 30, visible: true, custom: true,
        text: "Text", size: 7, weight: 400, spacing: 0.1, upper: false, color: "#ffffff", font: "sans",
      },
    ]);
    setSel(id);
  };

  const removeEl = (id: string) => {
    setEls((prev) => prev.filter((e) => e.id !== id));
    setSel(null);
  };

  /* ───── Отрисовка одного элемента на карточке ───── */
  const renderEl = (el: El) => {
    const pos: React.CSSProperties = { left: `${el.x}mm`, top: `${el.y}mm` };
    let content: React.ReactNode = null;

    if (el.type === "logo" || el.type === "icon") {
      const src = el.type === "logo" ? LOGO_SRC : ICON_SRC;
      content = (
        <>
          {el.shade && <span className="soft-shade" />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={el.type === "logo" ? "Ilya Medvedev" : ""}
            className={el.white ? "white" : ""}
            style={{ width: `${el.w}mm` }}
            draggable={false}
          />
        </>
      );
    } else if (el.type === "rule") {
      content = <span className="rule" style={{ width: `${el.w}mm`, height: `${el.thick ?? 0.25}mm`, background: el.color }} />;
    } else if (el.type === "text") {
      const sp = el.spacing ?? 0;
      content = (
        <span
          className="txt"
          style={{
            fontSize: `${el.size ?? 7}pt`,
            fontWeight: el.weight ?? 400,
            letterSpacing: `${sp}em`,
            textIndent: `${sp}em`, // компенсирует хвост разрядки: текст по центру
            textTransform: el.upper ? "uppercase" : "none",
            color: el.color ?? "#ffffff",
            fontFamily: el.font === "serif" ? 'Georgia, "Times New Roman", serif' : undefined,
          }}
        >
          {el.text}
        </span>
      );
    } else if (el.type === "qr") {
      content = (
        <>
          {el.shade && <span className="soft-shade soft-shade--qr" />}
          <span
            className="qr-svg"
            style={{ width: `${el.w}mm`, height: `${el.w}mm` }}
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
        </>
      );
    } else if (el.type === "frame") {
      const art = byKey(el.art ?? "oil_03");
      const h = el.h ?? el.w;
      content = (
        <div className="frame" style={{ width: `${el.w}mm`, height: `${h}mm` }}>
          <div className="frame-glow" />
          <div className="frame-edge">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={frameSrc(art.url, el.w, h)}
              alt={art.label}
              style={{ objectPosition: `${el.fx ?? 50}% ${el.fy ?? 50}%` }}
              draggable={false}
            />
          </div>
        </div>
      );
    }

    return (
      <div
        key={el.id}
        data-el={el.id}
        className={`el el--${el.type} ${sel === el.id ? "is-selected" : ""}`}
        style={pos}
        onPointerDown={(e) => onElDown(e, el)}
        onPointerMove={onElMove}
        onPointerUp={onElUp}
        onPointerCancel={onElUp}
      >
        {content}
      </div>
    );
  };

  const logoEl = els.find((e) => e.id === "f-logo");
  const poolY = ((logoEl?.y ?? 48) / CARD_MM) * 100;
  const cardPx = CARD_MM * calib * mult;
  const scale = (calib / PX_PER_MM) * mult;

  const f = cfg.film;
  const sheetStyle = {
    "--radius": `${cfg.radius}mm`,
    "--f-vig": f ? cfg.vig : 0,
    "--f-warm": f ? cfg.warm : 0,
    "--f-desat": f ? Math.max(0, 1 - cfg.sat) : 0,
    "--f-fade": f ? cfg.fade : 0,
    "--f-grain": f ? cfg.grain : 0,
  } as React.CSSProperties;
  const frontStyle = {
    ...sheetStyle,
    "--pool-y": poolY,
    "--pool-a": cfg.nameShade,
    "--top-a": cfg.topShade,
  } as React.CSSProperties;

  const selEl = els.find((e) => e.id === sel) ?? null;
  const patchSel = (p: Partial<El>) => selEl && updateEl(selEl.id, p);

  return (
    <div className="card-generator-root" data-print-round={cfg.printRound ? "true" : "false"}>
      <div className="editor-layout">
        {/* ================= КАРТОЧКИ (слева, на белом фоне) ================= */}
        <div className="stage">
          <div className="cards-row">
            {/* ───── ЛИЦО ───── */}
            <div className="side">
              <div className="card-viewport" style={{ width: cardPx, height: cardPx }}>
                <div className="card-scaler" style={{ transform: `scale(${scale})` }}>
                  <section
                    className="card-sheet front-side"
                    data-side="front"
                    style={frontStyle}
                    onPointerDown={() => setSel(null)}
                  >
                    <div className="art">
                      <Image
                        src={front.url}
                        alt={front.label}
                        fill
                        sizes="1600px"
                        quality={95}
                        className="art-img"
                        priority
                        style={{
                          transform: `scale(${cfg.fZoom})`,
                          transformOrigin: `${cfg.fX}% ${cfg.fY}%`,
                        }}
                      />
                    </div>

                    {cfg.frontCurtains && <Curtains widthMm={(CARD_MM - cfg.slit) / 2} />}
                    <div className="valance" />
                    <div className="pool" />
                    <FilmLayer />

                    {els.filter((e) => e.side === "front" && e.visible).map(renderEl)}

                    {guides && <div className="guides" />}
                  </section>
                </div>
              </div>
              <span className="side-label admin-hide-print">Front</span>
            </div>

            {/* ───── ОБОРОТ ───── */}
            <div className="side">
              <div className="card-viewport" style={{ width: cardPx, height: cardPx }}>
                <div className="card-scaler" style={{ transform: `scale(${scale})` }}>
                  <section
                    className="card-sheet back-side"
                    data-side="back"
                    style={sheetStyle}
                    onPointerDown={() => setSel(null)}
                  >
                    {cfg.backBg === "art" ? (
                      <div className="art">
                        <Image
                          src={byKey(cfg.backKey).url}
                          alt=""
                          fill
                          sizes="1600px"
                          quality={95}
                          className="art-img"
                          style={{
                            transform: `scale(${cfg.bgZoom})`,
                            transformOrigin: `${cfg.bgX}% ${cfg.bgY}%`,
                          }}
                        />
                        <span className="art-dim" style={{ background: `rgba(5,5,5,${cfg.bgDim})` }} />
                      </div>
                    ) : (
                      <div className="wall" />
                    )}

                    {cfg.backCurtains && <Curtains widthMm={cfg.openW} />}
                    <FilmLayer />

                    {els.filter((e) => e.side === "back" && e.visible).map(renderEl)}

                    {guides && <div className="guides" />}
                  </section>
                </div>
              </div>
              <span className="side-label admin-hide-print">Back</span>
            </div>
          </div>
        </div>

        {/* ================= ПАНЕЛЬ (справа) ================= */}
        <aside className="editor-panel admin-hide-print">
          <div className="panel-actions">
            <button onClick={handlePrint} className="download-pdf-btn">
              SAVE AS PDF / PRINT
            </button>
            <button onClick={resetAll} className="style-toggle-btn">
              Reset all
            </button>
          </div>
          <p className="panel-hint">
            Drag any element on the card with the mouse. Arrow keys nudge the selected one (Shift = bigger step).
          </p>

          {/* ───── проверки печати ───── */}
          <section className="panel-section">
            <h3>Print checks</h3>
            {warns.length === 0 ? (
              <p className="ok-note">Inside the 3 mm safe zone, text ≥ 6 pt, QR ≥ 15 mm.</p>
            ) : (
              <ul className="warn-list">
                {warns.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}
          </section>

          {/* ───── реальный размер ───── */}
          <section className="panel-section">
            <h3>Real size (calibrate once)</h3>
            <p className="panel-hint">
              Put your printed 65 × 65 mm card on the dashed square. Move the slider until the edges match exactly.
              Browser zoom must be 100%. Then use view “Actual”.
            </p>
            <div className="calib-wrap">
              <div className="calib-square" style={{ width: CARD_MM * calib, height: CARD_MM * calib }}>
                <span>65 × 65 mm</span>
              </div>
            </div>
            <label className="range-row">
              <span>SCALE</span>
              <input
                type="range"
                min={2.5}
                max={7}
                step={0.005}
                value={calib}
                onChange={(e) => changeCalib(Number(e.target.value))}
              />
              <output>{calib.toFixed(2)}</output>
            </label>
            <button className="style-toggle-btn" onClick={() => changeCalib(PX_PER_MM)}>
              Reset calibration
            </button>
          </section>

          {/* ───── выбранный элемент ───── */}
          <section className="panel-section">
            <h3>{selEl ? `Selected: ${selEl.name}` : "Selected: nothing"}</h3>
            {!selEl && <p className="panel-hint">Click an element on the card or in the list below.</p>}

            {selEl && (
              <>
                <div className="admin-row">
                  <label className="num-row">
                    <span>X mm</span>
                    <input type="number" step="0.1" value={selEl.x} onChange={(e) => patchSel({ x: Number(e.target.value) })} />
                  </label>
                  <label className="num-row">
                    <span>Y mm</span>
                    <input type="number" step="0.1" value={selEl.y} onChange={(e) => patchSel({ y: Number(e.target.value) })} />
                  </label>
                  <button className="style-toggle-btn" onClick={() => patchSel({ x: MID })}>
                    Center X
                  </button>
                </div>

                {(selEl.type === "logo" || selEl.type === "icon") && (
                  <>
                    <Range label="SIZE" value={selEl.w} min={4} max={64} step={0.5} onChange={(v) => patchSel({ w: v })} />
                    <Check label="WHITE" checked={!!selEl.white} onChange={(v) => patchSel({ white: v })} />
                    {selEl.type === "icon" && (
                      <Check label="SOFT SHADE BEHIND" checked={!!selEl.shade} onChange={(v) => patchSel({ shade: v })} />
                    )}
                  </>
                )}

                {selEl.type === "rule" && (
                  <>
                    <Range label="LENGTH" value={selEl.w} min={2} max={50} step={0.5} onChange={(v) => patchSel({ w: v })} />
                    <Range label="THICKNESS" value={selEl.thick ?? 0.25} min={0.1} max={1} step={0.05} onChange={(v) => patchSel({ thick: v })} />
                    <label className="color-row">
                      <span>COLOR</span>
                      <input type="color" value={selEl.color ?? "#e6c9b0"} onChange={(e) => patchSel({ color: e.target.value })} />
                    </label>
                  </>
                )}

                {selEl.type === "text" && (
                  <>
                    <textarea
                      className="text-area"
                      rows={2}
                      value={selEl.text ?? ""}
                      onChange={(e) => patchSel({ text: e.target.value })}
                    />
                    <Range label="SIZE pt" value={selEl.size ?? 7} min={4} max={16} step={0.1} onChange={(v) => patchSel({ size: v })} />
                    <Range label="SPACING" value={selEl.spacing ?? 0} min={0} max={0.6} step={0.01} onChange={(v) => patchSel({ spacing: v })} />
                    <div className="admin-row">
                      <label className="num-row">
                        <span>WEIGHT</span>
                        <select value={selEl.weight ?? 400} onChange={(e) => patchSel({ weight: Number(e.target.value) })}>
                          <option value={300}>Light</option>
                          <option value={400}>Regular</option>
                          <option value={500}>Medium</option>
                          <option value={700}>Bold</option>
                        </select>
                      </label>
                      <label className="num-row">
                        <span>FONT</span>
                        <select value={selEl.font ?? "sans"} onChange={(e) => patchSel({ font: e.target.value as "sans" | "serif" })}>
                          <option value="sans">Sans (site)</option>
                          <option value="serif">Serif</option>
                        </select>
                      </label>
                      <label className="color-row">
                        <span>COLOR</span>
                        <input type="color" value={selEl.color ?? "#ffffff"} onChange={(e) => patchSel({ color: e.target.value })} />
                      </label>
                      <Check label="CAPITALS" checked={!!selEl.upper} onChange={(v) => patchSel({ upper: v })} />
                    </div>
                  </>
                )}

                {selEl.type === "qr" && (
                  <>
                    <Range label="SIZE mm" value={selEl.w} min={8} max={30} step={0.5} onChange={(v) => patchSel({ w: v })} />
                    <label className="color-row">
                      <span>QR COLOR</span>
                      <input type="color" value={selEl.color ?? "#f4efe6"} onChange={(e) => patchSel({ color: e.target.value })} />
                    </label>
                    <Check label="SOFT SHADE BEHIND" checked={!!selEl.shade} onChange={(v) => patchSel({ shade: v })} />
                    <p className="panel-hint">
                      Light code on a dark background reads on most phones, but not all. Print and scan it on 2–3
                      different phones before the print run. Below ~15 mm reliability drops.
                    </p>
                  </>
                )}

                {selEl.type === "frame" && (
                  <>
                    <Picker value={selEl.art ?? "oil_03"} onPick={(k) => patchSel({ art: k })} />
                    <Range label="WIDTH" value={selEl.w} min={6} max={60} step={0.5} onChange={(v) => patchSel({ w: v })} />
                    <Range label="HEIGHT" value={selEl.h ?? selEl.w} min={6} max={60} step={0.5} onChange={(v) => patchSel({ h: v })} />
                    <Range label="FOCUS X" value={selEl.fx ?? 50} min={0} max={100} onChange={(v) => patchSel({ fx: v })} />
                    <Range label="FOCUS Y" value={selEl.fy ?? 50} min={0} max={100} onChange={(v) => patchSel({ fy: v })} />
                  </>
                )}

                {selEl.custom && (
                  <button className="style-toggle-btn danger" onClick={() => removeEl(selEl.id)}>
                    Delete this element
                  </button>
                )}
              </>
            )}
          </section>

          {/* ───── список элементов ───── */}
          <section className="panel-section">
            <h3>Elements</h3>
            {(["front", "back"] as Side[]).map((side) => (
              <div key={side} className="el-list">
                <div className="el-list-head">
                  <span>{side === "front" ? "FRONT" : "BACK"}</span>
                  <button className="style-toggle-btn" onClick={() => addText(side)}>
                    + text
                  </button>
                </div>
                {els
                  .filter((e) => e.side === side)
                  .map((e) => (
                    <div key={e.id} className={`el-row ${sel === e.id ? "active" : ""}`}>
                      <input
                        type="checkbox"
                        checked={e.visible}
                        onChange={(ev) => updateEl(e.id, { visible: ev.target.checked })}
                        title="Show / hide"
                      />
                      <button onClick={() => setSel(e.id)}>
                        {e.name}
                        {e.type === "text" && e.text ? `: ${e.text.slice(0, 22)}` : ""}
                      </button>
                    </div>
                  ))}
              </div>
            ))}
          </section>

          {/* ───── лицо ───── */}
          <section className="panel-section">
            <h3>Front</h3>
            <Picker value={cfg.frontKey} onPick={(k) => patchCfg({ frontKey: k })} />
            <Range label="ZOOM" value={cfg.fZoom} min={1} max={2.5} step={0.05} onChange={(v) => patchCfg({ fZoom: v })} />
            <Range label="X" value={cfg.fX} min={0} max={100} onChange={(v) => patchCfg({ fX: v })} />
            <Range label="Y" value={cfg.fY} min={0} max={100} onChange={(v) => patchCfg({ fY: v })} />
            <Check label="CURTAINS" checked={cfg.frontCurtains} onChange={(v) => patchCfg({ frontCurtains: v })} />
            {cfg.frontCurtains && (
              <Range label="CURTAIN GAP mm" value={cfg.slit} min={6} max={40} onChange={(v) => patchCfg({ slit: v })} />
            )}
            <Range label="NAME SHADE" value={cfg.nameShade} min={0} max={1} step={0.02} onChange={(v) => patchCfg({ nameShade: v })} />
            <Range label="TOP SHADE" value={cfg.topShade} min={0} max={1} step={0.02} onChange={(v) => patchCfg({ topShade: v })} />
          </section>

          {/* ───── оборот ───── */}
          <section className="panel-section">
            <h3>Back background</h3>
            <div className="admin-row">
              <button
                className={`style-toggle-btn ${cfg.backBg === "wall" ? "active" : ""}`}
                onClick={() => patchCfg({ backBg: "wall" })}
              >
                Dark wall
              </button>
              <button
                className={`style-toggle-btn ${cfg.backBg === "art" ? "active" : ""}`}
                onClick={() => patchCfg({ backBg: "art" })}
              >
                Full artwork
              </button>
            </div>
            {cfg.backBg === "art" && (
              <>
                <Picker value={cfg.backKey} onPick={(k) => patchCfg({ backKey: k })} />
                <Range label="ZOOM" value={cfg.bgZoom} min={1} max={2.5} step={0.05} onChange={(v) => patchCfg({ bgZoom: v })} />
                <Range label="X" value={cfg.bgX} min={0} max={100} onChange={(v) => patchCfg({ bgX: v })} />
                <Range label="Y" value={cfg.bgY} min={0} max={100} onChange={(v) => patchCfg({ bgY: v })} />
                <Range label="DIM" value={cfg.bgDim} min={0} max={0.9} step={0.02} onChange={(v) => patchCfg({ bgDim: v })} />
              </>
            )}
            <Check label="CURTAINS" checked={cfg.backCurtains} onChange={(v) => patchCfg({ backCurtains: v })} />
            {cfg.backCurtains && (
              <Range label="CURTAIN WIDTH mm" value={cfg.openW} min={1} max={14} step={0.5} onChange={(v) => patchCfg({ openW: v })} />
            )}
          </section>

          {/* ───── плёночный фильтр ───── */}
          <section className="panel-section">
            <h3>Film look</h3>
            <Check label="ON (both sides)" checked={cfg.film} onChange={(v) => patchCfg({ film: v })} />
            {cfg.film && (
              <>
                <Range label="VIGNETTE" value={cfg.vig} min={0} max={0.9} step={0.02} onChange={(v) => patchCfg({ vig: v })} />
                <Range label="GRAIN" value={cfg.grain} min={0} max={0.4} step={0.01} onChange={(v) => patchCfg({ grain: v })} />
                <Range label="FADE" value={cfg.fade} min={0} max={0.6} step={0.02} onChange={(v) => patchCfg({ fade: v })} />
                <Range label="WARMTH" value={cfg.warm} min={0} max={0.4} step={0.01} onChange={(v) => patchCfg({ warm: v })} />
                <Range label="SATURATION" value={cfg.sat} min={0.6} max={1.2} step={0.01} onChange={(v) => patchCfg({ sat: Math.min(v, 1) })} />
                <p className="panel-hint">
                  Grain and fade soften the picture slightly. Order one proof with and one without the film look and
                  compare on paper.
                </p>
              </>
            )}
          </section>

          {/* ───── QR ───── */}
          <section className="panel-section">
            <h3>QR destination</h3>
            <div className="admin-row">
              {(
                [
                  ["frame", "Center painting"],
                  ["home", "Home"],
                  ["custom", "Custom URL"],
                ] as const
              ).map(([m, label]) => (
                <button
                  key={m}
                  className={`style-toggle-btn ${cfg.qrMode === m ? "active" : ""}`}
                  onClick={() => patchCfg({ qrMode: m })}
                >
                  {label}
                </button>
              ))}
            </div>
            {cfg.qrMode === "custom" && (
              <input
                className="text-input"
                type="url"
                placeholder="https://…"
                value={cfg.qrUrl}
                onChange={(e) => patchCfg({ qrUrl: e.target.value })}
              />
            )}
            <span className="qr-url">QR → {qrTarget}</span>
          </section>

          {/* ───── карточка и просмотр ───── */}
          <section className="panel-section">
            <h3>Card and view</h3>
            <Range label="CORNER RADIUS mm" value={cfg.radius} min={0} max={8} step={0.5} onChange={(v) => patchCfg({ radius: v })} />
            <Check label="ROUNDED CORNERS IN PDF" checked={cfg.printRound} onChange={(v) => patchCfg({ printRound: v })} />
            <div className="admin-row">
              <span className="mini-label">VIEW:</span>
              {[1, 1.5, 2, 3].map((m) => (
                <button key={m} className={`style-toggle-btn ${mult === m ? "active" : ""}`} onClick={() => setMult(m)}>
                  {m === 1 ? "Actual" : `×${m}`}
                </button>
              ))}
            </div>
            <Check label="GUIDES (safe zone 3 mm)" checked={guides} onChange={setGuides} />
          </section>
        </aside>
      </div>
    </div>
  );
}