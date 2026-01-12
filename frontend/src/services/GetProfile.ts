import api from "../api/api";
import type { User } from "../types/types";

export const getUserProfile = async (): Promise<User> => {
  try {
    const res = await api.get("/users/me");
    return res.data.res;
  } catch (error) {
    console.error("Failed to fetch user profile", error);
    throw error;
  }
};
