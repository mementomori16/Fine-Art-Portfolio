export interface PaintingImage {
  small: string;
  medium: string;
  large: string;
}

export function buildResponsiveImage(url: string): PaintingImage {
  if (!url) {
    return {
      small: "",
      medium: "",
      large: ""
    };
  }

  const inject = (u: string, size: string) => {
    if (!u.includes("/upload/")) return u;
    return u.replace("/upload/", `/upload/${size}/`);
  };

  return {
    small: inject(url, "w_400,q_auto,f_auto"),
    medium: inject(url, "w_800,q_auto,f_auto"),
    large: inject(url, "w_1600,q_auto,f_auto")
  };
}