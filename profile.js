import { auth, db } from "./firebase.js";

import {

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {

    collection,
    getDocs

} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const profileImage =
document.getElementById("profileImage");

const profileName =
document.getElementById("profileName");

const profileEmail =
document.getElementById("profileEmail");

const watchlistCount =
document.getElementById("watchlistCount");

const historyCount =
document.getElementById("historyCount");

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        window.location.href="login.html";
        return;

    }

    profileName.textContent =
    user.displayName || "PrimeMovies User";

    profileEmail.textContent =
    user.email;

    if(user.photoURL){

        profileImage.src =
        user.photoURL;

    }

    const watchlistSnapshot =
    await getDocs(

        collection(
            db,
            "users",
            user.uid,
            "watchlist"
        )

    );

    watchlistCount.textContent =
    watchlistSnapshot.size;

    /* Recently Viewed */

    const historySnapshot =
    await getDocs(

        collection(
            db,
            "users",
            user.uid,
            "history"
        )

    );

    historyCount.textContent =
    historySnapshot.size;

});