import { useQuery } from "react-query";
import { getDoc, doc } from "firebase/firestore";
import { ITrip } from "../types/Trips";
import { createCollection } from "../vendors/Firebase";
import { useTripContext } from "./useTripContexts";

const tripCollection = createCollection<ITrip>("trips")

const useFirebaseTrip = () => {
    const {tripId} = useTripContext();
    const query = useQuery(["trips", tripId], async () => {
        const tripRef = doc(tripCollection, tripId)
        const trip = await getDoc(tripRef)
        return {
            id: trip.id,
            ...trip.data(),
        }
    }, {
        enabled: typeof tripId !== 'undefined' && tripId?.length > 0,
        refetchOnMount: true,
    })

    return {query}
}


export default useFirebaseTrip;
