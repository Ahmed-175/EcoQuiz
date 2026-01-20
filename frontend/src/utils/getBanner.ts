export const getBanner = (banner: string | undefined): string => {
  if (banner) {
    return `${import.meta.env.VITE_API_BASE_URL}${banner}`;
  }
  return "/background.jpg";
};
