import { PlusCode } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_API_KEY } from "../constants/Api";

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface Location {
  lat: number;
  lng: number;
}
interface Geometry {
  location: Location;
  viewport: {
    northest?: Location;
    northwest?: Location;
    southwest?: Location;
    southeast?: Location;
  };
}

interface PlacePhoto {
  height: number;
  width: number;
  photo_reference: string;
}
interface PlaceDetails {
  result: {
    address_components: AddressComponent[];
    formatted_address: string;
    formatted_phone_number: string;
    geometry: Geometry;

    icon: string;
    icon_background_color: string;
    icon_mask_base_uri: string;
    name: string;
    photos: PlacePhoto[];
    place_id: string;
  };
}

interface IAirport {
  business_status: string;
  formatted_address: string;
  geometry: Geometry;
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  photos: PlacePhoto[];
  place_id: string;
  plus_code: PlusCode;
  rating: number;
  reference: string;
  types: string[];
  user_ratings_total: number;
}
interface IAirportResponse {
  results: IAirport[]
}

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
}

const GoogleMaps = new GoogleMapsClass(GOOGLE_MAPS_API_KEY);
export default GoogleMaps;