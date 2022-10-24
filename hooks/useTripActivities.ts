import { addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { IActivity } from "../types/Activities";
import { createCollection } from "../vendors/Firebase";
import { useTripContext } from "./useTripContexts";


const activityCol = createCollection<IActivity>("activities")
const useTripActivities = () => {
    const {tripId} = useTripContext();
    const getAll = useQuery(["trips", tripId, 'activities'], async () => {
        const q = query(activityCol, where("trip_id", "==", tripId))
        const docs = await getDocs(q)

        return docs.docs.map((d) => ({
            id: d.id,
            ...d.data()
        }))
    }, {
        enabled: typeof tripId !== 'undefined' && tripId?.length > 0
    })

    const client = useQueryClient()
    const create = useMutation(async (data: IActivity) => {
        const res = await addDoc(activityCol, data)
        
        return res
    }, {
        onSuccess: () => {
            client.invalidateQueries(["trips", tripId, 'activities']);
            client.refetchQueries(["trips", tripId, 'activities'])
        }
    })

    const deleteOne = useMutation(async (activityId: string) => {
        const activityRef = doc(activityCol, activityId)
        await deleteDoc(activityRef);
        return;
    }, {
        onSuccess: () => {
            client.invalidateQueries(['trips', tripId, 'activities'])
            client.refetchQueries(["trips", tripId, "activities"]);
        }
    })

    return {getAll, create, deleteOne}
}

export default useTripActivities