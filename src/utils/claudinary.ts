export const getCloudinaryImage = (
    url: string,
    width: number
): string => {
    if (!url) return "";

    if (!url.includes("/upload/")) return url;

    return url.replace(
        "/upload/",
        `/upload/w_${width},c_scale,q_auto,f_auto/`
    );
};