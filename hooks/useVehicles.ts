import { addDoc, getDocs, query, where } from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { createCollection } from "../vendors/Firebase";
import { IVehicle } from "../types/Vehicles";
import useUserId from "./useUserId";


const vehicleCol = createCollection<IVehicle>("vehicles");

const useVehicles = () => {
    const userId = useUserId();
    const client = useQueryClient();

    const getAll = useQuery(['vehicles', userId], async () => {
        const q = query(vehicleCol, where("user_id", "==", userId));

        const docs = await getDocs(q);

        return docs.docs.map(d => ({
            id: d.id,
            ...d.data(),
        }))
    });


    const create = useMutation(async (data: IVehicle) => {
        const res = await addDoc(vehicleCol, data);

        return res
    }, {
        onSuccess: () => {
            client.invalidateQueries(['vehicles', userId]);
            client.refetchQueries(['vehicles', userId])
        }
    })


    return {getAll, create}
}


export default useVehicles;