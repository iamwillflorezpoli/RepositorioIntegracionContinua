export interface ApiErrorResponse {
  status: number;
  message: string;
  path: string;
  timestamp: string;
  errors?: string[] | null;
}