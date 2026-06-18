import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../models/apiError";

export function getApiErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>;

  if (axiosError.response?.data?.errors?.length) {
    return axiosError.response.data.errors.join(" | ");
  }

  if (axiosError.response?.data?.message) {
    return axiosError.response.data.message;
  }

  return "Ocurrió un error inesperado. Intenta nuevamente.";
}