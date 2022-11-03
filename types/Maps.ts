import { PlusCode } from "react-native-google-places-autocomplete";

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface Location {
  lat: number;
  lng: number;
}
export interface Geometry {
  location: Location;
  viewport: {
    northest?: Location;
    northwest?: Location;
    southwest?: Location;
    southeast?: Location;
  };
}

export interface PlacePhoto {
  height: number;
  width: number;
  photo_reference: string;
}
export interface PlaceDetails {
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

export interface IAirport {
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
export interface IAirportResponse {
  results: IAirport[];
}

export interface IDirectionsResponse {
  routes: IDirectionsRoute[];
}

export interface IDirectionsRoute {
  bounds: Geometry["viewport"];
  legs: IDirectionsLeg[];
}

export interface IDirectionsLegMetadata {
  text: string;
  value: number;
}
export interface IDirectionsLeg {
  duration: IDirectionsLegMetadata;
  distance: IDirectionsLegMetadata;
}

export interface IMatchedSubstring {
  length: number;
  offset: number;
}

export interface IStructuredFormatting {
  main_text: string;
  main_text_matched_substrings: IMatchedSubstring[];
  secondary_text: string;
}

export interface IPlacesPrediction {
  description: string;
  matched_substrings: IMatchedSubstring[];
  place_id: string;
  reference: string;
  structured_formatting: IStructuredFormatting;
  terms: any[];
  types: string[];
}
export interface IPlacesAutocompleteResponse {
  predictions: IPlacesPrediction[]
}