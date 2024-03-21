// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBSFgyO9FbIMnY5ybhUpq423vHOY9H2oxU",
    authDomain: "natra-32152.firebaseapp.com",
    projectId: "natra-32152",
    storageBucket: "natra-32152.appspot.com",
    messagingSenderId: "899128495015",
    appId: "1:899128495015:web:1fd7ac11259de2ec968482",
    measurementId: "G-HQM67YBLHP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);