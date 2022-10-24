export interface IFlight {
  id: number;
  airline: string;
  flight_number: string;
  departure_date: string;
  departure_airport: string;
  arrival_date: string;
  arrival_airport: string;
  seat_class: string;
  price: number;
  user_id: string;
}