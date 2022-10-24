export interface ITrip {
  title: string;
  departure_date: string;
  return_date: string;
  estimated_time: string;
  parties: string[];
  origin_location: string;
  cover_image_url: string;
  user_id: string;
}


export interface ITripPhoto {
  caption: string;
  date_taken: string;
  activity_id?: string;
  trip_id: string;
  user_id: string;
  lodging_id?: string;
  image_url: string;
}