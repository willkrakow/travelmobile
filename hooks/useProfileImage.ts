import { updateProfile, getAuth } from "firebase/auth";
import { uploadImage } from "../utils/images";
import {uuidv4} from '@firebase/util'
import { getDownloadURL } from "firebase/storage";

const useProfileImage = () => {
    const auth = getAuth();


    const imageUrl =
      auth.currentUser?.photoURL ||
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";


    const update = async (tempUri: string) => {
        if (auth.currentUser == null) return;

        const path = `users/${auth.currentUser.uid}/${uuidv4()}`
        const uploadResult = await uploadImage(path, tempUri);
        if(typeof uploadResult === 'undefined') {
            throw new Error("Error uploading image")
        }
        const photoURL = await getDownloadURL(uploadResult)
        await updateProfile(auth.currentUser, { photoURL })
    }


    return {
        imageUrl,
        update,
    }
}

export default useProfileImage