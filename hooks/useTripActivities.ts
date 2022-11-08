import { addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { IActivity } from "../types/Activities";
import { createCollection } from "../vendors/Firebase";
import { useTripContext } from "./useTripContexts";


export const activityCol = createCollection<IActivity>("activities")
const useTripActivities = () => {
    const {tripId} = useTripContext();
    const queryKey = ["trips", tripId, "activities"];
    const getAll = useQuery(queryKey, async () => {
        const q = query(activityCol, where("trip_id", "==", tripId))
        const docs = await getDocs(q)
        return docs.docs.map((d) => ({
            ...d.data(),
            id: d.id,
        }))
    }, {
        enabled: !!tripId && tripId?.length > 0,
        refetchInterval: 60*1000,
        refetchOnMount: true,
    })

    const client = useQueryClient()
    const create = useMutation(async (data: IActivity) => {
        await addDoc(activityCol, data);
    }, {
        onSuccess: () => {
            client.invalidateQueries(queryKey);
            client.refetchQueries(queryKey)
        }
    })

    const deleteOne = useMutation(async (activityId: string) => {
        const activityRef = doc(activityCol, activityId)
        await deleteDoc(activityRef);
        return;
    }, {
        onSuccess: () => {
            client.invalidateQueries(queryKey);
            client.refetchQueries(queryKey);
        },
    })

    const update = useMutation(async (data: IActivity & {id: string}) => {
        const activityRef = doc(activityCol, data.id);
        const removed = Object.fromEntries(Object.entries(data).filter(([key, val]) => key !== 'id'));
        await updateDoc(activityRef, removed)
    }, {
        onSuccess: () => {
            client.invalidateQueries(["trips", tripId, "activities"]);
            client.refetchQueries(["trips", tripId, "activities"]);
        }
    })

    return {getAll, create, deleteOne, update}
}

export default useTripActivities