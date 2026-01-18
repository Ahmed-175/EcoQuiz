import api from "../api/api";
import type { User, ApiResponse } from "../types/types";

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

export const login = async (params: LoginParams): Promise<ApiResponse<User>> => {
  const response = await api.post("/auth/login", params);
  return response.data;
};

export const register = async (params: RegisterParams): Promise<ApiResponse<User>> => {
  const response = await api.post("/auth/register", params);
  return response.data;
};
