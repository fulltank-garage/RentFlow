import api from "@/src/lib/axios";
import { getRentFlowTenantHeaders } from "@/src/lib/tenant";
import type { RentFlowRequestOptions } from "../types/types";
import type { ApiResponse } from "../types/types";
import type {
  Car,
  CarImagesUploadResponse,
  CarsApiResponse,
  GetCarsParams,
  GetCarsResponse,
} from "./cars.types";
import {
  normalizeCarsResponse,
  normalizeUploadedCarImage,
} from "./cars.mapper";

export async function getCars(
  params?: GetCarsParams,
  options?: RentFlowRequestOptions
): Promise<GetCarsResponse> {
  const headers =
    options?.marketplace === true
      ? undefined
      : getRentFlowTenantHeaders({ tenantSlug: options?.tenantSlug });

  const res = await api.get<CarsApiResponse>("/cars", {
    params: {
      marketplace: options?.marketplace ? "true" : undefined,
      q: params?.q || undefined,
      type: params?.type && params.type !== "all" ? params.type : undefined,
      location: params?.location || undefined,
      pickupDate: params?.pickupDate || undefined,
      returnDate: params?.returnDate || undefined,
      sort: params?.sort || undefined,
    },
    headers,
  });

  return normalizeCarsResponse(res.data);
}

export async function getCarById(
  carId: string,
  options?: RentFlowRequestOptions
): Promise<Car | null> {
  const { items } = await getCars(undefined, options);
  return items.find((car) => car.id === carId) ?? null;
}

export async function uploadCarImages(
  carId: string,
  files: File[],
  options?: { replace?: boolean }
): Promise<ApiResponse<CarImagesUploadResponse>> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const res = await api.post<ApiResponse<CarImagesUploadResponse>>(
    `/cars/${encodeURIComponent(carId)}/images`,
    formData,
    {
      params: {
        replace: options?.replace ? "true" : undefined,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return {
    ...res.data,
    data: {
      items: (res.data.data?.items ?? []).map(normalizeUploadedCarImage),
      total: res.data.data?.total ?? 0,
    },
  };
}
