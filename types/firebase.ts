// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, CollectionReference, DocumentData, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeeHPTErGx4v-MaxBannERD-UgdUSX5cM",
  authDomain: "travelmobile-48740.firebaseapp.com",
  projectId: "travelmobile-48740",
  storageBucket: "travelmobile-48740.appspot.com",
  messagingSenderId: "389598400693",
  appId: "1:389598400693:web:5d121501c18e00c3f06efc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const createCollection = <T = DocumentData>(collectionName: string) =>
  collection(getFirestore(), collectionName) as CollectionReference<T>;
export default app;
