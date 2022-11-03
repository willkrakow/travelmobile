import React from 'react'
import { getAuth } from "firebase/auth";
import { createCollection } from '../vendors/Firebase';
import { doc, getDoc, updateDoc} from 'firebase/firestore';
import { useMutation, useQuery } from 'react-query';
import { IUser } from '../types/User';

export const userCol = createCollection<IUser>("users")


const useUser = () => {
    const auth = getAuth();

    const getCurrent = useQuery(['users', auth.currentUser?.uid], async () => {
        try {
            const docRef = doc(userCol, auth.currentUser?.uid);
            const data = await getDoc(docRef);
            return {id: data.id, ...data.data()}
        } catch(err){
            console.log(err)
        }

    })

    const update = useMutation(async (data: IUser) => {
        const docRef = doc(userCol, auth.currentUser?.uid);
        await updateDoc(docRef, data);
    })
    return {
        update,
        getCurrent
    }
}

export default useUser