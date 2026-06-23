import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const watchlistGrid =
document.getElementById("watchlistGrid");

async function loadWatchlist() {

    const user = auth.currentUser;

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    const snapshot = await getDocs(
        collection(
            db,
            "users",
            user.uid,
            "watchlist"
        )
    );

    watchlistGrid.innerHTML = "";

    snapshot.forEach(doc => {

        const movie = doc.data();

        const card =
        document.createElement("div");

        card.classList.add("movie-card");

        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster}" alt="${movie.title}">

            <h3>${movie.title}</h3>

            <p>⭐ ${movie.rating.toFixed(1)}</p>
        `;

        card.addEventListener("click", () => {

            window.location.href =
            `movie.html?id=${movie.movieId}`;

        });

        watchlistGrid.appendChild(card);

    });

}

auth.onAuthStateChanged((user) => {

    if(user){
        loadWatchlist();
    }

});