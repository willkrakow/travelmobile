import React from 'react'
import {addDoc, updateDoc, getDocs, where, query as search } from 'firebase/firestore'
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import app, { createCollection } from '../types/firebase'
import { uuidv4 } from '@firebase/util'
import { ITrip } from '../types/Trips'
import useUserId from './useUserId'

const tripCollection = createCollection<ITrip>("trips");

const useFirebaseTrips = () => {
  const userId = useUserId();
    const client = useQueryClient()
    const create = useMutation(async (data: any) => {
        try {
            const docRef = await addDoc(tripCollection, data)
            const imageRef = ref(getStorage(app), `${docRef.id}/${uuidv4()}`)
            const blob = await new Promise<Blob>((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.onload = function () {
                resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
              };
              xhr.onerror = function () {
                reject(new TypeError("Network request failed")); // error occurred, rejecting
              };
              xhr.responseType = "blob"; // use BlobModule's UriHandler
              xhr.open("GET", data.cover_image.uri, true); // fetch the blob from uri in async mode
              xhr.send(null); // no initial data
            });
            try {
                await uploadBytesResumable(imageRef, blob as Blob)
                const url = await getDownloadURL(imageRef)
                
                await updateDoc(docRef, {cover_image_url: url})
            } catch(err){
                console.log(err)
            }
        } catch(err){
            console.log(err)
        }
    }, {
        onMutate: () => client.invalidateQueries('trips')
    });

    const query = useQuery("trips", async () => {        
        const q = search(tripCollection, where("user_id", "==", userId));
        const result = await getDocs(q)
        const docs = result.docs.map(d => ({
            id: d.id,
            ...d.data() as Omit<ITrip, 'id'>
        }))
        return docs
    }, {
        select: (d) => d,
    })

    return {create, query}
}

export default useFirebaseTrips
