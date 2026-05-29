export interface Painting {
    id: string;
    titleKey: string;     
    slug: string;         
    category: 'oil-paintings' | 'drawings' | 'watercolors' | 'other-works'; 
    cloudinaryId: string; 
    isFeatured?: boolean; 
}

export interface CategoryCover {
    id: string;
    slug: 'oil-paintings' | 'drawings' | 'watercolors' | 'other-works';
    titleKey: string;
    cloudinaryId: string;
}

export const PAINTINGS: Painting[] = [
    // ==========================================
    // 1. OIL PAINTINGS CATEGORY (4 Items)
    // ==========================================
    {
        id: "oil_01",
        titleKey: "paintings.oil.item1.title",
        slug: "vanitas",
        category: "oil-paintings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032418/Mcdonalds_2010._Oil_on_canvas_145_x_191_cm._Ilya_Medvedev.ph01.26-500kb_damqkv.jpg",
        isFeatured: true
    },
    {
        id: "oil_02",
        titleKey: "paintings.oil.item2.title",
        slug: "crimson-serenade",
        category: "oil-paintings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779782494/Vanitas_ph2026500KB2_gyxk8l.jpg"
    },
    {
        id: "oil_03",
        titleKey: "paintings.oil.item3.title",
        slug: "whispering-meadows",
        category: "oil-paintings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779780148/IMG_8469ph2026-500kb16-9_xdohca.jpg"
    },
    {
        id: "oil_04",
        titleKey: "paintings.oil.item4.title",
        slug: "ethereal-dusk",
        category: "oil-paintings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032416/IMG_4906_photoshoped_12.2025-500kb_xdkpzo.jpg"
    },
    {
        id: "oil_05",
        titleKey: "paintings.oil.item5.title",
        slug: "ethereal-dusk",
        category: "oil-paintings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032409/Cold_World_2011.ph2026-500kb_uzoqft.jpg"
    },
    {
        id: "oil_06",
        titleKey: "paintings.oil.item6.title",
        slug: "ethereal-dusk",
        category: "oil-paintings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1770367743/photoshoped_2025_Royal_Gore._Oil_on_canvas_111_x_200_cm._2008._500kb_e9z43l.jpg"
    },
    {
        id: "oil_07",
        titleKey: "paintings.oil.item7.title",
        slug: "ethereal-dusk",
        category: "oil-paintings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613731/varnished-and-photoshoped-small-2-500kb_jgndqr.jpg"
    },
    {
        id: "oil_08",
        titleKey: "paintings.oil.item8.title",
        slug: "ethereal-dusk",
        category: "oil-paintings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613701/IMG_4550ph26-500kb_lqn3zn.jpg"
    },
    {
        id: "oil_09",
        titleKey: "paintings.oil.item9.title",
        slug: "ethereal-dusk",
        category: "oil-paintings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779702849/ph2026edgein-500kb_cdva8b.jpg"
    },
    {
        id: "oil_10",
        titleKey: "paintings.oil.item10.title",
        slug: "ethereal-dusk",
        category: "oil-paintings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779979449/IMG_5294photoshoped_2026-500kb_sm9hwq.jpg"
    },
     {
        id: "oil_11",
        titleKey: "paintings.oil.item11.title",
        slug: "ethereal-dusk",
        category: "oil-paintings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779784466/Portraite_of_drowned_woman_2018500KB_dacbwg.jpg"
    },

    // ==========================================
    // 2. DRAWINGS CATEGORY (10 Items)
    // ==========================================
    {
        id: "drw_01",
        titleKey: "paintings.drawings.item1.title",
        slug: "urban-echo",
        category: "drawings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032413/IMG_32273closeup-500kb_he3bkp.jpg"
    },
    {
        id: "drw_02",
        titleKey: "paintings.drawings.item2.title",
        slug: "shadowed-profile",
        category: "drawings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032516/SKM_C45818070115150_0002small-500kb_kuaces.jpg"
    },
    {
        id: "drw_03",
        titleKey: "paintings.drawings.item3.title",
        slug: "silent-gaze",
        category: "drawings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032420/Parrot._Scanned_and_photoshoped_smaller2500kb_b6vay5.jpg"
    },
    {
        id: "drw_04",
        titleKey: "paintings.drawings.item4.title",
        slug: "lines-of-time",
        category: "drawings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032418/katya_photoshop_2025-ph500kb_aokpyv.jpg"
    },
    {
        id: "drw_05",
        titleKey: "paintings.drawings.item5.title",
        slug: "architectural-study",
        category: "drawings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032414/IMG_3232-500kb_lifcup.jpg"
    },
    {
        id: "drw_06",
        titleKey: "paintings.drawings.item6.title",
        slug: "gestural-anatomy",
        category: "drawings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032411/Dorkas_new_ph_12-25-500kb_nua9wb.jpg"
    },
    {
        id: "drw_07",
        titleKey: "paintings.drawings.item7.title",
        slug: "contour-landscapes",
        category: "drawings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032418/Joe_Pesci_small-500kb_d6ngvt.jpg"
    },
    {
        id: "drw_08",
        titleKey: "paintings.drawings.item8.title",
        slug: "nocturnal-sketch",
        category: "drawings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1777925635/IMG_4691-ph2026-500kb_iq9ive.jpg"
    },
    {
        id: "drw_09",
        titleKey: "paintings.drawings.item9.title",
        slug: "charcoal-depths",
        category: "drawings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032471/photoshoped2025final500kb_n1aj9r.jpg"
    },
    {
        id: "drw_10",
        titleKey: "paintings.drawings.item10.title",
        slug: "monochromatic-flow",
        category: "drawings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032413/IMG_3012closeup500kb_xo89iy.jpg"
    },
     {
        id: "drw_11",
        titleKey: "paintings.drawings.item11.title",
        slug: "charcoal-depths",
        category: "drawings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032411/IMG_2825ph1225-500kb_szirsi.jpg"
    },
    {
        id: "drw_12",
        titleKey: "paintings.drawings.item12.title",
        slug: "monochromatic-flow",
        category: "drawings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032411/IMG_20161119_202342-500kb_wsdt7u.jpg"
    },
     {
        id: "drw_13",
        titleKey: "paintings.drawings.item13.title",
        slug: "monochromatic-flow",
        category: "drawings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780058220/Anna_Palestine_22.08.2026-500kb_qyfbpj.jpg"
    },
     {
        id: "drw_14",
        titleKey: "paintings.drawings.item14.title",
        slug: "charcoal-depths",
        category: "drawings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780058094/Vincent.2026photoshoped-500kb_ueocvk.jpg"
    },
    {
        id: "drw_15",
        titleKey: "paintings.drawings.item15.title",
        slug: "monochromatic-flow",
        category: "drawings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613765/IMG_3256ph2026-500kb_hfrcvq.jpg"
    },
    {
        id: "drw_16",
        titleKey: "paintings.drawings.item16.title",
        slug: "monochromatic-flow",
        category: "drawings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780059850/dorna_scanned-ph2026-500kb_kmobkt.jpg"
    },
     {
        id: "drw_17",
        titleKey: "paintings.drawings.item17.title",
        slug: "charcoal-depths",
        category: "drawings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780060152/IMG_2724-500kb_dwm95t.jpg"
    },
    {
        id: "drw_18",
        titleKey: "paintings.drawings.item18.title",
        slug: "monochromatic-flow",
        category: "drawings",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1780063098/IMG_3009ph2026_inxb8h.jpg"
    },

    // ==========================================
    // 3. WATERCOLORS CATEGORY (3 Items)
    // ==========================================
    {
        id: "wat_01",
        titleKey: "paintings.watercolors.item1.title",
        slug: "fluid-boundaries",
        category: "watercolors",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779620844/ph2026kineret-2-500kb_qzscpo.jpg"
    },
    {
        id: "wat_02",
        titleKey: "paintings.watercolors.item2.title",
        slug: "translucent-shores",
        category: "watercolors",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032419/NO_BORDERS_Pregnant_Celine_in_Caesaria._Watercolors_on_cotton_paper_2025-500kb_l7clzr.jpg"
    },
    {
        id: "wat_03",
        titleKey: "paintings.watercolors.item3.title",
        slug: "misty-reflections",
        category: "watercolors",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032416/IMG_7751photoshoped_2-2025-500kb_gsfrqk.jpg"
    },
    {
        id: "wat_04",
        titleKey: "paintings.watercolors.item4.title",
        slug: "fluid-boundaries",
        category: "watercolors",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032415/IMG_4459_no_borders-ph12.25_pswoee.jpg"
    },
    {
        id: "wat_05",
        titleKey: "paintings.watercolors.item5.title",
        slug: "translucent-shores",
        category: "watercolors",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779702837/2020ph.2026-500kb_wcsr6l.jpg"
    },
    {
        id: "wat_06",
        titleKey: "paintings.watercolors.item6.title",
        slug: "misty-reflections",
        category: "watercolors",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779979092/IMG_4719ph26500kb_ndjjy4.jpg"
    },
    {
        id: "wat_07",
        titleKey: "paintings.watercolors.item7.title",
        slug: "misty-reflections",
        category: "watercolors",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779979251/IMG_7565photoshoped_2025-500kb_cep1iv.jpg"
    },

    // ==========================================
    // 4. OTHER WORKS CATEGORY (3 Items)
    // ==========================================
    {
        id: "oth_01",
        titleKey: "paintings.other.item1.title",
        slug: "mixed-dimensions",
        category: "other-works",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613730/photoshoped-more_bright-500kb_pcyurk.jpg"
    },
    {
        id: "oth_02",
        titleKey: "paintings.other.item2.title",
        slug: "sculptural-study",
        category: "other-works",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779703943/IMGP0914ph2026-500kb_eaxsbn.jpg"
    },
    {
        id: "oth_03",
        titleKey: "paintings.other.item3.title",
        slug: "experimental-textures",
        category: "other-works",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779703943/IMGP0914ph2026-500kb_eaxsbn.jpg"
    }
];

export const CATEGORY_COVERS: CategoryCover[] = [
    { 
        id: "cat_1", 
        slug: "oil-paintings", 
        titleKey: "categories.oil_paintings", 
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613717/IMGP3286PH26-2-500b_nidce0.jpg" 
    },
    { 
        id: "cat_2", 
        slug: "drawings", 
        titleKey: "categories.drawings", 
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032418/Joe_Pesci_small-500kb_d6ngvt.jpg" 
    },
    { 
        id: "cat_3", 
        slug: "watercolors", 
        titleKey: "categories.watercolors", 
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779956890/No_borders-croped%D0%B7%D1%802026-500kb_hjhxo6.jpg" 
    },
    { 
        id: "cat_4", 
        slug: "other-works", 
        titleKey: "categories.other_works", 
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779703943/IMGP0914ph2026-500kb_eaxsbn.jpg" 
    },
];