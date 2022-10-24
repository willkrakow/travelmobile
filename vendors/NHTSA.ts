import { IMakesResponse } from "../types/Vehicles";

class NHTSAApiClass {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  async getModelsForMake(make?: string, year?: string) {
    if (!make) return [];
    const path = year
      ? `vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`
      : `vehicles/GetModelsForMake/${make}?format=json`;

    return await this.fetcher(path);
  }

  async getMakes() {
    const path = "vehicles/GetAllMakes?format=json";

    return await this.fetcher<IMakesResponse>(path);
  }

  async fetcher<T>(path: string) {
    const url = `${this.baseUrl}/${path}`;
    const res = await fetch(url);
    return (await res.json()) as T;
  }
}

const NHTSA_BASE_URL = "https://vpic.nhtsa.dot.gov/api";

export const NHTSAApi = new NHTSAApiClass(NHTSA_BASE_URL);
