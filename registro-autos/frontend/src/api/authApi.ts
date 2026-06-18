import { axiosClient } from "./axiosClient";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../models/auth";

export async function registerUser(
  request: RegisterRequest
): Promise<AuthResponse> {
  const response = await axiosClient.post<AuthResponse>(
    "/auth/register",
    request
  );

  return response.data;
}

export async function loginUser(
  request: LoginRequest
): Promise<AuthResponse> {
  const response = await axiosClient.post<AuthResponse>(
    "/auth/login",
    request
  );

  return response.data;
}