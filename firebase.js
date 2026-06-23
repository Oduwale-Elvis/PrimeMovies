// Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyC4ljA_u_p_ISplpNaat99v-j8WgUwaR9Q",
  authDomain: "primemovies-171bb.firebaseapp.com",
  projectId: "primemovies-171bb",
  storageBucket: "primemovies-171bb.firebasestorage.app",
  messagingSenderId: "115704616646",
  appId: "1:115704616646:web:395df9e05b90753a47a9c7",
  measurementId: "G-DXQL5X59VF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


