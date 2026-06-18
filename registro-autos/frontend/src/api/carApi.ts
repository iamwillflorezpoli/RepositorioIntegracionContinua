import { axiosClient } from "./axiosClient";
import type { CarRequest, CarResponse } from "../models/car";

export async function getMyCars(): Promise<CarResponse[]> {
  const response = await axiosClient.get<CarResponse[]>("/cars");
  return response.data;
}

export async function getMyCarById(id: number): Promise<CarResponse> {
  const response = await axiosClient.get<CarResponse>(`/cars/${id}`);
  return response.data;
}

export async function createCar(request: CarRequest): Promise<CarResponse> {
  const response = await axiosClient.post<CarResponse>("/cars", request);
  return response.data;
}

export async function updateCar(
  id: number,
  request: CarRequest
): Promise<CarResponse> {
  const response = await axiosClient.put<CarResponse>(`/cars/${id}`, request);
  return response.data;
}

export async function deleteCar(id: number): Promise<void> {
  await axiosClient.delete(`/cars/${id}`);
}