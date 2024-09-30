// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyB-N28JzMwi6lSpkknYrE974-nzSrkrkX8",
  authDomain: "skillhub-cbaab.firebaseapp.com",
  projectId: "skillhub-cbaab",
  storageBucket: "skillhub-cbaab.appspot.com",
  messagingSenderId: "917436732711",
  appId: "1:917436732711:web:7ee353f2620fec74328502",
  measurementId: "G-42FC60VM5G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app); // Khởi tạo Firestore

export { firestore }; 
