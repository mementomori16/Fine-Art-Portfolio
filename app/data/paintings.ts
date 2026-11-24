import { buildResponsiveImage } from "../../src/utils/paintingsAdapter";

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

export interface PaintingImageSet {
  small: string;
  medium: string;
  large: string;
}

export interface StyleCategory {
  id: string;
  slug: string;
  titleKey: string;
  coverImage?: string;
  isUpcoming?: boolean;
  name?: string;
}

export interface Painting {
  id: string;
  slug: string;
  category: "oil-paintings" | "drawings" | "watercolors" | "other-works" | "tempera";
  subcategory?: "nude" | "portrait" | "general";
  style?: string;
  year?: number | string;
  tags?: string[];
  images: PaintingImageSet;
  thumbnail?: string;
  thumbnail2?: string;
  thumbnail3?: string;
  isFeatured?: boolean;
}

export interface CategoryCover {
  id: string;
  slug: string;
  titleKey: string;
  cloudinaryId: string;
}

export interface YearGroup {
  year: number;
  paintings: Painting[];
}

// ==========================================
// 2. HELPER UTILITIES
// ==========================================

const makeImageSet = (baseUrl: string): PaintingImageSet => {
  return buildResponsiveImage(baseUrl.trim());
};

export const getPaintingTags = (painting: Painting): string[] => {
  if (painting.tags && painting.tags.length > 0) {
    return painting.tags;
  }
  if (painting.slug) {
    return painting.slug.split(",").map((tag) => tag.trim());
  }
  return [];
};

export const getPaintingStartYear = (year?: number | string): number | null => {
  if (year === undefined || year === null) return null;
  if (typeof year === "number") {
    return Number.isFinite(year) && year > 1900 && year < 2100 ? year : null;
  }
  const match = String(year).trim().match(/\d{4}/);
  if (!match) return null;
  const num = Number(match[0]);
  return Number.isFinite(num) && num > 1900 && num < 2100 ? num : null;
};

const parseStartYear = (year?: number | string): number => {
  return getPaintingStartYear(year) ?? Number.MAX_SAFE_INTEGER;
};

export function getAvailableYears(paintings: Painting[] = PAINTINGS): number[] {
  const years = new Set<number>();

  for (const painting of paintings) {
    if (!painting.images) continue;
    const startYear = getPaintingStartYear(painting.year);
    if (startYear !== null) {
      years.add(startYear);
    }
  }

  return Array.from(years).sort((a, b) => a - b);
}

export function groupPaintingsByYear(paintings: Painting[] = PAINTINGS): YearGroup[] {
  const map = new Map<number, Painting[]>();

  for (const painting of paintings) {
    if (!painting.images) continue;
    const startYear = getPaintingStartYear(painting.year);
    if (startYear === null) continue;

    const list = map.get(startYear) ?? [];
    list.push(painting);
    map.set(startYear, list);
  }

  return Array.from(map.entries())
    .sort(([yearA], [yearB]) => yearA - yearB)
    .map(([year, items]) => ({
      year,
      paintings: items,
    }));
}

export function mixPaintingsEvenly(paintings: Painting[]): Painting[] {
  const valid = paintings.filter((painting) => Boolean(painting.images));
  if (valid.length <= 1) return valid;

  const buckets = new Map<string, Painting[]>();
  for (const painting of valid) {
    const key = painting.category || "other";
    const list = buckets.get(key) ?? [];
    list.push(painting);
    buckets.set(key, list);
  }

  const total = valid.length;
  const slots: (Painting | null)[] = new Array(total).fill(null);

  const sortedBuckets = Array.from(buckets.values()).sort((a, b) => a.length - b.length);

  for (const bucket of sortedBuckets) {
    const count = bucket.length;
    if (count === 0) continue;

    for (let i = 0; i < count; i++) {
      const idealIndex = Math.floor(((i + 0.5) * total) / count);
      let pos = Math.min(total - 1, Math.max(0, idealIndex));

      if (slots[pos] !== null) {
        let offset = 1;
        while (pos - offset >= 0 || pos + offset < total) {
          if (pos - offset >= 0 && slots[pos - offset] === null) {
            pos = pos - offset;
            break;
          }
          if (pos + offset < total && slots[pos + offset] === null) {
            pos = pos + offset;
            break;
          }
          offset++;
        }
      }

      slots[pos] = bucket[i];
    }
  }

  return slots.filter((item): item is Painting => item !== null);
}

