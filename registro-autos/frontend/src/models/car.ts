export interface CarRequest {
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  color: string;
}

export interface CarResponse {
  id: number;
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  color: string;
}