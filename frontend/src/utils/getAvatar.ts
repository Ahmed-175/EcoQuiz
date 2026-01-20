export const getAvatar = (avater: string | undefined): string => {
  if (avater) {
    return `${import.meta.env.VITE_API_BASE_URL}${avater}`;
  }
  return "./graduated.png";
};
