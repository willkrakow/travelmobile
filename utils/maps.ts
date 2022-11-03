import { GOOGLE_MAPS_API_KEY } from "../constants/Api";
import { IAirportResponse, IDirectionsResponse, IPlacesAutocompleteResponse, PlaceDetails } from "../types/Maps";

export const placeDirectionsUrl = (placeId: string) => {
  return `https://www.google.com/maps/dir/?api=1&destination_place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`;
};

export const getPlaceDetails = async (
  placeId: string
): Promise<PlaceDetails> => {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`;
  const res = await fetch(url);
  return await res.json();
};

export const queryAirports = async (query: string) => {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&type=airport&key=${GOOGLE_MAPS_API_KEY}`;
  const res = await fetch(url);
  return await res.json() as IAirportResponse;
};


export class GoogleMapsClass {
  private _apiKey: string;
  constructor(key: string){
    this._apiKey = key;
  }

  private addKey(url: string){
    return `${url}&key=${this._apiKey}`;
  }

  private async fetcher<T>(url: string): Promise<T>{
    const res = await fetch(this.addKey(url));
    return await res.json()
  }

  async getAirports(query: string){
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&type=airport`;
    return await this.fetcher<IAirportResponse>(url)
  }

  async getPlaceDetails(placeId: string){
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}`;
    return await this.fetcher<PlaceDetails>(url)
  }

  placeDirectionsUrl(placeId: string){
    return this.addKey(`https://www.google.com/maps/dir/?api=1&destination_place_id=${placeId}`);
  }

  getDirectionsUrl(startPlaceId: string, endPlaceId: string, mode: "driving" | "walking" | "transit"){
    return `https://www.google.com/maps/dir/?api=1&origin_place_id=${startPlaceId}&destination_place_id=${endPlaceId}&travelmode=${mode}`
  }

  async getDirections(startPlaceId: string, endPlaceId: string, mode: "driving" | "walking" | "transit" = "driving"){
    const url = this.addKey(`https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${startPlaceId}&destination=place_id:${endPlaceId}&mode=${mode}`);
    return await this.fetcher<IDirectionsResponse>(url);
  }

  async getPlaceAutocomplete(query: string, types: string = "establishment"){
    const url = this.addKey(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=${types}`);
    return await this.fetcher<IPlacesAutocompleteResponse>(url);
  }
}

const GoogleMaps = new GoogleMapsClass(GOOGLE_MAPS_API_KEY);
export default GoogleMaps;