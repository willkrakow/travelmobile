import React from 'react'
import { addDoc, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useQuery, useMutation, useQueryClient } from "react-query";
import { createCollection } from '../vendors/Firebase';
import { ILodging } from '../types/Lodging';
import { useTripContext } from './useTripContexts';


const lodgingCol = createCollection<ILodging>('lodging')
const useLodging = () => {
    const {tripId = ''} = useTripContext();
    const client = useQueryClient();

    const onSuccess = () => {
            client.invalidateQueries(['trips', tripId, 'lodging'])
            client.refetchQueries(["trips", tripId, "lodging"]);
        }
    const getAll = useQuery(['trips', tripId, 'lodging'], async () => {
        const q = query(lodgingCol, where("trip_id", "==", tripId));
        const {docs} = await getDocs(q);

        return docs.map((l) => ({
            id: l.id,
            ...l.data()
        }))
    }, {
        enabled: tripId.length > 0,
        refetchOnMount: true,
        refetchInterval: 1000 * 60,
    });

    const create = useMutation(async (data: ILodging) => {
        const res = await addDoc(lodgingCol, data);

        return res;
    }, { onSuccess })

    const remove = useMutation(
      async (id: string) => {
        const docRef = doc(lodgingCol, id);
        await deleteDoc(docRef);
      },
      { onSuccess }
    );

    const update = useMutation(async (data: ILodging & {id: string}) => {
        const docRef = doc(lodgingCol, data.id);

        const res = await updateDoc(docRef, data);

        return res
    }, {onSuccess})

    return {getAll, create, remove, update}
}

export default useLodging;