export function getPaintingsByStyle(styleIdOrSlug: string): Painting[] {
  const query = styleIdOrSlug.toLowerCase().trim();

  if (query === "all-paintings" || query === "all-works") {
    return mixPaintingsEvenly(PAINTINGS);
  }

  if (query === "works-by-years") {
    const withYear = PAINTINGS.filter(
      (painting) => Boolean(painting.images) && getPaintingStartYear(painting.year) !== null
    );

    if (withYear.length > 0) {
      return [...withYear].sort((a, b) => parseStartYear(a.year) - parseStartYear(b.year));
    }

    return mixPaintingsEvenly(PAINTINGS);
  }

  // Explicit guard for Heritage & Antiques
  if (query === "heritage-antiques" || query === "heritage" || query === "antiques") {
    return PAINTINGS.filter(
      (painting) =>
        painting.category === "tempera" ||
        painting.category === "other-works" ||
        painting.style?.toLowerCase() === "stone" ||
        painting.tags?.some((t) =>
          ["icon", "stone", "heritage", "antiques"].includes(t.toLowerCase())
        )
    );
  }

  // Explicit guard for Landscapes & Still Life
  if (query === "landscape-still-life" || query === "landscapes" || query === "landscape") {
    return PAINTINGS.filter(
      (painting) =>
        painting.style?.toLowerCase().includes("landscape") ||
        painting.style?.toLowerCase().includes("still") ||
        painting.tags?.some((t) =>
          ["landscape", "still-life", "still_life", "nature"].includes(t.toLowerCase())
        )
    );
  }

  // Explicit guard for Memento Mori
  if (query === "memento-mori" || query === "mortality-memento-mori") {
    return PAINTINGS.filter(
      (painting) =>
        painting.style?.toLowerCase().includes("memento") ||
        painting.tags?.some((t) =>
          ["memento-mori", "memento_mori", "mortality"].includes(t.toLowerCase())
        )
    );
  }

  // Explicit guard for Psychological Realism
  if (query === "psychological-realism" || query === "bad-painting-psychological-realism") {
    return PAINTINGS.filter(
      (painting) =>
        painting.style?.toLowerCase().includes("psychological") ||
        painting.style?.toLowerCase().includes("bad-painting") ||
        painting.tags?.some((t) =>
          ["psychological-realism", "bad-painting", "realism"].includes(t.toLowerCase())
        )
    );
  }

  // Fallback for portraits, nudes, etc.
  return PAINTINGS.filter((painting) => {
    const matchesStyle = painting.style?.toLowerCase() === query;
    const matchesSubcat = painting.subcategory?.toLowerCase() === query;
    const matchesTags = painting.tags?.some((tag) => tag.toLowerCase() === query);

    return matchesStyle || matchesSubcat || matchesTags;
  });
}

// ==========================================
// 3. PAINTINGS DATA
// ==========================================

