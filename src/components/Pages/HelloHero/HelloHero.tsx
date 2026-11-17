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

// Вертикальные кадры для телефонов. Добавьте сюда 3–5 ссылок Cloudinary.
// Пока список пустой, на телефоне те же картины, но Cloudinary сам вырезает из них вертикальный кадр
const MOBILE_IMAGES: string[] = [];

// Высота слоя относительно секции: должна совпадать с height: 112% в helloHero.scss
const LAYER_SCALE = 1.12;
const LOAD_TIMEOUT = 15000; // мс: картину, которая не грузится дольше, пропускаем

type Env = { mobile: boolean; width: number };

// Cloudinary: размер, качество, формат. Адреса с уже заданными преобразованиями не трогаем
const buildSrc = (url: string, env: Env, dedicatedMobile: boolean): string => {
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  const after = url.split('/upload/')[1] ?? '';
  if (!/^v\d+\//.test(after)) return url;

  if (env.mobile && !dedicatedMobile) {
    // вертикальная вырезка 9:16 с автоматическим выбором главной области; c_lfill не растягивает маленькие файлы
    return url.replace('/upload/', `/upload/ar_9:16,c_lfill,g_auto,w_${env.width},f_auto,q_auto:good/`);
  }
  return url.replace('/upload/', `/upload/f_auto,q_auto:good,w_${env.width},c_limit/`);
};

interface HelloHeroProps {
  images?: string[];
  /** Вертикальные кадры для телефона. Если пусто, берётся вертикальная вырезка из images */
  mobileImages?: string[];
  slideDuration?: number; // мс между сменами
  fadeDuration?: number; // мс самого перехода
  navbarHeight?: string;
  /** false, пока закрыты шторы; true, когда они начали открываться. Без шторы по умолчанию true */
  start?: boolean;
  /** Пауза (мс) после открытия до появления имени: пока шторы расходятся */
  revealDelay?: number;
  /** Подпись под именем */
  subtitle?: string;
  /** Файл логотипа в public */
  logoSrc?: string;
  /** Сила затемнения под именем и по краям: 0 = нет, 1 = как было */
  shade?: number;
  /** false: без движения картин, только кроссфейд (для слабых устройств и проверки) */
  motion?: boolean;
  /** true: Cloudinary отдаёт уменьшенные копии */
  optimizeCloudinary?: boolean;
  /** Потолок ширины для больших экранов, px. На 4K-мониторах можно поставить 3200 */
  maxWidth?: number;
}

export default function HelloHero({
  images = HERO_IMAGES,
  mobileImages = MOBILE_IMAGES,
  slideDuration = 3000,
  fadeDuration = 350,
  navbarHeight = '0px',
  start = true,
  revealDelay = 900,
  subtitle = 'Artist',
  logoSrc = '/ilya-medvedev.svg',
  shade = 0.6,
  motion = true,
  optimizeCloudinary = true,
  maxWidth = 2200,
}: HelloHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  // пропорции (ширина / высота) уже загруженных и декодированных картинок
  const [ratios, setRatios] = useState<Record<string, number>>({});
  // размер слоя в px: нужен, чтобы посчитать cover и величину проезда
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const [lowEnd, setLowEnd] = useState(false);
  // телефон или нет и ширина загружаемых картин; известно только в браузере
  const [env, setEnv] = useState<Env | null>(null);

  const currentRef = useRef(0);
  const readyRef = useRef<Set<string>>(new Set());
  const keepAliveRef = useRef<HTMLImageElement[]>([]);

  // Телефон и вертикальные экраны получают вертикальные кадры; ширина считается от экрана и плотности пикселей
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 820px), (max-aspect-ratio: 1/1)');

    const update = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      if (mq.matches) {
        setEnv({ mobile: true, width: Math.min(1440, Math.round(window.innerWidth * dpr)) });
      } else {
        const vw = window.innerWidth;
        setEnv({ mobile: false, width: vw <= 1500 ? Math.min(maxWidth, 1600) : maxWidth });
      }
    };

    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [maxWidth]);

  const dedicatedMobile = !!env?.mobile && mobileImages.length > 0;
  const list = dedicatedMobile ? mobileImages : images;

  const srcs = useMemo(
    () => list.map((u) => (optimizeCloudinary && env ? buildSrc(u, env, dedicatedMobile) : u)),
    [list, optimizeCloudinary, env, dedicatedMobile]
  );

  // Список сменился (поворот экрана): начинаем с первой картины
  useEffect(() => {
    setCurrentIndex(0);
    setPrevIndex(null);
    currentRef.current = 0;
  }, [list]);

  // Слабое устройство (deviceMemory есть в Chrome/Android): движение отключаем, остаётся кроссфейд
  useEffect(() => {
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (typeof mem === 'number' && mem <= 2) setLowEnd(true);
  }, []);

  // Загрузка по очереди: первая картина одна, остальные после неё.
  // Идёт и за закрытыми шторами, поэтому к открытию картины уже готовы.
  // Ссылки на Image храним, чтобы браузер не выбросил декодированный кадр
  useEffect(() => {
    if (!env) return;
    let cancelled = false;

    const load = async (i: number) => {
      const original = list[i];
      const img = new Image();
      img.decoding = 'async';
      img.src = srcs[i];
      keepAliveRef.current.push(img);

      const decoded =
        typeof img.decode === 'function'
          ? img.decode()
          : new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = () => reject(new Error('load failed'));
            });

      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), LOAD_TIMEOUT)
      );

      try {
        await Promise.race([decoded, timeout]);
      } catch {
        return; // не загрузилась: пропускаем, слайдер её не покажет
      }

      if (cancelled || !img.naturalWidth || !img.naturalHeight) return;
      readyRef.current.add(original);
      const ratio = img.naturalWidth / img.naturalHeight;
      setRatios((prev) => (prev[original] ? prev : { ...prev, [original]: ratio }));
    };

    const run = async () => {
      for (let i = 0; i < list.length; i++) {
        if (cancelled) return;
        await load(i);
        // пауза между картинками: страница и первые экраны успевают загрузиться
        await new Promise((r) => setTimeout(r, i === 0 ? 600 : 250));
      }
    };

    run();

    return () => {
      cancelled = true;
      keepAliveRef.current = [];
    };
  }, [list, srcs, env]);

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

  // Смена слайдов: начинается только после открытия штор
  useEffect(() => {
    if (!start || list.length <= 1) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let fallback: ReturnType<typeof setTimeout> | undefined;

    // первая готовая (декодированная) картинка после текущей: нерабочие пропускаем
    const pickNext = (): number | null => {
      for (let step = 1; step < list.length; step++) {
        const idx = (currentRef.current + step) % list.length;
        if (readyRef.current.has(list[idx])) return idx;
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
  }, [start, list, slideDuration, fadeDuration]);

  // Какая картинка будет следующей: её слой монтируем заранее (с opacity 0), чтобы смена шла без «вспышки»
  let nextIndex: number | null = null;
  for (let step = 1; step < list.length; step++) {
    const idx = (currentIndex + step) % list.length;
    if (ratios[list[idx]]) {
      nextIndex = idx;
      break;
    }
  }

  // Движение длится ровно до момента, когда слой скрывается: без паузы и замедления в конце
  const scanDuration = `${(slideDuration + fadeDuration + 50) / 1000}s`;
  const motionOn = motion && !lowEnd;
  const mobile = !!env?.mobile;

  // На телефоне вертикальной прокрутки почти нет (кадр уже вертикальный): наезд и дрейф сильнее
  const z0 = mobile ? 1.14 : 1.08;
  const z1 = mobile ? 1.02 : 1.02;
  const drift = mobile ? 0.035 : 0.02;

  return (
    <section
      ref={sectionRef}
      className="helloHeroSection"
      data-motion={motionOn ? 'on' : 'off'}
      data-ready={start}
      style={
        {
          '--nav-height': navbarHeight,
          '--fade-duration': `${fadeDuration}ms`,
          '--scan-duration': scanDuration,
          '--reveal-delay': `${revealDelay}ms`,
          '--shade': shade,
          '--z0': z0,
          '--z1': z1,
        } as React.CSSProperties
      }
    >
      {list.map((url, idx) => {
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

        // начало и конец движения (наезд идёт в keyframes)
        const ty0 = -drift * box.h;
        const ty1 = drift * box.h - pan;

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
            <img className="heroLogo" src={logoSrc} alt="Ilya Medvedev" draggable={false} />
          </span>
        </h1>
        {subtitle && <p className="heroSubtitle">{subtitle}</p>}
      </div>
    </section>
  );
}