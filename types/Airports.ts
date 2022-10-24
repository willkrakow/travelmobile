export interface IAirport {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  local_code: string | null;
  iata_code: string | null;
  gps_code: string | null;
  continent: "AS" | "NA" | "SA" | "AF" | "EU" | "OC";
  elevation_ft: number;
  municipality: string | null;
  type: "large_airport" | "balloonport" | string;
  ident: string;
  iso_country: string;
  iso_region: string;
}