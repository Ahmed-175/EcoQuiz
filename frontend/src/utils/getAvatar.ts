export const getAvatar = (avater: string): string => {
  if (avater) {
    return `${import.meta.env.VITE_API_BASE_URL}/avatar/${avater}`;
  }
  return "";
};
