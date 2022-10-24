import { uuidv4 } from "@firebase/util";
import { addDoc, query, getDocs, where } from "firebase/firestore";
import { getDownloadURL } from "firebase/storage";
import { useQuery, useMutation } from "react-query";
import { createCollection } from "../vendors/Firebase";
import { ITripPhoto } from "../types/Trips";
import { uploadImage } from "../utils/images";
import useFirebaseTrip from "./useFirebaseTrip";


interface IUploadTripPhotoMutation {
    tempUri: string;
    metadata: Omit<Omit<ITripPhoto, 'image_url'>, 'trip_id'>;
}

const tripPhotoCol = createCollection<ITripPhoto>("tripPhotos");

const useTripPhotos = () => {
    const {query: { data }} = useFirebaseTrip();

    const queryKey = ['trips', data?.id, 'photos'];
    
    const upload = useMutation(async ({tempUri, metadata}: IUploadTripPhotoMutation) => {
        const tripId = data?.id;
        if(!tripId) return;
        const path = `trips/${tripId}/photos/${uuidv4()}`
        const uploadResult = await uploadImage(path, tempUri);

        if(typeof uploadResult === "undefined"){
            throw new Error("Error uploading image")
        }
        const uploadUrl = await getDownloadURL(uploadResult)

        const payload: ITripPhoto = {
            ...metadata,
            trip_id: tripId,
            image_url: uploadUrl,
        }
        return await addDoc(tripPhotoCol, payload);
    })


    const getAll = useQuery(queryKey, async () => {
        const q = query(tripPhotoCol, where("trip_id", "==", data?.id));
        const docs = await getDocs(q);

        return docs.docs.map(d => ({
            id: d.id,
            ...d.data()
        }))
    }, {
        enabled: typeof data?.id !== "undefined"
    });

    return {upload, getAll}
}


export default useTripPhotos;