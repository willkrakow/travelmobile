export interface IWalk {
  departure_location_type: "activity" | "lodging";
  departure_location_id: string;
  departure_date: string;
  arrival_date: string;
  arrival_location_id: string;
  arrival_location_type: "activity" | "lodging";
  trip_id: string;
  user_id: string;
}
