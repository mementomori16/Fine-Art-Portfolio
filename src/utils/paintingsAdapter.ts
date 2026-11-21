export interface PaintingImage {
  small: string;
  medium: string;
  large: string;
}

const LOGO_LAYER =
  "l_Group_78.1_abxycn,w_0.195,fl_relative,o_66/fl_layer_apply,g_south,y_0.03,fl_relative";

export function applyWatermark(url?: string): string {
  if (!url) return "";
  if (!url.includes("/upload/")) return url;

  const cleanUrl = url.replace(/\/upload\/[^/]+\/(v\d+\/)/, "/upload/$1");

  if (cleanUrl.includes("l_Group_78.1_abxycn")) return cleanUrl;

  return cleanUrl.replace("/upload/", `/upload/c_limit,w_2200,q_auto,f_auto/${LOGO_LAYER}/`);
}

export function buildResponsiveImage(url: string): PaintingImage {
  if (!url) {
    return {
      small: "",
      medium: "",
      large: ""
    };
  }

  return {
    small: url.replace("/upload/", "/upload/w_350,q_auto,f_auto/"),
    medium: url.replace("/upload/", "/upload/w_750,q_auto,f_auto/"),
    large: url
  };
}