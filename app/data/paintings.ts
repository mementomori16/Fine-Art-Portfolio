export interface PaintingImageSet {
    small: string;
    medium: string;
    large: string;
}

export interface Painting {
    id: string;
    titleKey: string;
    slug: string;
    category: 'oil-paintings' | 'drawings' | 'watercolors' | 'other-works';
    images: PaintingImageSet;
    isFeatured?: boolean;
}

export interface CategoryCover {
    id: string;
    slug: 'oil-paintings' | 'drawings' | 'watercolors' | 'other-works';
    titleKey: string;
    cloudinaryId: string;
}

/**
 * Creates responsive image set from a single Cloudinary base image.
 * IMPORTANT: this assumes your filenames already contain "-500kb" style marker.
 */
const makeImageSet = (baseUrl: string): PaintingImageSet => ({
    small: baseUrl.replace('500kb', '120kb'),
    medium: baseUrl.replace('500kb', '250kb'),
    large: baseUrl
});

export const PAINTINGS: Painting[] = [
    // =========================
    // OIL PAINTINGS
    // =========================
    
    {
        id: "oil_02",
        titleKey: "paintings.oil.item2.title",
        slug: "crimson-serenade",
        category: "oil-paintings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779782494/Vanitas_ph2026500KB2_gyxk8l.jpg")
    },
    {
        id: "oil_03",
        titleKey: "paintings.oil.item3.title",
        slug: "whispering-meadows",
        category: "oil-paintings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779780148/IMG_8469ph2026-500kb16-9_xdohca.jpg")
    },
    {
        id: "oil_04",
        titleKey: "paintings.oil.item4.title",
        slug: "ethereal-dusk",
        category: "oil-paintings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032416/IMG_4906_photoshoped_12.2025-500kb_xdkpzo.jpg")
    },
    
    {
        id: "oil_06",
        titleKey: "paintings.oil.item6.title",
        slug: "ethereal-dusk",
        category: "oil-paintings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1770367743/photoshoped_2025_Royal_Gore._Oil_on_canvas_111_x_200_cm._2008._500kb_e9z43l.jpg")
    },
    {
        id: "oil_07",
        titleKey: "paintings.oil.item7.title",
        slug: "ethereal-dusk",
        category: "oil-paintings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613731/varnished-and-photoshoped-small-2-500kb_jgndqr.jpg")
    },
    {
        id: "oil_08",
        titleKey: "paintings.oil.item8.title",
        slug: "ethereal-dusk",
        category: "oil-paintings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613701/IMG_4550ph26-500kb_lqn3zn.jpg")
    },
    {
        id: "oil_09",
        titleKey: "paintings.oil.item9.title",
        slug: "ethereal-dusk",
        category: "oil-paintings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779702849/ph2026edgein-500kb_cdva8b.jpg")
    },
    
    {
        id: "oil_11",
        titleKey: "paintings.oil.item11.title",
        slug: "ethereal-dusk",
        category: "oil-paintings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779784466/Portraite_of_drowned_woman_2018500KB_dacbwg.jpg")
    },
    {
        id: "oil_12",
        titleKey: "paintings.oil.item12.title",
        slug: "ethereal-dusk",
        category: "oil-paintings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779785075/IMGP3286PH26-3-500b_hfmhx2.jpg")
    },

    // ==========================================
    // 2. DRAWINGS CATEGORY (10 Items)
    // ==========================================
    {
        id: "drw_01",
        titleKey: "paintings.drawings.item1.title",
        slug: "urban-echo",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032413/IMG_32273closeup-500kb_he3bkp.jpg")
    },
    {
        id: "drw_02",
        titleKey: "paintings.drawings.item2.title",
        slug: "shadowed-profile",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032516/SKM_C45818070115150_0002small-500kb_kuaces.jpg")
    },
    {
        id: "drw_03",
        titleKey: "paintings.drawings.item3.title",
        slug: "silent-gaze",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032420/Parrot._Scanned_and_photoshoped_smaller2500kb_b6vay5.jpg")
    },
    {
        id: "drw_04",
        titleKey: "paintings.drawings.item4.title",
        slug: "lines-of-time",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032418/katya_photoshop_2025-ph500kb_aokpyv.jpg")
    },
    {
        id: "drw_05",
        titleKey: "paintings.drawings.item5.title",
        slug: "architectural-study",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032414/IMG_3232-500kb_lifcup.jpg")
    },
    {
        id: "drw_06",
        titleKey: "paintings.drawings.item6.title",
        slug: "gestural-anatomy",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032411/Dorkas_new_ph_12-25-500kb_nua9wb.jpg")
    },
    {
        id: "drw_07",
        titleKey: "paintings.drawings.item7.title",
        slug: "contour-landscapes",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032418/Joe_Pesci_small-500kb_d6ngvt.jpg")
    },
    {
        id: "drw_08",
        titleKey: "paintings.drawings.item8.title",
        slug: "nocturnal-sketch",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1777925635/IMG_4691-ph2026-500kb_iq9ive.jpg")
    },
    {
        id: "drw_09",
        titleKey: "paintings.drawings.item9.title",
        slug: "charcoal-depths",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032471/photoshoped2025final500kb_n1aj9r.jpg")
    },
    {
        id: "drw_10",
        titleKey: "paintings.drawings.item10.title",
        slug: "monochromatic-flow",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032413/IMG_3012closeup500kb_xo89iy.jpg")
    },
     {
        id: "drw_11",
        titleKey: "paintings.drawings.item11.title",
        slug: "charcoal-depths",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032411/IMG_2825ph1225-500kb_szirsi.jpg")
    },
    {
        id: "drw_12",
        titleKey: "paintings.drawings.item12.title",
        slug: "monochromatic-flow",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032411/IMG_20161119_202342-500kb_wsdt7u.jpg")
    },
     {
        id: "drw_13",
        titleKey: "paintings.drawings.item13.title",
        slug: "monochromatic-flow",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780058220/Anna_Palestine_22.08.2026-500kb_qyfbpj.jpg")        
    },
     {
        id: "drw_14",
        titleKey: "paintings.drawings.item14.title",
        slug: "charcoal-depths",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780058094/Vincent.2026photoshoped-500kb_ueocvk.jpg")
    },
    {
        id: "drw_15",
        titleKey: "paintings.drawings.item15.title",
        slug: "monochromatic-flow",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613765/IMG_3256ph2026-500kb_hfrcvq.jpg")
    },
    {
        id: "drw_16",
        titleKey: "paintings.drawings.item16.title",
        slug: "monochromatic-flow",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780059850/dorna_scanned-ph2026-500kb_kmobkt.jpg")
    },
     {
        id: "drw_17",
        titleKey: "paintings.drawings.item17.title",
        slug: "charcoal-depths",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780060152/IMG_2724-500kb_dwm95t.jpg")
    },
    {
        id: "drw_18",
        titleKey: "paintings.drawings.item18.title",
        slug: "monochromatic-flow",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780063098/IMG_3009ph2026_inxb8h.jpg")
    },
    {
        id: "drw_19",
        titleKey: "paintings.drawings.item19.title",
        slug: "monochromatic-flow",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780066162/Lena_scannedph26-500kb_lg9xnu.jpg")
    },
     {
        id: "drw_20",
        titleKey: "paintings.drawings.item20.title",
        slug: "monochromatic-flow",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780066797/scanned_small._detail-ph2026-500kb_mjxh6o.jpg")
    },
    {
        id: "drw_21",
        titleKey: "paintings.drawings.item21.title",
        slug: "monochromatic-flow",
        category: "drawings",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1780067263/IMG_3445500kb_yti8g7.jpg ") 
    },

    // ==========================================
    // 3. WATERCOLORS CATEGORY (3 Items)
    // ==========================================
    {
        id: "wat_01",
        titleKey: "paintings.watercolors.item1.title",
        slug: "fluid-boundaries",
        category: "watercolors",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779620844/ph2026kineret-2-500kb_qzscpo.jpg")
    },
    {
        id: "wat_02",
        titleKey: "paintings.watercolors.item2.title",
        slug: "translucent-shores",
        category: "watercolors",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032419/NO_BORDERS_Pregnant_Celine_in_Caesaria._Watercolors_on_cotton_paper_2025-500kb_l7clzr.jpg")
    },
    {
        id: "wat_03",
        titleKey: "paintings.watercolors.item3.title",
        slug: "misty-reflections",
        category: "watercolors",
        images : makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032416/IMG_7751photoshoped_2-2025-500kb_gsfrqk.jpg")
    },
    {
        id: "wat_04",
        titleKey: "paintings.watercolors.item4.title",
        slug: "fluid-boundaries",
        category: "watercolors",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032415/IMG_4459_no_borders-ph12.25_pswoee.jpg")
    },
    {
        id: "wat_05",
        titleKey: "paintings.watercolors.item5.title",
        slug: "translucent-shores",
        category: "watercolors",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779702837/2020ph.2026-500kb_wcsr6l.jpg")
    },
    {
        id: "wat_06",
        titleKey: "paintings.watercolors.item6.title",
        slug: "misty-reflections",
        category: "watercolors",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779979092/IMG_4719ph26500kb_ndjjy4.jpg")
    },
    {
        id: "wat_07",
        titleKey: "paintings.watercolors.item7.title",
        slug: "misty-reflections",
        category: "watercolors",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779979251/IMG_7565photoshoped_2025-500kb_cep1iv.jpg") 
    },

    // ==========================================
    // 4. OTHER WORKS CATEGORY (3 Items)
    // ==========================================
    {
        id: "oth_01",
        titleKey: "paintings.other.item1.title",
        slug: "mixed-dimensions",
        category: "other-works",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613730/photoshoped-more_bright-500kb_pcyurk.jpg")
    },
    {
        id: "oth_02",
        titleKey: "paintings.other.item2.title",
        slug: "sculptural-study",
        category: "other-works",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1779703943/IMGP0914ph2026-500kb_eaxsbn.jpg")
    },
    {
        id: "oth_03",
        titleKey: "paintings.other.item3.title",
        slug: "experimental-textures",
        category: "other-works",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032410/Copy_of_marble_sculpture_of_sleeping_Hermaphroditus_ph12-25_500_kb_mmpzxz.jpg")
    },
    {
        id: "oth_04",
        titleKey: "paintings.other.item4.title",
        slug: "sculptural-study",
        category: "other-works",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032516/smaller2025-Recovered500kb_emgojk.jpg")
    },
    {
        id: "oth_05",
        titleKey: "paintings.other.item5.title",
        slug: "experimental-textures",
        category: "other-works",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032410/Copy_of_marble_sculpture_of_Lely_Venus_2_c._BCE_on_a_piece_of_anchient_Roman_marble_found_in_Caesarea_Israel._Acrylic_on_Marble._2018_ph_1225-500kb_sipdo4.jpg")
    },
      {
        id: "oth_06",
        titleKey: "paintings.other.item6.title",
        slug: "sculptural-study",
        category: "other-works",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032415/IMG_4588ph500kb_neokqj.jpg")
    },
    {
        id: "oth_07",
        titleKey: "paintings.other.item7.title",
        slug: "experimental-textures",
        category: "other-works",
        images: makeImageSet("https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032412/IMG_2652SMALL500kb_dr9xz5.jpg")
    }
];

export const CATEGORY_COVERS: CategoryCover[] = [
    { 
        id: "cat_1", 
        slug: "oil-paintings", 
        titleKey: "categories.oil_paintings", 
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779781882/detail2021-ph2026_l7zv21.jpg" 
    },
    { 
        id: "cat_2", 
        slug: "drawings", 
        titleKey: "categories.drawings", 
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780067263/IMG_3445500kb_yti8g7.jpg" 
    },
    { 
        id: "cat_3", 
        slug: "watercolors", 
        titleKey: "categories.watercolors", 
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779702837/2020ph.2026-500kb_wcsr6l.jpg" 
    },
    { 
        id: "cat_4", 
        slug: "other-works", 
        titleKey: "categories.other_works", 
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779703943/IMGP0914ph2026-500kb_eaxsbn.jpg" 
    },
];