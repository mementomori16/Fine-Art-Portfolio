// src/utils/imageUtils.ts
export const getGalleryImages = (painting: any): string[] => {
  if (!painting) return [];
  const images = [
    painting.images?.large,
    painting.thumbnail,
    painting.thumbnail2,
    painting.thumbnail3,
  ];
  // Filter out undefined/null/empty strings
  return images.filter((img): img is string => !!img);
};