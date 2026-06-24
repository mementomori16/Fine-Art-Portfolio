import { buildResponsiveImage } from "../../src/utils/paintingsAdapter";

export interface PaintingImageSet {
    small: string;
    medium: string;
    large: string;
}

export interface Painting {
    id: string; // Used directly to resolve translations dynamically
    slug: string;
    category: 'oil-paintings' | 'drawings' | 'watercolors' | 'other-works';
    subcategory?: 'nude' | 'portrait' | 'general';
    images: PaintingImageSet;
    thumbnail?: string;
    thumbnail2?: string;
    thumbnail3?: string;
    isFeatured?: boolean;
}

export interface CategoryCover {
    id: string;
    slug: 'oil-paintings' | 'drawings' | 'watercolors' | 'other-works';
    titleKey: string;
    cloudinaryId: string;
}

const makeImageSet = (baseUrl: string): PaintingImageSet => {
    return buildResponsiveImage(baseUrl.trim());
};

export const PAINTINGS: Painting[] = [
    // =========================
    // OIL PAINTINGS
    // =========================
    {
        id: "oil_02",
        slug: "memento-mori",
        category: "oil-paintings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1782237007/ilya1ph2026-500kb_jwwzsj.jpg"),
        thumbnail: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779781725/detal-2021-ph2026_eu8ac6.jpg" 
    },
    {
        id: "oil_03",
        slug: "nude, memento-mori",
        category: "oil-paintings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613732/IMG_8469ph2026-500kb_fipv2h.jpg"),
        thumbnail: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613717/The_best_photo_Autopsia_of_a_commited_suicide_girl%D0%B7%D1%8026500kb_bup3cx.jpg" 

    },
    {
        id: "oil_04",
        slug: "nude",
        category: "oil-paintings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032416/IMG_4906_photoshoped_12.2025-500kb_xdkpzo.jpg")
    },
    {
        id: "oil_06",
        slug: "nude",
        category: "oil-paintings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1770367743/photoshoped_2025_Royal_Gore._Oil_on_canvas_111_x_200_cm._2008._500kb_e9z43l.jpg"),

    },
    {
        id: "oil_07",
        slug: "memento-mori",
        category: "oil-paintings",
        subcategory: "nude",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613731/varnished-and-photoshoped-small-2-500kb_jgndqr.jpg")
    },
    {
        id: "oil_08",
        slug: "portrait",
        category: "oil-paintings",
        subcategory: "nude",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613701/IMG_4550ph26-500kb_lqn3zn.jpg"),
        thumbnail: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1781963283/IMG_4840-darker_2025_iwfsdy.jpg" 

    },
    {
        id: "oil_09",
        slug: "memento-mori",
        category: "oil-paintings",
        subcategory: "nude",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779792941/IMG_0354-2026-3500kb_yixqtl.jpg"),
        thumbnail: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780072416/ed500kb_eb2ppw.jpg",
        thumbnail2: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782294108/closeup2018-500kb_ihzwdb.jpg",

    },
    {
        id: "oil_11",
        slug: "memento-mori",
        category: "oil-paintings",
        subcategory: "nude",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779784466/Portraite_of_drowned_woman_2018500KB_dacbwg.jpg")
    },
    {
        id: "oil_12",
        slug: "nude",
        category: "oil-paintings",
        subcategory: "nude",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613717/IMGP3286PH26-2-500b_nidce0.jpg")
    },

    // ==========================================
    // 2. DRAWINGS CATEGORY
    // ==========================================
    {
        id: "drw_01",
        slug: "nude",
        category: "drawings",
        subcategory: "nude",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1782219354/IMG_2668_photoshoped_2026-2-500kb_q7vlr1.jpg")
    },
    {
        id: "drw_02",
        slug: "portrait",
        category: "drawings",
        subcategory: "portrait",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032516/SKM_C45818070115150_0002small-500kb_kuaces.jpg")
    },
    {
        id: "drw_03",
        slug: "animals",
        category: "drawings",
        subcategory: "general",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032420/Parrot._Scanned_and_photoshoped_smaller2500kb_b6vay5.jpg")
    },
    {
        id: "drw_04",
        slug: "nude",
        category: "drawings",
        subcategory: "nude",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032418/katya_photoshop_2025-ph500kb_aokpyv.jpg")
    },
    {
        id: "drw_05",
        slug: "portrait",
        category: "drawings",
        subcategory: "general",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032414/IMG_3232-500kb_lifcup.jpg")
    },
    {
        id: "drw_06",
        slug: "portrait",
        category: "drawings",
        subcategory: "portrait",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032411/Dorkas_new_ph_12-25-500kb_nua9wb.jpg")
    },
    {
        id: "drw_07",
        slug: "portrait",
        category: "drawings",
        subcategory: "portrait",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032418/Joe_Pesci_small-500kb_d6ngvt.jpg")
    },
    {
        id: "drw_08",
        slug: "portrait",
        category: "drawings",
        subcategory: "portrait",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1777925635/IMG_4691-ph2026-500kb_iq9ive.jpg")
    },
    {
        id: "drw_09",
        slug: "animals",
        category: "drawings",
        subcategory: "general",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032471/photoshoped2025final500kb_n1aj9r.jpg")
    },
    {
        id: "drw_10",
        slug: "nude",
        category: "drawings",
        subcategory: "nude",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032413/IMG_3012closeup500kb_xo89iy.jpg")
    },
    {
        id: "drw_11",
        slug: "landsacape",
        category: "drawings",
        subcategory: "general",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032411/IMG_2825ph1225-500kb_szirsi.jpg")
    },
    {
        id: "drw_12",
        slug: "portrait",
        category: "drawings",
        subcategory: "portrait",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032411/IMG_20161119_202342-500kb_wsdt7u.jpg")
    },
    {
        id: "drw_13",
        slug: "portrait",
        category: "drawings",
        subcategory: "portrait",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780058220/Anna_Palestine_22.08.2026-500kb_qyfbpj.jpg")        
    },
    {
        id: "drw_14",
        slug: "portrait",
        category: "drawings",
        subcategory: "portrait",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780058094/Vincent.2026photoshoped-500kb_ueocvk.jpg")
    },
    {
        id: "drw_15",
        slug: "nude",
        category: "drawings",
        subcategory: "nude",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613765/IMG_3256ph2026-500kb_hfrcvq.jpg")
    },
    {
        id: "drw_16",
        slug: "portrait",
        category: "drawings",
        subcategory: "portrait",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780059850/dorna_scanned-ph2026-500kb_kmobkt.jpg")
    },
    {
        id: "drw_17",
        slug: "nude",
        category: "drawings",
        subcategory: "nude",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780060152/IMG_2724-500kb_dwm95t.jpg")
    },
    {
        id: "drw_18",
        slug: "portrait",
        category: "drawings",
        subcategory: "portrait",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780063098/IMG_3009ph2026_inxb8h.jpg")
    },
    {
        id: "drw_19",
        slug: "nude",
        category: "drawings",
        subcategory: "nude",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780066162/Lena_scannedph26-500kb_lg9xnu.jpg")
    },
    {
        id: "drw_20",
        slug: "animals",
        category: "drawings",
        subcategory: "general",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780066797/scanned_small._detail-ph2026-500kb_mjxh6o.jpg")
    },
    {
        id: "drw_21",
        slug: "nude",
        category: "drawings",
        subcategory: "nude",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780067263/IMG_3445500kb_yti8g7.jpg") 
    },
    {
        id: "drw_22",
        slug: "nude",
        category: "drawings",
        subcategory: "nude",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780312012/Annushka-500kb_exb2gc.jpg") 
    },
    {
        id: "drw_23",
        slug: "nude-penis",
        category: "drawings",
        subcategory: "nude",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780313320/Penis_of_Roger-500kb_dhjkvd.jpg") 
    },
    {
        id: "drw_24",
        slug: "portrait",
        category: "drawings",
        subcategory: "portrait",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780346883/PHOTOSHOPED_2025-500kb_v6fxul.jpg") 
    },
    {
        id: "drw_25",
        slug: "portrait",
        category: "drawings",
        subcategory: "portrait",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780353350/IMG_2982ph2026-500kb_pvxpu0.jpg") 
    },
    {
        id: "drw_26",
        slug: "nude-penis",
        category: "drawings",
        subcategory: "nude",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780669428/IMG_8450-500kb_gnmzdx.jpg") 
    },
    {
        id: "drw_27",
        slug: "nude-penis",
        category: "drawings",
        subcategory: "nude",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780682625/IMG_3441-500kb_rwqgsh.jpg") 
    },
    {
        id: "drw_28",
        slug: "nude",
        category: "drawings",
        subcategory: "nude",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780682625/IMG_3435-500kb_vm4wtr.jpg") 
    },
    {
        id: "drw_29",
        slug: "portrait",
        category: "drawings",
        subcategory: "portrait",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780682883/Lily_18.06.2024-500kb_gisley.jpg") 
    },
    {
        id: "drw_30",
        slug: "portrait",
        category: "drawings",
        subcategory: "portrait",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780682876/IMG_3246-500kb_m9lhwp.jpg") 
    },
    {
        id: "drw_31",
        slug: "animals",
        category: "drawings",
        subcategory: "general",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032414/IMG_3271ph12.2025500kb_gjyybh.jpg") 
    },
    {
        id: "drw_32",
        slug: "portrait",
        category: "drawings",
        subcategory: "portrait",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1782219702/Groben._Oil_Pastels_on_Paper-500kb_xpitig.jpg") 
    },
    {
        id: "drw_33",
        slug: "nude",
        category: "drawings",
        subcategory: "nude",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1782220926/Katya-500kb_nuiuux.jpg") 
    },
    {
        id: "drw_34",
        slug: "nude-penis",
        category: "drawings",
        subcategory: "nude",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1782236992/IMG_2695ph2026-500kb_b6jdul.jpg") 
    },
    {
        id: "drw_35",
        slug: "nude",
        category: "drawings",
        subcategory: "nude",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1782287753/birsfelden_small_rroyxv.jpg") 
    },
    {
        id: "drw_36",
        slug: "portrait",
        category: "drawings",
        subcategory: "portrait",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1782287975/scanned_alexandra_or_anna_photoshoped_2026-500kb_dluh1j.jpg") 
    },
    {
        id: "drw_37",
        slug: "landscape",
        category: "drawings",
        subcategory: "general",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1782289675/IMG_3243_hs1ak8.jpg") 
    },

    // ==========================================
    // 3. WATERCOLORS CATEGORY
    // ==========================================
    {
        id: "wat_01",
        slug: "nude, memento-mori",
        category: "watercolors",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1782023532/No_bordersph2026-500kb_dhhteh.jpg")
    },
    {
        id: "wat_02",
        slug: "nude",
        category: "watercolors",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032419/NO_BORDERS_Pregnant_Celine_in_Caesaria._Watercolors_on_cotton_paper_2025-500kb_l7clzr.jpg")
    },
    {
        id: "wat_03",
        slug: "nude, memento-mori",
        category: "watercolors",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032416/IMG_7751photoshoped_2-2025-500kb_gsfrqk.jpg")
    },
    {
        id: "wat_04",
        slug: "landscape",
        category: "watercolors",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032415/IMG_4459_no_borders-ph12.25_pswoee.jpg")
    },
    {
        id: "wat_05",
        slug: "nude",
        category: "watercolors",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779702837/2020ph.2026-500kb_wcsr6l.jpg")
    },
    {
        id: "wat_09",
        slug: "landscape",
        category: "watercolors",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1781945130/Beit_Tsedek_Fortress._Aquarelle_on_Cotton_paper_300_gr.ph2026-500kb_xgphml.jpg") 
    },
     {
        id: "wat_10",
        slug: "landscape",
        category: "watercolors",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1781946347/Caesarea_Aqueduk._Aquarelle_on_cotton_paper_300_gr._2019.ph2026-500kb_ruv4vz.jpg") 
    },

    // ==========================================
    // 4. OTHER WORKS CATEGORY
    // ==========================================
    {
        id: "oth_01",
        slug: "portrait, icon",
        category: "other-works",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613730/photoshoped-more_bright-500kb_pcyurk.jpg"),
        thumbnail: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032415/IMG_4570500kb_nooq50.jpg" 

    },
    {
        id: "oth_02",
        slug: "portrait, icon",
        category: "other-works",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779703943/IMGP0914ph2026-500kb_eaxsbn.jpg")
    },
    {
        id: "oth_03",
        slug: "nude, stone, icon",
        category: "other-works",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032410/Copy_of_marble_sculpture_of_sleeping_Hermaphroditus_ph12-25_500_kb_mmpzxz.jpg"),
        thumbnail: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1781962567/IMG_2655ph2026500kb_htujzm.jpg" 

    },
    {
        id: "oth_04",
        slug: "portrait, icon",
        category: "other-works",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032516/smaller2025-Recovered500kb_emgojk.jpg"),
        thumbnail: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782286880/IMG_4623_f7dz6v.jpg" 

    },
    {
        id: "oth_05",
        slug: "nude, stone, icon",
        category: "other-works",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032410/Copy_of_marble_sculpture_of_Lely_Venus_2_c._BCE_on_a_piece_of_anchient_Roman_marble_found_in_Caesarea_Israel._Acrylic_on_Marble._2018_ph_1225-500kb_sipdo4.jpg")
    },
    {
        id: "oth_06",
        slug: "portrait, icon",
        category: "other-works",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032415/IMG_4588ph500kb_neokqj.jpg"),
        thumbnail: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782024864/IMG_4592-ph2026-500kb_nhho0g.jpg" 
    },
    {
        id: "oth_07",
        slug: "stone, icon",
        category: "other-works",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032412/IMG_2652SMALL500kb_dr9xz5.jpg")
        

    },
    {
        id: "oth_08",
        slug: "stone, icon",
        category: "other-works",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780429023/IMG_2783testph2026-500kb_t8roul.jpg"),
        thumbnail: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1782024237/IMG_2800-ph2026-500kb_ve1zk4.jpg" 

    },
    {
        id: "oth_09",
        slug: "portrait, icon",
        category: "other-works",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780353361/mosesphotoshopeddark2025-500kb_nx0pnu.jpg")
    }
];

export const CATEGORY_COVERS: CategoryCover[] = [
   
    { 
        id: "cat_2", 
        slug: "drawings", 
        titleKey: "categories.drawings", 
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1781512656/IMG_32273closeup-500kb-2_tbymvy.jpg" 
    },
     { 
        id: "cat_1", 
        slug: "oil-paintings", 
        titleKey: "categories.oil_paintings", 
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779781882/detail2021-ph2026_l7zv21.jpg" 
    },
    { 
        id: "cat_4", 
        slug: "other-works", 
        titleKey: "categories.other_works", 
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779703943/IMGP0914ph2026-500kb_eaxsbn.jpg" 
    },
    { 
        id: "cat_3", 
        slug: "watercolors", 
        titleKey: "categories.watercolors", 
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779956890/No_borders-croped%D0%B7%D1%802026-500kb_hjhxo6.jpg" 
    },
    
];