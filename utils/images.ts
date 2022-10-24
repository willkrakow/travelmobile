import { getDownloadURL, StorageReference, ref, getStorage, uploadBytesResumable } from "firebase/storage"
import { GOOGLE_MAPS_API_KEY } from "../constants/Api";
import app from "../types/firebase";

export const imageSrc = (originalRef: StorageReference, size: string, format: "webp" | "png" = "png") => {
    const resizedPath = originalRef.fullPath.replace(".", `__${size}.${format}`);
    const resizedUrl = getDownloadURL(ref(getStorage(app), resizedPath))

    return resizedUrl
}

export const resizedImage = (imageUri: string, format: "webp" | "png" = "png", width: number = 400, height: number = 300) => {
  return imageUri.replace(".", `__${width}x${height}.${format}`);
}


export const placePhoto = (photoReference: string, maxWidth: number = 400) => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
};


export const uploadImage = async (path: string, tempUri: string) => {
  const imageRef = ref(getStorage(app), path);
  const blob = await new Promise<Blob>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
    };
    xhr.onerror = function () {
      reject(new TypeError("Network request failed")); // error occurred, rejecting
    };
    xhr.responseType = "blob"; // use BlobModule's UriHandler
    xhr.open("GET", tempUri, true); // fetch the blob from uri in async mode
    xhr.send(null); // no initial data
  });
  try {
    await uploadBytesResumable(imageRef, blob as Blob);
    return imageRef
  } catch (err) {
    console.log(err);
  }
}