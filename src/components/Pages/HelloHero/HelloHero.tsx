'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import './helloHero.scss';

const HERO_IMAGES = [
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779620844/ph2026kineret-2-500kb_qzscpo.jpg',
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613680/IMG_4838ph2026-2-500kb_qsqudt.jpg',
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1791641325/IMG_4285-2ph2026-2-500kb_i00dnd.jpg',
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1782937567/good_Alla_2026_photoshop-500kb_q5prhs.jpg',
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779781882/detail2021-ph2026_l7zv21.jpg',
];

// Высота слоя относительно секции: должна совпадать с height: 112% в helloHero.scss
const LAYER_SCALE = 1.12;
// Максимальная ширина картинки при загрузке: меньше памяти на декодирование
const MAX_WIDTH = 2200;

// Cloudinary: добавляем f_auto,q_auto и ограничение ширины. Остальные URL не трогаем
const optimizeSrc = (url: string, width: number): string => {
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  const after = url.split('/upload/')[1] ?? '';
  if (!/^v\d+\//.test(after)) return url; // трансформации в URL уже есть
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
};

interface HelloHeroProps {
  images?: string[];
  slideDuration?: number; // мс между сменами
  fadeDuration?: number; // мс самого перехода
  navbarHeight?: string;
  /** false: без движения картин, только кроссфейд (для слабых устройств и проверки) */
  motion?: boolean;
  /** true: Cloudinary отдаёт уменьшенные копии (f_auto,q_auto,w_2200) */
  optimizeCloudinary?: boolean;
}

export default function HelloHero({
  images = HERO_IMAGES,
  slideDuration = 3000,
  fadeDuration = 350,
  navbarHeight = '0px',
  motion = true,
  optimizeCloudinary = true,
}: HelloHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  // пропорции (ширина / высота) уже загруженных и декодированных картинок
  const [ratios, setRatios] = useState<Record<string, number>>({});
  // размер слоя в px: нужен, чтобы посчитать cover и величину проезда
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const [lowEnd, setLowEnd] = useState(false);

  const currentRef = useRef(0);
  const readyRef = useRef<Set<string>>(new Set());
  const keepAliveRef = useRef<HTMLImageElement[]>([]);

  // Что реально грузим: оригинальные ссылки или уменьшенные копии
  const srcs = useMemo(
    () => images.map((u) => (optimizeCloudinary ? optimizeSrc(u, MAX_WIDTH) : u)),
    [images, optimizeCloudinary]
  );

  // Слабое устройство (deviceMemory есть в Chrome/Android): движение отключаем, остаётся кроссфейд
  useEffect(() => {
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (typeof mem === 'number' && mem <= 2) setLowEnd(true);
  }, []);

  // Предзагрузка + декодирование. Ссылки на Image храним, чтобы браузер не выбросил декодированный кадр
  useEffect(() => {
    let cancelled = false;

    images.forEach((original, i) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = srcs[i];
      keepAliveRef.current.push(img);

      const done = () => {
        if (cancelled || !img.naturalWidth || !img.naturalHeight) return;
        readyRef.current.add(original);
        const ratio = img.naturalWidth / img.naturalHeight;
        setRatios((prev) => (prev[original] ? prev : { ...prev, [original]: ratio }));
      };

      if (typeof img.decode === 'function') img.decode().then(done).catch(done);
      else img.onload = done;
    });

    return () => {
      cancelled = true;
      keepAliveRef.current = [];
    };
  }, [images, srcs]);

  // Размер слоя следит за секцией (поворот экрана, ресайз)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      const h = Math.round(el.clientHeight * LAYER_SCALE);
      setBox((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Смена слайдов
  useEffect(() => {
    if (images.length <= 1) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let fallback: ReturnType<typeof setTimeout> | undefined;

    // первая готовая (декодированная) картинка после текущей: нерабочие пропускаем
    const pickNext = (): number | null => {
      for (let step = 1; step < images.length; step++) {
        const idx = (currentRef.current + step) % images.length;
        if (readyRef.current.has(images[idx])) return idx;
      }
      return null;
    };

    const tick = () => {
      // вкладка в фоне или следующая картинка ещё не готова: ждём, а не показываем недогруженное
      const next = document.hidden ? null : pickNext();
      if (next === null) {
        timer = setTimeout(tick, 300);
        return;
      }

      const from = currentRef.current;
      currentRef.current = next;
      setPrevIndex(from);
      setCurrentIndex(next);

      // страховка: основной способ убрать уходящий слой это transitionend (см. ниже)
      clearTimeout(fallback);
      fallback = setTimeout(() => setPrevIndex(null), fadeDuration + 400);

      timer = setTimeout(tick, slideDuration);
    };

    timer = setTimeout(tick, slideDuration);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallback);
    };
  }, [images, slideDuration, fadeDuration]);

  // Какая картинка будет следующей: её слой монтируем заранее (с opacity 0), чтобы смена шла без «вспышки»
  let nextIndex: number | null = null;
  for (let step = 1; step < images.length; step++) {
    const idx = (currentIndex + step) % images.length;
    if (ratios[images[idx]]) {
      nextIndex = idx;
      break;
    }
  }

  // Движение длится ровно до момента, когда слой скрывается: без паузы и замедления в конце
  const scanDuration = `${(slideDuration + fadeDuration + 50) / 1000}s`;
  const motionOn = motion && !lowEnd;

  return (
    <section
      ref={sectionRef}
      className="helloHeroSection"
      data-motion={motionOn ? 'on' : 'off'}
      style={
        {
          '--nav-height': navbarHeight,
          '--fade-duration': `${fadeDuration}ms`,
          '--scan-duration': scanDuration,
        } as React.CSSProperties
      }
    >
      {images.map((url, idx) => {
        const ratio = ratios[url];
        const isActive = idx === currentIndex;
        const isLeaving = idx === prevIndex && !isActive;
        const isNext = idx === nextIndex;

        // в DOM только текущий, уходящий и следующий слои, и только после декодирования
        if (!box || !ratio || !(isActive || isLeaving || isNext)) return null;

        // cover: такой же размер, как у background-size: cover
        const dh = Math.ceil(Math.max(box.h, box.w / ratio));
        const dw = Math.ceil(dh * ratio);
        // на сколько картина выше слоя: ровно столько она проезжает сверху вниз
        const pan = Math.max(0, dh - box.h);

        // начало и конец движения (наезд идёт в keyframes): те же ±2%, что были у слоя
        const ty0 = -0.02 * box.h;
        const ty1 = 0.02 * box.h - pan;

        const state = isActive ? 'active' : isLeaving ? 'leaving' : '';

        return (
          <div
            key={url}
            className={`verticalScanLayer ${state}`}
            onTransitionEnd={(e) => {
              // новый слой полностью проявился: теперь уходящий можно убрать незаметно
              if (isActive && e.propertyName === 'opacity') setPrevIndex(null);
            }}
          >
            <img
              className="verticalScanImage"
              src={srcs[idx]}
              alt=""
              draggable={false}
              decoding="async"
              style={
                {
                  width: dw,
                  height: dh,
                  marginLeft: -dw / 2,
                  '--ty0': `${ty0}px`,
                  '--ty1': `${ty1}px`,
                  '--pan': `${-pan}px`,
                } as React.CSSProperties
              }
            />
          </div>
        );
      })}

      <div className="heroOverlay">
        <h1 className="heroTitle">
          <span className="heroLogoMask">
            <img
              className="heroLogo"
              src="/ILYA MEDVEDEV.svg"
              alt="Илья Медведев"
              draggable={false}
            />
          </span>
        </h1>
        <p className="heroSubtitle">Contemporary Artist</p>
      </div>
    </section>
  );
}