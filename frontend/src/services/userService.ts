import api from "../api/api";
import type {
  User,
  UserQuizStats,
  QuizAttempt,
  ApiResponse,
} from "../types/types";

// Get current user profile
export const getUserProfile = async (): Promise<User> => {
  const response = await api.get("/users/me");
  return response.data.res;
};

// Get user by ID
export const getUserById = async (id: string): Promise<any> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Update user profile
export const updateProfile = async (
  username?: string,
  avatar?: string,
  banner?: string
): Promise<User> => {
  const response = await api.put("/users/me", { username, avatar, banner });
  return response.data.data;
};

// Upload avatar
export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("avatar", file);
  const response = await api.put("/users/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.avatar;
};

export const uploadBanner = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("banner", file);
  const response = await api.put("/users/me/banner", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.banner;
};

export const getUserStats = async (userId: string): Promise<UserQuizStats> => {
  const response = await api.get(`/users/${userId}/stats`);
  return response.data.data;
};

export const getUserAttempts = async (
  userId: string
): Promise<QuizAttempt[]> => {
  const response = await api.get(`/users/${userId}/attempts`);
  return response.data.data;
};

export const logout = async (): Promise<ApiResponse<null>> => {
  const response = await api.post("/auth/logout");
  return response.data;
};
