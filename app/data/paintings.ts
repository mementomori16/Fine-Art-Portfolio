/** 
 * 1. THE INTERFACE (The "Blueprint")
 * This replaces your old Products.ts
 */
export interface Painting {
    id: string;
    titleKey: string;     
    slug: string;         
    category: 'landscapes' | 'portraits' | 'abstract' | 'street-art' | 'oil'; // Added 'oil' here
    cloudinaryId: string; 
    isFeatured?: boolean; 
}

export interface CategoryCover {
    id: string;
    slug: string;
    titleKey: string;
    cloudinaryId: string;
}

/** 
 * 2. THE DATA (The "Product List")
 * This replaces your old products.ts
 */
export const PAINTINGS: Painting[] = [
    {
        id: "p101",
        titleKey: "paintings.sunset_valley.title",
        slug: "sunset-valley",
        category: "landscapes",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032418/Joe_Pesci_small-500kb_d6ngvt.jpg",
    },
    {
        id: "p102",
        titleKey: "paintings.urban_echo.title",
        slug: "urban-echo",
        category: "street-art",
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032418/Joe_Pesci_small-500kb_d6ngvt.jpg",
    },
    // ... add your remaining 50-80 paintings here
];

/** 
 * 3. CATEGORY COVERS
 * Specifically for the 4 images on your Categories page
 */
export const CATEGORY_COVERS: CategoryCover[] = [
    { 
        id: "cat_1", 
        slug: "landscapes", 
        titleKey: "categories.landscapes", 
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032418/Joe_Pesci_small-500kb_d6ngvt.jpg" 
    },
    { 
        id: "cat_2", 
        slug: "portraits", 
        titleKey: "categories.portraits", 
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032419/No_borders-croped500kb_hs6nm1.jpg" 
    },
    { 
        id: "cat_3", 
        slug: "abstract", 
        titleKey: "categories.abstract", 
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032362/detai.120kb_tzdbur.jpg" 
    },
    { 
        id: "cat_4", 
        slug: "street-art", 
        titleKey: "categories.street_art", 
        cloudinaryId: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769032419/ph12.25-500kb_wsz33f.jpg" 
    },
];