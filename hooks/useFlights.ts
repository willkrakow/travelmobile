import { addDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createCollection } from "../vendors/Firebase";
import { useTripContext } from "./useTripContexts";
import {IAirport} from '../types/Airports';

interface IFlight {
  departure_airport: IAirport;
  departure_date: string;
  arrival_date: string;
  arrival_airport: IAirport;
  flight_number: string;
  seat_class: string;
  airline: string;
  price: number;
  trip_id: string;
  user_id: string;
}
const flightCol = createCollection<IFlight>("flights");
const useFlights = () => {
  const client = useQueryClient();
  const { tripId = "" } = useTripContext();

  const queryKey = ["trips", tripId, "flights"]
  const getAll = useQuery(
    queryKey,
    async () => {
      const q = query(flightCol, where("trip_id", "==", tripId));
      const { docs } = await getDocs(q);

      return docs.map((l) => ({
        id: l.id,
        ...l.data(),
      }));
    },
    {
      enabled: tripId.length > 0,
      refetchOnMount: true,
      refetchInterval: 1000 * 60,
    }
  );


  const onSuccess = () => {
    client.invalidateQueries(queryKey);
    client.refetchQueries(queryKey)
  };
  const create = useMutation(async (data: IFlight) => {
        const res = await addDoc(flightCol, data);
        return res;
  }, {onSuccess})

  const remove = useMutation(async (id: string) => {
    const docRef = doc(flightCol, id);
    await deleteDoc(docRef);
  }, {onSuccess})


  return { getAll, create, remove };
};

export default useFlights;
