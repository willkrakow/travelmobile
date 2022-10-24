import { getDocs } from "firebase/firestore";
import { useQuery } from "react-query";
import { IAirline } from "../types/Airlines";
import { createCollection } from "../vendors/Firebase";

const airlineCol = createCollection<IAirline>("airlines");
const useAirlines = () => {
    const getAll = useQuery("airlines", async () => {
        const results = await getDocs(airlineCol);
        return results.docs.map(d => ({
            id: d.id,
            ...d.data()
        }))
    })

    return {getAll}
}

export default useAirlines