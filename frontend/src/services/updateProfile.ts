import api from "../api/api";
import type { User } from "../types/types";

export const updateProfile = async (
  username?: string,
  avatar?: string,
  banner?: string
): Promise<User> => {
  const response = await api.put('/users/me', { username, avatar, banner });
  return response.data.data;
};
