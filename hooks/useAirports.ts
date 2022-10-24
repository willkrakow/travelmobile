import { getDocs } from "firebase/firestore";
import { useQuery } from "react-query";
import { IAirport } from "../types/Airports";
import { createCollection } from "../vendors/Firebase";

const airportCol = createCollection<IAirport>("airports");
const useAirports = () => {
  const getAll = useQuery("airports", async () => {
    const results = await getDocs(airportCol);
    return results.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  });

  return { getAll };
};

export default useAirports;