export const PAINTINGS: Painting[] = [
  // =========================
  // OIL PAINTINGS
  // =========================
  {
    id: "oil_02",
    slug: "Male and Female Skulls Oil Painting",
    category: "oil-paintings",
    style: "memento-mori",
    year: "2020-2021",
    tags: ["memento-mori","vanitas"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1795380735/1ph2026-2-1mb_arkevn.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779781725/detal-2021-ph2026_eu8ac6.jpg",
    thumbnail2:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1791055741/IMG_3357-500kb_rcpa9f.jpg",
  },
  {
    id: "oil_03",
    slug: "commited-suicide-girl",
    category: "oil-paintings",
    style: "memento-mori",
    year: "2018",
    tags: ["memento-mori", "vanitas"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613732/IMG_8469ph2026-500kb_fipv2h.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613717/The_best_photo_Autopsia_of_a_commited_suicide_girl%D0%B7%D1%8026500kb_bup3cx.jpg",
  },
  {
    id: "oil_04",
    slug: "nude-study",
    category: "oil-paintings",
    subcategory: "nude",
    style: "nude",
    year: "2012",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1795381537/IMG_4906_photoshoped_12.2025-2026-500kb_ee9h5q.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782937567/good_Alla_2026_photoshop-500kb_q5prhs.jpg",
  },
  {
    id: "oil_06",
    slug: "nude-dance",
    category: "oil-paintings",
    subcategory: "nude",
    style: "nude",
    year: "2008",
    tags: ["nude","vanitas"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1770367743/photoshoped_2025_Royal_Gore._Oil_on_canvas_111_x_200_cm._2008._500kb_e9z43l.jpg"
    ),
  },
  {
    id: "oil_07",
    slug: "skinned",
    category: "oil-paintings",
    style: "memento-mori",
    year: "2018",
    tags: ["memento-mori", "vanitas"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613731/varnished-and-photoshoped-small-2-500kb_jgndqr.jpg"
    ),
  },
  {
    id: "oil_08",
    slug: "Tereza-portrait",
    category: "oil-paintings",
    style: "portrait",
    year: "2012",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613701/IMG_4550ph26-500kb_lqn3zn.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1781963283/IMG_4840-darker_2025_iwfsdy.jpg",
  },
  {
    id: "oil_09",
    slug: "ed-gein",
    category: "oil-paintings",
    style: "memento-mori",
    year: "2018",
    tags: ["memento-mori"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1795113336/edgein-new-21ph2026-500kb_rxq3rg.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780072416/ed500kb_eb2ppw.jpg",
    thumbnail2:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782294108/closeup2018-500kb_ihzwdb.jpg",
  },
  {
    id: "oil_11",
    slug: "drowned",
    category: "oil-paintings",
    style: "memento-mori",
    year: "2018",
    tags: ["memento-mori"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779784466/Portraite_of_drowned_woman_2018500KB_dacbwg.jpg"
    ),
  },
  {
    id: "oil_12",
    slug: "nude-on-the-chair",
    category: "oil-paintings",
    subcategory: "nude",
    style: "nude",
    year: "2008-2009",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613717/IMGP3286PH26-2-500b_nidce0.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782300692/IMGP3308-Recovered_r5am4h.jpg",
  },
  {
    id: "oil_13",
    slug: "serial-killer-chikatilo",
    category: "oil-paintings",
    style: "memento-mori",
    year: "2013",
    tags: ["memento-mori"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1795380713/Photoshoped-panorama2026-5dark-500-2kb_adr2wp.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1795380858/DSC_0973ph2026-500kb10_yahfee.jpg",
    thumbnail2:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1795434107/IMG_4880photoshoped_2026-500kb2_iqdro1.jpg",
  },
  {
    id: "oil_14",
    slug: "Lenin-portrait",
    category: "oil-paintings",
    style: "portrait",
    year: "2026",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1791048507/IMG_4285-2ph2026-500kb_gxegvt.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1791641325/IMG_4285-2ph2026-2-500kb_i00dnd.jpg",
  },
  {
    id: "oil_15",
    slug: "Basel-landscape",
    category: "oil-paintings",
    style: "landscape",
    year: "2021",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1791054706/IMG_8563paint-ph2026-500kb_lja2dj.jpg"
    ),
  },
  {
    id: "oil_16",
    slug: "Basel Klara",
    category: "oil-paintings",
    style: "landscape",
    year: "2021",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1794908023/IMG_3206-2026-500kb_dzu18l.jpg"
    ),
  },

  // =========================
  // DRAWINGS
  // =========================
  {
    id: "drw_01",
    slug: "feet-study",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    year: "2024",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782219354/IMG_2668_photoshoped_2026-2-500kb_q7vlr1.jpg"
    ),
  },
  {
    id: "drw_02",
    slug: "celine-portrait-1",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    year: "2017",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032516/SKM_C45818070115150_0002small-500kb_kuaces.jpg"
    ),
  },
  {
    id: "drw_03",
    slug: "parrot-drawing",
    category: "drawings",
    subcategory: "general",
    style: "animals",
    year: 2017,
    tags: ["animals"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032420/Parrot._Scanned_and_photoshoped_smaller2500kb_b6vay5.jpg"
    ),
  },
  {
    id: "drw_04",
    slug: "katya-nude-drawing",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    year: "2024",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032418/katya_photoshop_2025-ph500kb_aokpyv.jpg"
    ),
  },
  {
    id: "drw_05",
    slug: "alina",
    category: "drawings",
    subcategory: "general",
    style: "portrait",
    year: "2024",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032414/IMG_3232-500kb_lifcup.jpg"
    ),
  },
  {
    id: "drw_06",
    slug: "dorkas-portrait",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    year: "2017",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032411/Dorkas_new_ph_12-25-500kb_nua9wb.jpg"
    ),
  },
  {
    id: "drw_07",
    slug: "joe-pesci-portrait",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    year: "2018",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032418/Joe_Pesci_small-500kb_d6ngvt.jpg"
    ),
  },
  {
    id: "drw_08",
    slug: "alla-drawing",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    year: "2012",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1777925635/IMG_4691-ph2026-500kb_iq9ive.jpg"
    ),
  },
  {
    id: "drw_09",
    slug: "e.t",
    category: "drawings",
    subcategory: "general",
    style: "animals",
    year: "2018",
    tags: ["animals"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032471/photoshoped2025final500kb_n1aj9r.jpg"
    ),
  },
  {
    id: "drw_10",
    slug: "nude-drawing-closeup",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    year: "2016",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032413/IMG_3012closeup500kb_xo89iy.jpg"
    ),
  },
  {
    id: "drw_11",
    slug: "landscape-spain-drawing",
    category: "drawings",
    subcategory: "general",
    style: "landscape",
    year: "2024",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032411/IMG_2825ph1225-500kb_szirsi.jpg"
    ),
  },
  {
    id: "drw_12",
    slug: "girl-from-brasil",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    year: "2016",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032411/IMG_20161119_202342-500kb_wsdt7u.jpg"
    ),
  },
  {
    id: "drw_13",
    slug: "anna-palestine-portrait",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    year: "2024",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780058220/Anna_Palestine_22.08.2026-500kb_qyfbpj.jpg"
    ),
  },
  {
    id: "drw_14",
    slug: "vincent-portrait-drawing",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    year: "2024",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780058094/Vincent.2026photoshoped-500kb_ueocvk.jpg"
    ),
  },
  {
    id: "drw_15",
    slug: "nude-vulva-drawing",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    year: "2016",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613765/IMG_3256ph2026-500kb_hfrcvq.jpg"
    ),
  },
  {
    id: "drw_16",
    slug: "dorna-portrait-scanned",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    year: "2017",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780059850/dorna_scanned-ph2026-500kb_kmobkt.jpg"
    ),
  },
  {
    id: "drw_17",
    slug: "nude-in spain-drawing",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    year: "2024",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780060152/IMG_2724-500kb_dwm95t.jpg"
    ),
  },
  {
    id: "drw_18",
    slug: "portrait-of-anna",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    year: "2016",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780063098/IMG_3009ph2026_inxb8h.jpg"
    ),
  },
  {
    id: "drw_19",
    slug: "lena-on-soda",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    year: "2017",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780066162/Lena_scannedph26-500kb_lg9xnu.jpg"
    ),
  },
  {
    id: "drw_20",
    slug: "monkey-detail-drawing",
    category: "drawings",
    subcategory: "general",
    style: "animals",
    year: "2017",
    tags: ["animals"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780066797/scanned_small._detail-ph2026-500kb_mjxh6o.jpg"
    ),
  },
  {
    id: "drw_21",
    slug: "vulva-on-the-beach",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    year: "2025",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780067263/IMG_3445500kb_yti8g7.jpg"
    ),
  },
  {
    id: "drw_22",
    slug: "annushka-nude-drawing",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    year: "2026",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1795123512/Annushkaph26-500kb_pkswzz.jpg"
    ),
  },
  {
    id: "drw_23",
    slug: "anatomical-nude-roger",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    year: "2025",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780313320/Penis_of_Roger-500kb_dhjkvd.jpg"
    ),
  },
  {
    id: "drw_24",
    slug: "mother-olga",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    year: "2025",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780346883/PHOTOSHOPED_2025-500kb_v6fxul.jpg"
    ),
  },
  {
    id: "drw_25",
    slug: "portrait-of-hen",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    year: "2016",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780353350/IMG_2982ph2026-500kb_pvxpu0.jpg"
    ),
  },
  {
    id: "drw_26",
    slug: "anatomical-nude-trannsexual",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    year: "2021",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780669428/IMG_8450-500kb_gnmzdx.jpg"
    ),
  },
  {
    id: "drw_27",
    slug: "anatomical-nude-drawing-penis",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    year: "2025",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780682625/IMG_3441-500kb_rwqgsh.jpg"
    ),
  },
  {
    id: "drw_28",
    slug: "nude-on-rhine-drawing",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    year: "2025",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780682625/IMG_3435-500kb_vm4wtr.jpg"
    ),
  },
  {
    id: "drw_29",
    slug: "lily-portrait-drawing",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    year: "2024",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780682883/Lily_18.06.2024-500kb_gisley.jpg"
    ),
  },
  {
    id: "drw_30",
    slug: "brussels-drawing",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    year: "2025",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780682876/IMG_3246-500kb_m9lhwp.jpg"
    ),
  },
  {
    id: "drw_31",
    slug: "lion-cub",
    category: "drawings",
    subcategory: "general",
    style: "animals",
    year: "2017",
    tags: ["animals"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032414/IMG_3271ph12.2025500kb_gjyybh.jpg"
    ),
  },
  {
    id: "drw_32",
    slug: "groben-portrait-drawing",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    year: "2026",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782219702/Groben._Oil_Pastels_on_Paper-500kb_xpitig.jpg"
    ),
  },
  {
    id: "drw_33",
    slug: "Katya-nude-from-the-back",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    year: "2026",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782220926/Katya-500kb_nuiuux.jpg"
    ),
  },
  {
    id: "drw_34",
    slug: "batt-anus-long-penis",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    year: "2024",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782236992/IMG_2695ph2026-500kb_b6jdul.jpg"
    ),
  },
  {
    id: "drw_35",
    slug: "birsfelden-nude",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    year: "2021",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782287753/birsfelden_small_rroyxv.jpg"
    ),
  },
  {
    id: "drw_36",
    slug: "portrait-anna-berlin",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    year: "2017",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782287975/scanned_alexandra_or_anna_photoshoped_2026-500kb_dluh1j.jpg"
    ),
  },
  {
    id: "drw_37",
    slug: "atomium",
    category: "drawings",
    subcategory: "general",
    style: "landscape",
    year: "2025",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782289675/IMG_3243_hs1ak8.jpg"
    ),
  },
  {
    id: "drw_38",
    slug: "solaris-landscape",
    category: "drawings",
    subcategory: "general",
    style: "landscape",
    year: "2025",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782933295/IMG_3453%D0%B7%D1%802026-500kb_hbni35.jpg"
    ),
  },
  {
    id: "drw_39",
    slug: "ed-gein-portrait",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    year: "2016",
    tags: ["portrait, memento-mori"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1792150132/IMG_3260-500kb_olvdjk.jpg"
    ),
  },
  {
    id: "drw_40",
    slug: "nicolas-cage-portrait",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    year: "2018",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1794773795/nikki_22_photoshop2026-2-500kb_pk49lj.jpg"
    ),
  },
  {
    id: "drw_41",
    slug: "judge-portrait",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    year: "2024-2025",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1794864748/IMG_3247ph-26_qkhhkk.jpg"
    ),
  },
   {
    id: "drw_42",
    slug: "feet",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    year: "2024",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1795293231/IMG_3216-2026-500kb_cocjgn.jpg"
    ),
  },
  {
    id: "drw_43",
    slug: "kogan-portrait",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    year: "2016",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1795427867/IMG_2985-ph2026-500kb_g8kw3y.jpg"
    ),
   },
   {
    id: "drw_44",
    slug: "intimate-portrait-of-katya",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait, nude",
    year: "2013",
    tags: ["portrait, nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1795430121/IMG_4738_ph2026-500kb_r0scvu.jpg",
    ),
      thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1795433076/IMG_4732-500kb_dlkbfc.jpg",
   },
 


  // =========================
  // WATERCOLORS
  // =========================
  {
    id: "wat_01",
    slug: "nude-on-sofa-with-a-skull",
    category: "watercolors",
    style: "memento-mori",
    year: "2019",
    tags: ["nude", "memento-mori"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1795360284/ph2026kineret-3-500kb_tunhel.jpg"
    ),
     thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1795360444/edited-No_borders-croped500kb_jj0ocl.jpg",
  },
  {
    id: "wat_02",
    slug: "pregnant-nude",
    category: "watercolors",
    style: "nude",
    year: "2019",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032419/NO_BORDERS_Pregnant_Celine_in_Caesaria._Watercolors_on_cotton_paper_2025-500kb_l7clzr.jpg"
    ),
  },
  {
    id: "wat_03",
    slug: "nude-with-skulls",
    category: "watercolors",
    style: "memento-mori",
    year: "2020",
    tags: ["nude", "memento-mori"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032416/IMG_7751photoshoped_2-2025-500kb_gsfrqk.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1792149740/IMG_7621ph26-500kb_za607p.jpg",
  },
  {
    id: "wat_04",
    slug: "jaffa-landscape",
    category: "watercolors",
    style: "landscape",
    year: "2019",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032415/IMG_4459_no_borders-ph12.25_pswoee.jpg"
    ),
  },
  {
    id: "wat_05",
    slug: "nude-in-darkness",
    category: "watercolors",
    style: "nude",
    year: "2016",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779702837/2020ph.2026-500kb_wcsr6l.jpg"
    ),
  },
  {
    id: "wat_06",
    slug: "occupied-palestine-ruins",
    category: "watercolors",
    style: "landscape",
    year: "2019",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1781945130/Beit_Tsedek_Fortress._Aquarelle_on_Cotton_paper_300_gr.ph2026-500kb_xgphml.jpg"
    ),
  },
  {
    id: "wat_07",
    slug: "caesaria-aqueduct",
    category: "watercolors",
    style: "landscape",
    year: "2019",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1781946347/Caesarea_Aqueduk._Aquarelle_on_cotton_paper_300_gr._2019.ph2026-500kb_ruv4vz.jpg"
    ),
  },
  {
    id: "wat_08",
    slug: "lions-of-basel",
    category: "watercolors",
    style: "landscape",
    year: "2019",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780499087/Basel_lionsph26-500kb_hhp3y1.jpg"
    ),
  },
  {
    id: "wat_09",
    slug: "middle-bridge-in-basel",
    category: "watercolors",
    style: "landscape",
    year: "2019",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1789985281/Middle_bridge_in_Basel-500kb_zwjdrz.jpg"
    ),
  },
  {
    id: "wat_10",
    slug: "basel-spalentor",
    category: "watercolors",
    style: "landscape",
    year: "2019",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1789987959/Basel_Spalentor_2019-PH26-500KB_pqrxq6.jpg"
    ),
  },
  {
    id: "wat_11",
    slug: "view-of-basel-cathedral",
    category: "watercolors",
    style: "landscape",
    year: "2019",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1789988252/Basel_Cathedral-PH2026-500KB_w0ce7b.jpg"
    ),
  },
  {
    id: "wat_12",
    slug: "view-of-jaffa-from-the-sea",
    category: "watercolors",
    style: "landscape",
    year: "2019",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1789989213/jaffa-ph2026-500kb_iz6g87.jpg"
    ),
  },
  {
    id: "wat_13",
    slug: "view-of-st.peter-church-jaffa",
    category: "watercolors",
    style: "landscape",
    year: "2019",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1789990193/jammy-ph2026-500kb_pflfu8.jpg"
    ),
  },
  {
    id: "wat_14",
    slug: "the-pond-of-pettite",
    category: "watercolors",
    style: "landscape",
    year: "2019",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1790000167/IMG_3662-no_borders-ph2026_iedr2w.jpg"
    ),
  },
  {
    id: "wat_15",
    slug: "barfusserplatz-basel",
    category: "watercolors",
    style: "landscape",
    year: "2019",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1790002492/basel-500kb_xmznyi.jpg"
    ),
  },
  {
    id: "wat_16",
    slug: "old-door",
    category: "watercolors",
    style: "landscape",
    year: "2019",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1790004313/neve_tsedek_2019-paint-ph-2026-500kb_xshdyv.jpg"
    ),
  },
  {
    id: "wat_17",
    slug: "sex-in-tel-aviv",
    category: "watercolors",
    style: "nude",
    year: "2020",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1791059265/IMG_7565photoshoped_2025-500kb1_r8yr9d.jpg"
    ),
  },
  {
    id: "wat_18",
    slug: "caesaria-landscape",
    category: "watercolors",
    style: "landscape",
    year: "2018",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1791066249/CesariaPH2026-500KB_dm00sq.jpg"
    ),
  },

  // =========================
  // OTHER WORKS
  // =========================
  {
    id: "oth_01",
    slug: "christ-pontikrator",
    category: "tempera",
    style: "portrait",
    year: "2009",
    tags: ["portrait", "icon"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613730/photoshoped-more_bright-500kb_pcyurk.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032415/IMG_4570500kb_nooq50.jpg",
  },
  {
    id: "oth_02",
    slug: "virgin-and-the-child",
    category: "tempera",
    style: "portrait",
    year: "2009",
    tags: ["portrait", "icon"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779703943/IMGP0914ph2026-500kb_eaxsbn.jpg"
    ),
  },
  {
    id: "oth_03",
    slug: "hermaphroditus-sculpture-marble",
    category: "tempera",
    subcategory: "nude",
    style: "nude",
    year: "2018",
    tags: ["nude", "stone", "icon"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032410/Copy_of_marble_sculpture_of_sleeping_Hermaphroditus_ph12-25_500_kb_mmpzxz.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1781962567/IMG_2655ph2026500kb_htujzm.jpg",
  },
  {
    id: "oth_04",
    slug: "presentation-of-jesus-in-the-temple",
    category: "tempera",
    style: "portrait",
    year: "2007",
    tags: ["portrait", "icon"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032516/smaller2025-Recovered500kb_emgojk.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782286880/IMG_4623_f7dz6v.jpg",
  },
  {
    id: "oth_05",
    slug: "lely-venus-acrylic-on-marble",
    category: "tempera",
    subcategory: "nude",
    year: "2018",
    style: "nude",
    tags: ["nude", "stone", "icon"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032410/Copy_of_marble_sculpture_of_Lely_Venus_2_c._BCE_on_a_piece_of_anchient_Roman_marble_found_in_Caesarea_Israel._Acrylic_on_Marble._2018_ph_1225-500kb_sipdo4.jpg"
    ),
  },
  {
    id: "oth_06",
    slug: "virgin-at-annunciation",
    category: "tempera",
    style: "portrait",
    year: "2006",
    tags: ["portrait", "icon"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032415/IMG_4588ph500kb_neokqj.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782024864/IMG_4592-ph2026-500kb_nhho0g.jpg",
  },
  {
    id: "oth_07",
    slug: "gorgon-medusa",
    category: "tempera",
    style: "stone",
    year: "2018",
    tags: ["stone", "icon"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032412/IMG_2652SMALL500kb_dr9xz5.jpg"
        ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780071445/Copy_of_marble_sculpture_of_Gorgon_Medusa_2_c._BCE._Acrylic_on_Marble._2018500kb_etlsnc.jpg",
  },
  {
    id: "oth_08",
    slug: "angel-of-god",
    category: "tempera",
    style: "stone",
    year: "2007",
    tags: ["stone", "icon"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780429023/IMG_2783testph2026-500kb_t8roul.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782024237/IMG_2800-ph2026-500kb_ve1zk4.jpg",
  },
  {
    id: "oth_09",
    slug: "moses-tempera-icon",
    category: "tempera",
    style: "portrait",
    year: "2008",
    tags: ["portrait", "icon"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780353361/mosesphotoshopeddark2025-500kb_nx0pnu.jpg"
    ),
  },
  {
    id: "oth_10",
    slug: "aged-icon",
    category: "tempera",
    style: "portrait",
    year: "2009-2010",
    tags: ["portrait", "icon", "heritage-antiques"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1792244691/3ph-26_fz4haa.png"
    ),
  },


// =========================
// PSYCHOLOGICAL REALISM 
// =========================
{
  id: "psy_01",
  slug: "mcdonalds-meal",
  category: "oil-paintings",
  style: "psychological-realism",
  year: "2009-2010",
  tags: ["psychological-realism","portrait", "oil"],
  images: makeImageSet(
    "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032418/Mcdonalds_2010._Oil_on_canvas_145_x_191_cm._Ilya_Medvedev.ph01.26-500kb_damqkv.jpg"
  ),
  thumbnail:
    "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032416/IMG_5405-500kb_xeo7dh.jpg",
 
  thumbnail2:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1794780473/IMG_5425ph-2026-500kb_vhnhxl.jpg",
  
},
 
{
  id: "psy_02",
  slug: "cold-world",
  category: "oil-paintings",
  style: "psychological-realism, landscape",
  year: "2010",
  tags: ["psychological-realism","oil"],
  images: makeImageSet(
    "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032409/Cold_World_2011.ph2026-500kb_uzoqft.jpg"
  ),
  thumbnail:
    "https://res.cloudinary.com/dpayqcrg5/image/upload/v1794778932/photoshoped-2026-500kb_mp6lpf.jpg",
  isFeatured: true,
},
{
  id: "psy_03",
  slug: "frindship",
  category: "oil-paintings",
  style: "psychological-realism",
  year: "2010",
  tags: ["psychological-realism","portrait","oil"],
  images: makeImageSet(
    "https://res.cloudinary.com/dpayqcrg5/image/upload/v1792083937/IMG_5474_photoshoped_2025-500kb_c0mv4n.jpg"
  ),
  thumbnail:
    "https://res.cloudinary.com/dpayqcrg5/image/upload/v1794775887/IMG_5476-500kb_ohbtnv.jpg",
  isFeatured: true,
},
{
  id: "psy_04",
  slug: "underground-music",
  category: "oil-paintings",
  style: "psychological-realism",
  year: "2011",
  tags: ["psychological-realism","portrait","oil"],
  images: makeImageSet(
    "https://res.cloudinary.com/dpayqcrg5/image/upload/v1794774876/Talking_about_undergraund_music_2011._Oil_on_canvas_120_x_100_cm_photoshoped_2026-500kb_jc040r.jpg",
  ),
      thumbnail:
    "https://res.cloudinary.com/dpayqcrg5/image/upload/v1794909711/IMG_8456-ph2026-500kb_cinoeu.jpg",
  
},
{
  id: "psy_05",
  slug: "drived-boy",
  category: "oil-paintings",
  style: "psychological-realism",
  year: "2010",
  tags: ["psychological-realism","portrait", "oil", "memento-mori"],
  images: makeImageSet(
    "https://res.cloudinary.com/dpayqcrg5/image/upload/v1794776908/Drived_boy_with_a_machine_gun_in_his_hands._Oil_on_canvas_143_x_193_cm._2010_ph.2026-500kb_mp9ibx.jpg"
  ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1794849304/IMG_5504-ph2026-700kb_fegdqu.jpg",
  
},
{
  id: "psy_06",
  slug: "psychological-realism",
  category: "oil-paintings",
  style: "psychological-realism",
  year: "2010",
  tags: ["psychological-realism","portrait", "oil"],
  images: makeImageSet(
    "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779979449/IMG_5294photoshoped_2026-500kb_sm9hwq.jpg"
  ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1794866436/IMG_5327_myejbr.jpg",
        thumbnail2:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1794867010/IMG_5384-ph2026-500kb_gkjnpx.jpg",
  
},
{
  id: "psy_07",
  slug: "psychological-realism",
  category: "oil-paintings",
  style: "psychological-realism",
  tags: ["psychological-realism","portrait", "oil"],
  images: makeImageSet(
    "https://res.cloudinary.com/dpayqcrg5/image/upload/v1794909719/IMG_9810repaired2025-ph2026-500kb_gegbqi.jpg"
  ), thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1795292532/IMG_9819-photoshoped2026-500kb_ik27pm.jpg",
},
{
  id: "psy_08",
  slug: "breastfeeding",
  category: "oil-paintings",
  style: "psychological-realism",
  year: "2011",
  tags: ["psychological-realism","portrait", "oil"],
  images: makeImageSet(
    "https://res.cloudinary.com/dpayqcrg5/image/upload/v1795161868/IMGP4635_1_photoshoped_big_2025-2026-500kb_h0w8ya.jpg"
  ),
}
];

// ==========================================
// 4. CATEGORIES & STYLES DATA
// ==========================================

export const CATEGORY_COVERS: CategoryCover[] = [
  {
    id: "cat_1",
    slug: "drawings",
    titleKey: "categories.drawings",
    cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1792247035/Dorkas_new_ph_12-26_vk1vxr.jpg",
  },
  {
    id: "cat_2",
    slug: "oil-paintings",
    titleKey: "categories.oil_paintings",
    cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1781963283/IMG_4840-darker_2025_iwfsdy.jpg",
  },
  {
    id: "cat_3",
    slug: "tempera",
    titleKey: "categories.tempera",
    cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032415/IMG_4570500kb_nooq50.jpg",
  },
  {
    id: "cat_4",
    slug: "watercolors",
    titleKey: "categories.watercolors",
    cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613728/IMG_7653ph26-500kb_dn9hk7.jpg",
  },
  {
    id: "cat_5",
    slug: "all-paintings",
    titleKey: "styleCategories.allPaintings",
    cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1783015237/Untitled_Panorama-24-500b_b4z8vu.jpg",
  },
  {
    id: "cat_6",
    slug: "works-by-years",
    titleKey: "styleCategories.worksByYears",
    cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613717/IMGP3286PH26-2-500b_nidce0.jpg",
  },
];

export const STYLE_CATEGORIES: StyleCategory[] = [
  {
    id: "style_portrait",
    slug: "portrait",
    titleKey: "styleCategories.portrait",
    name: "Portrait",
    coverImage: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1791641325/IMG_4285-2ph2026-2-500kb_i00dnd.jpg",
    isUpcoming: false,
  },
  {
    id: "style_nude",
    slug: "nude",
    titleKey: "styleCategories.nude",
    name: "Nude",
    coverImage: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779620844/ph2026kineret-2-500kb_qzscpo.jpg",
    isUpcoming: false,
  },
  {
    id: "style_landscape_still_life",
    slug: "landscape-still-life",
    titleKey: "styleCategories.landscapeStillLife",
    name: "Landscapes & Still Life",
    coverImage: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1791054706/IMG_8563paint-ph2026-500kb_lja2dj.jpg",
    isUpcoming: false,
  },
  {
    id: "style_memento_mori",
    slug: "memento-mori",
    titleKey: "styleCategories.mementoMori",
    name: "Mortality & Memento Mori",
    coverImage: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779781882/detail2021-ph2026_l7zv21.jpg",
    isUpcoming: false,
  },
  {
    id: "style_psychological_realism",
    slug: "psychological-realism",
    titleKey: "styleCategories.psychologicalRealism",
    name: "Psychological Realism",
    coverImage: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1794863514/The_Gym-detail-ph2026-500kb_joz5rd.jpg",
    isUpcoming: false,
  },
  {
    id: "style_heritage",
    slug: "heritage-antiques",
    titleKey: "styleCategories.heritageAntiques",
    name: "Heritage & Antiques",
    coverImage: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780071445/Copy_of_marble_sculpture_of_Gorgon_Medusa_2_c._BCE._Acrylic_on_Marble._2018500kb_etlsnc.jpg",
    isUpcoming: false,
  },
  
];