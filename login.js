// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// Firebase Config
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
const auth = getAuth(app);

// Password eye toggle
const password = document.getElementById("password");
const eye = document.getElementById("eye-icon");

eye.addEventListener("click", () => {
    if(password.type === "password"){
        password.type = "text";
        eye.classList.replace("fa-eye","fa-eye-slash");
    } else {
        password.type = "password";
        eye.classList.replace("fa-eye-slash","fa-eye");
    }
});

// Google Login
document.getElementById("googleLogin")
.addEventListener("click", async () => {

    try {

        const provider = new GoogleAuthProvider();

        const result =
        await signInWithPopup(auth, provider);

        alert(
            `Welcome ${result.user.displayName}`
        );

        window.location.href = "index.html";

    } catch(error) {

        console.error(error);
        alert(error.message);

    }

});

// Email Login
document.getElementById("loginForm")
.addEventListener("submit", async(e) => {

    e.preventDefault();

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        window.location.href = "index.html";

    } catch(error) {

        alert(error.message);

    }

});