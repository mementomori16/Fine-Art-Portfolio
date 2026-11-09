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

export function getPaintingsByStyle(styleIdOrSlug: string): Painting[] {
  const query = styleIdOrSlug.toLowerCase().trim();

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
    tags: ["memento-mori","vanitas", "still-life"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780939340/1ph2026_zwllbh.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779781725/detal-2021-ph2026_eu8ac6.jpg",
    thumbnail2:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1791055741/IMG_3357-500kb_rcpa9f.jpg",
  },
  {
    id: "oil_03",
    slug: "memento-mori",
    category: "oil-paintings",
    style: "memento-mori",
    tags: ["memento-mori"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613732/IMG_8469ph2026-500kb_fipv2h.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613717/The_best_photo_Autopsia_of_a_commited_suicide_girl%D0%B7%D1%8026500kb_bup3cx.jpg",
  },
  {
    id: "oil_04",
    slug: "nude",
    category: "oil-paintings",
    subcategory: "nude",
    style: "nude",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032416/IMG_4906_photoshoped_12.2025-500kb_xdkpzo.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782937567/good_Alla_2026_photoshop-500kb_q5prhs.jpg",
  },
  {
    id: "oil_06",
    slug: "nude",
    category: "oil-paintings",
    subcategory: "nude",
    style: "nude",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1770367743/photoshoped_2025_Royal_Gore._Oil_on_canvas_111_x_200_cm._2008._500kb_e9z43l.jpg"
    ),
  },
  {
    id: "oil_07",
    slug: "memento-mori",
    category: "oil-paintings",
    style: "memento-mori",
    tags: ["memento-mori"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613731/varnished-and-photoshoped-small-2-500kb_jgndqr.jpg"
    ),
  },
  {
    id: "oil_08",
    slug: "portrait",
    category: "oil-paintings",
    style: "portrait",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613701/IMG_4550ph26-500kb_lqn3zn.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1781963283/IMG_4840-darker_2025_iwfsdy.jpg",
  },
  {
    id: "oil_09",
    slug: "memento-mori",
    category: "oil-paintings",
    style: "memento-mori",
    tags: ["memento-mori"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1783015237/Untitled_Panorama-24-500b_b4z8vu.jpg"
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
    tags: ["memento-mori"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779784466/Portraite_of_drowned_woman_2018500KB_dacbwg.jpg"
    ),
  },
  {
    id: "oil_12",
    slug: "study",
    category: "oil-paintings",
    subcategory: "nude",
    style: "nude",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613717/IMGP3286PH26-2-500b_nidce0.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782300692/IMGP3308-Recovered_r5am4h.jpg",
  },
  {
    id: "oil_13",
    slug: "memento-mori",
    category: "oil-paintings",
    style: "memento-mori",
    tags: ["memento-mori"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782914928/Photoshoped-panorama2026-5-500kb_x3gypx.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782930873/DSC_0973ph3-2026-500kb_lqj6pp.jpg",
    thumbnail2:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782932053/IMG_4880photoshoped_2026-2500kb_mxytkz.jpg",
  },
  {
    id: "oil_14",
    slug: "portrait",
    category: "oil-paintings",
    style: "portrait",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1791048507/IMG_4285-2ph2026-500kb_gxegvt.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1791053467/IMG_4293-2-ph2026-500kb_qygshe.jpg",
  },
  {
    id: "oil_15",
    slug: "landscape",
    category: "oil-paintings",
    style: "landscape",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1791054706/IMG_8563paint-ph2026-500kb_lja2dj.jpg"
    ),
  },

  // =========================
  // DRAWINGS
  // =========================
  {
    id: "drw_01",
    slug: "drawing-nude-1",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782219354/IMG_2668_photoshoped_2026-2-500kb_q7vlr1.jpg"
    ),
  },
  {
    id: "drw_02",
    slug: "drawing-portrait-1",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
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
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032418/katya_photoshop_2025-ph500kb_aokpyv.jpg"
    ),
  },
  {
    id: "drw_05",
    slug: "portrait-sketch-1",
    category: "drawings",
    subcategory: "general",
    style: "portrait",
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
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032418/Joe_Pesci_small-500kb_d6ngvt.jpg"
    ),
  },
  {
    id: "drw_08",
    slug: "portrait-sketch-2026",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1777925635/IMG_4691-ph2026-500kb_iq9ive.jpg"
    ),
  },
  {
    id: "drw_09",
    slug: "animal-drawing-study",
    category: "drawings",
    subcategory: "general",
    style: "animals",
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
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032413/IMG_3012closeup500kb_xo89iy.jpg"
    ),
  },
  {
    id: "drw_11",
    slug: "landscape-drawing-1",
    category: "drawings",
    subcategory: "general",
    style: "landscape",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032411/IMG_2825ph1225-500kb_szirsi.jpg"
    ),
  },
  {
    id: "drw_12",
    slug: "portrait-study-2016",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
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
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780058094/Vincent.2026photoshoped-500kb_ueocvk.jpg"
    ),
  },
  {
    id: "drw_15",
    slug: "nude-figure-drawing",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
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
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780059850/dorna_scanned-ph2026-500kb_kmobkt.jpg"
    ),
  },
  {
    id: "drw_17",
    slug: "nude-drawing-study-2724",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780060152/IMG_2724-500kb_dwm95t.jpg"
    ),
  },
  {
    id: "drw_18",
    slug: "portrait-sketch-3009",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780063098/IMG_3009ph2026_inxb8h.jpg"
    ),
  },
  {
    id: "drw_19",
    slug: "lena-scanned-nude-drawing",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780066162/Lena_scannedph26-500kb_lg9xnu.jpg"
    ),
  },
  {
    id: "drw_20",
    slug: "animal-detail-drawing",
    category: "drawings",
    subcategory: "general",
    style: "animals",
    tags: ["animals"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780066797/scanned_small._detail-ph2026-500kb_mjxh6o.jpg"
    ),
  },
  {
    id: "drw_21",
    slug: "nude-drawing-study-3445",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
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
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780312012/Annushka-500kb_exb2gc.jpg"
    ),
  },
  {
    id: "drw_23",
    slug: "anatomical-nude-roger",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780313320/Penis_of_Roger-500kb_dhjkvd.jpg"
    ),
  },
  {
    id: "drw_24",
    slug: "portrait-drawing-study-2025",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780346883/PHOTOSHOPED_2025-500kb_v6fxul.jpg"
    ),
  },
  {
    id: "drw_25",
    slug: "portrait-study-2982",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780353350/IMG_2982ph2026-500kb_pvxpu0.jpg"
    ),
  },
  {
    id: "drw_26",
    slug: "anatomical-nude-drawing-8450",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780669428/IMG_8450-500kb_gnmzdx.jpg"
    ),
  },
  {
    id: "drw_27",
    slug: "anatomical-nude-drawing-3441",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780682625/IMG_3441-500kb_rwqgsh.jpg"
    ),
  },
  {
    id: "drw_28",
    slug: "nude-drawing-study-3435",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
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
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780682883/Lily_18.06.2024-500kb_gisley.jpg"
    ),
  },
  {
    id: "drw_30",
    slug: "portrait-sketch-3246",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780682876/IMG_3246-500kb_m9lhwp.jpg"
    ),
  },
  {
    id: "drw_31",
    slug: "animal-drawing-study-3271",
    category: "drawings",
    subcategory: "general",
    style: "animals",
    tags: ["animals"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032414/IMG_3271ph12.2025500kb_gjyybh.jpg"
    ),
  },
  {
    id: "drw_32",
    slug: "portrait",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782219702/Groben._Oil_Pastels_on_Paper-500kb_xpitig.jpg"
    ),
  },
  {
    id: "drw_33",
    slug: "nude",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782220926/Katya-500kb_nuiuux.jpg"
    ),
  },
  {
    id: "drw_34",
    slug: "nude",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782236992/IMG_2695ph2026-500kb_b6jdul.jpg"
    ),
  },
  {
    id: "drw_35",
    slug: "nude",
    category: "drawings",
    subcategory: "nude",
    style: "nude",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782287753/birsfelden_small_rroyxv.jpg"
    ),
  },
  {
    id: "drw_36",
    slug: "portrait",
    category: "drawings",
    subcategory: "portrait",
    style: "portrait",
    tags: ["portrait"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782287975/scanned_alexandra_or_anna_photoshoped_2026-500kb_dluh1j.jpg"
    ),
  },
  {
    id: "drw_37",
    slug: "landscape-still-life",
    category: "drawings",
    subcategory: "general",
    style: "landscape",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782289675/IMG_3243_hs1ak8.jpg"
    ),
  },
  {
    id: "drw_38",
    slug: "landscape-still-life",
    category: "drawings",
    subcategory: "general",
    style: "landscape",
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
    tags: ["portrait, memento-mori"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1792150132/IMG_3260-500kb_olvdjk.jpg"
    ),
  },

  // =========================
  // WATERCOLORS
  // =========================
  {
    id: "wat_01",
    slug: "memento-mori",
    category: "watercolors",
    style: "memento-mori",
    tags: ["nude", "memento-mori"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782023532/No_bordersph2026-500kb_dhhteh.jpg"
    ),
  },
  {
    id: "wat_02",
    slug: "nude",
    category: "watercolors",
    style: "nude",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032419/NO_BORDERS_Pregnant_Celine_in_Caesaria._Watercolors_on_cotton_paper_2025-500kb_l7clzr.jpg"
    ),
  },
  {
    id: "wat_03",
    slug: "memento-mori",
    category: "watercolors",
    style: "memento-mori",
    tags: ["nude", "memento-mori"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032416/IMG_7751photoshoped_2-2025-500kb_gsfrqk.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1792149740/IMG_7621ph26-500kb_za607p.jpg",
  },
  {
    id: "wat_04",
    slug: "landscape-still-life",
    category: "watercolors",
    style: "landscape",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032415/IMG_4459_no_borders-ph12.25_pswoee.jpg"
    ),
  },
  {
    id: "wat_05",
    slug: "nude-watercolor-study-2020",
    category: "watercolors",
    style: "nude",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779702837/2020ph.2026-500kb_wcsr6l.jpg"
    ),
  },
  {
    id: "wat_06",
    slug: "landscape-still-life",
    category: "watercolors",
    style: "landscape",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1781945130/Beit_Tsedek_Fortress._Aquarelle_on_Cotton_paper_300_gr.ph2026-500kb_xgphml.jpg"
    ),
  },
  {
    id: "wat_07",
    slug: "landscape-still-life",
    category: "watercolors",
    style: "landscape",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1781946347/Caesarea_Aqueduk._Aquarelle_on_cotton_paper_300_gr._2019.ph2026-500kb_ruv4vz.jpg"
    ),
  },
  {
    id: "wat_08",
    slug: "landscape-still-life",
    category: "watercolors",
    style: "landscape",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780499087/Basel_lionsph26-500kb_hhp3y1.jpg"
    ),
  },
  {
    id: "wat_09",
    slug: "landscape-still-life",
    category: "watercolors",
    style: "landscape",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1789985281/Middle_bridge_in_Basel-500kb_zwjdrz.jpg"
    ),
  },
  {
    id: "wat_10",
    slug: "landscape-still-life",
    category: "watercolors",
    style: "landscape",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1789987959/Basel_Spalentor_2019-PH26-500KB_pqrxq6.jpg"
    ),
  },
  {
    id: "wat_11",
    slug: "landscape-still-life",
    category: "watercolors",
    style: "landscape",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1789988252/Basel_Cathedral-PH2026-500KB_w0ce7b.jpg"
    ),
  },
  {
    id: "wat_12",
    slug: "landscape-still-life",
    category: "watercolors",
    style: "landscape",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1789989213/jaffa-ph2026-500kb_iz6g87.jpg"
    ),
  },
  {
    id: "wat_13",
    slug: "landscape-still-life",
    category: "watercolors",
    style: "landscape",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1789990193/jammy-ph2026-500kb_pflfu8.jpg"
    ),
  },
  {
    id: "wat_14",
    slug: "landscape-still-life",
    category: "watercolors",
    style: "landscape",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1790000167/IMG_3662-no_borders-ph2026_iedr2w.jpg"
    ),
  },
  {
    id: "wat_15",
    slug: "landscape-still-life",
    category: "watercolors",
    style: "landscape",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1790002492/basel-500kb_xmznyi.jpg"
    ),
  },
  {
    id: "wat_16",
    slug: "landscape-still-life",
    category: "watercolors",
    style: "landscape",
    tags: ["landscape"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1790004313/neve_tsedek_2019-paint-ph-2026-500kb_xshdyv.jpg"
    ),
  },
  {
    id: "wat_17",
    slug: "nude-watercolor-study-7565",
    category: "watercolors",
    style: "nude",
    tags: ["nude"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1791059265/IMG_7565photoshoped_2025-500kb1_r8yr9d.jpg"
    ),
  },
  {
    id: "wat_18",
    slug: "landscape-still-life",
    category: "watercolors",
    style: "landscape",
    tags: ["landscape", "stone"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1791066249/CesariaPH2026-500KB_dm00sq.jpg"
    ),
  },

  // =========================
  // OTHER WORKS
  // =========================
  {
    id: "oth_01",
    slug: "icon-portrait-study-1",
    category: "tempera",
    style: "portrait",
    tags: ["portrait", "icon"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613730/photoshoped-more_bright-500kb_pcyurk.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032415/IMG_4570500kb_nooq50.jpg",
  },
  {
    id: "oth_02",
    slug: "tempera-icon-portrait",
    category: "tempera",
    style: "portrait",
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
    tags: ["nude", "stone", "icon"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032410/Copy_of_marble_sculpture_of_sleeping_Hermaphroditus_ph12-25_500_kb_mmpzxz.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1781962567/IMG_2655ph2026500kb_htujzm.jpg",
  },
  {
    id: "oth_04",
    slug: "icon-portrait-study-2",
    category: "tempera",
    style: "portrait",
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
    style: "nude",
    tags: ["nude", "stone", "icon"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032410/Copy_of_marble_sculpture_of_Lely_Venus_2_c._BCE_on_a_piece_of_anchient_Roman_marble_found_in_Caesarea_Israel._Acrylic_on_Marble._2018_ph_1225-500kb_sipdo4.jpg"
    ),
  },
  {
    id: "oth_06",
    slug: "icon-portrait-study-3",
    category: "tempera",
    style: "portrait",
    tags: ["portrait", "icon"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032415/IMG_4588ph500kb_neokqj.jpg"
    ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782024864/IMG_4592-ph2026-500kb_nhho0g.jpg",
  },
  {
    id: "oth_07",
    slug: "stone-painting-icon-1",
    category: "tempera",
    style: "stone",
    tags: ["stone", "icon"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032412/IMG_2652SMALL500kb_dr9xz5.jpg"
        ),
    thumbnail:
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780071445/Copy_of_marble_sculpture_of_Gorgon_Medusa_2_c._BCE._Acrylic_on_Marble._2018500kb_etlsnc.jpg",
  },
  {
    id: "oth_08",
    slug: "stone-painting-icon-2",
    category: "tempera",
    style: "stone",
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
    tags: ["portrait", "icon"],
    images: makeImageSet(
      "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780353361/mosesphotoshopeddark2025-500kb_nx0pnu.jpg"
    ),
  },
  {
    id: "oth_10",
    slug: "tempera-icon",
    category: "tempera",
    style: "portrait",
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
  slug: "psychological-realism",
  category: "oil-paintings",
  style: "psychological-realism",
  tags: ["psychological-realism","portrait", "oil"],
  images: makeImageSet(
    "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032418/Mcdonalds_2010._Oil_on_canvas_145_x_191_cm._Ilya_Medvedev.ph01.26-500kb_damqkv.jpg"
  ),
  thumbnail:
    "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032416/IMG_5405-500kb_xeo7dh.jpg",
  isFeatured: true,
},
{
  id: "psy_02",
  slug: "expressive-figure-study",
  category: "oil-paintings",
  style: "psychological-realism, landscape",
  tags: ["psychological-realism",],
  images: makeImageSet(
    "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032409/Cold_World_2011.ph2026-500kb_uzoqft.jpg"
  ),
},
{
  id: "psy_03",
  slug: "psychological-portrait-study-2",
  category: "oil-paintings",
  style: "psychological-realism",
  tags: ["psychological-realism","portrait"],
  images: makeImageSet(
    "https://res.cloudinary.com/dpayqcrg5/image/upload/v1792083937/IMG_5474_photoshoped_2025-500kb_c0mv4n.jpg"
  )
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
];

export const STYLE_CATEGORIES: StyleCategory[] = [
  {
    id: "style_portrait",
    slug: "portrait",
    titleKey: "styleCategories.portrait",
    name: "Portrait",
    coverImage: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1791053467/IMG_4293-2-ph2026-500kb_qygshe.jpg",
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
    coverImage: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779979449/IMG_5294photoshoped_2026-500kb_sm9hwq.jpg",
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