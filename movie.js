import { auth, db } from "./firebase.js";

import {
    doc,
    setDoc,
    getDoc,
    deleteDoc
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const apiKey = "35f0bf40a7aebc0072f422a82833e4c6";

const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

// Elements
const movieHero = document.getElementById("movieHero");
const moviePoster = document.getElementById("moviePoster");
const movieTitle = document.getElementById("movieTitle");
const movieRating = document.getElementById("movieRating");
const movieRelease = document.getElementById("movieRelease");
const movieRuntime = document.getElementById("movieRuntime");
const movieGenres = document.getElementById("movieGenres");
const movieOverview = document.getElementById("movieOverview");

const similarMovies = document.getElementById("similarMovies");

const watchTrailer = document.getElementById("watchTrailer");
const watchlistBtn = document.getElementById("watchlistBtn");


// ----------------------
// Watchlist Button State
// ----------------------

async function updateWatchlistButton() {

    const user = auth.currentUser;

    if (!user) return;

    const movieRef = doc(
        db,
        "users",
        user.uid,
        "watchlist",
        String(movieId)
    );

    const snapshot = await getDoc(movieRef);

    if (snapshot.exists()) {

        watchlistBtn.textContent = "✔ In Watchlist";
        watchlistBtn.dataset.saved = "true";

    } else {

        watchlistBtn.textContent = "+ Add to Watchlist";
        watchlistBtn.dataset.saved = "false";

    }

}


// ----------------------
// Movie Details
// ----------------------

async function getMovieDetails() {

    try {

        const res = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
        );

        if (!res.ok) {
            throw new Error("Failed to fetch movie.");
        }

        const movie = await res.json();

        window.currentMovie = movie;

        movieHero.style.backgroundImage =
            `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

        moviePoster.src =
            `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

        movieTitle.textContent = movie.title;

        movieRating.textContent =
            `⭐ ${movie.vote_average.toFixed(1)}`;

        movieRelease.textContent =
            `📅 ${movie.release_date}`;

        movieRuntime.textContent =
            `⏱ ${movie.runtime} mins`;

        movieOverview.textContent =
            movie.overview || "No overview available.";

        movieGenres.innerHTML = "";

        movie.genres.forEach(genre => {

            const span = document.createElement("span");

            span.classList.add("genre");

            span.textContent = genre.name;

            movieGenres.appendChild(span);

        });

        getSimilarMovies();

    }

    catch (error) {

        console.error(error);

        alert("Failed to load movie.");

    }

}


// ----------------------
// Similar Movies
// ----------------------

async function getSimilarMovies() {

    const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}`
    );

    const data = await res.json();

    similarMovies.innerHTML = "";

    data.results.slice(0, 10).forEach(movie => {

        if (!movie.poster_path) return;

        const card = document.createElement("img");

        card.src =
            `https://image.tmdb.org/t/p/w300${movie.poster_path}`;

        card.alt = movie.title;

        card.style.cursor = "pointer";

        card.addEventListener("click", () => {

            window.location.href =
                `movie.html?id=${movie.id}`;

        });

        similarMovies.appendChild(card);

    });

}


// ----------------------
// Trailer
// ----------------------

async function loadTrailer() {

    try {

        const res = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`
        );

        const data = await res.json();

        const trailer = data.results.find(video =>

            video.type === "Trailer" &&
            video.site === "YouTube"

        );

        if (trailer) {

            watchTrailer.onclick = () => {

                window.open(
                    `https://www.youtube.com/watch?v=${trailer.key}`,
                    "_blank"
                );

            };

        }

    }

    catch (error) {

        console.error(error);

    }

}


// ----------------------
// Watchlist
// ----------------------

watchlistBtn?.addEventListener("click", async () => {

    const user = auth.currentUser;

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    const movieRef = doc(
        db,
        "users",
        user.uid,
        "watchlist",
        String(movieId)
    );

    // Remove
    if (watchlistBtn.dataset.saved === "true") {

        await deleteDoc(movieRef);

        watchlistBtn.textContent =
            "+ Add to Watchlist";

        watchlistBtn.dataset.saved =
            "false";

        return;

    }

    // Add
    const movie = window.currentMovie;

    if (!movie) {

        alert("Movie is still loading...");
        return;

    }

    await setDoc(movieRef, {

        movieId: movie.id,
        title: movie.title,
        poster: movie.poster_path,
        rating: movie.vote_average,
        type: "movie",
        addedAt: new Date().toISOString()

    });

    watchlistBtn.textContent =
        "✔ In Watchlist";

    watchlistBtn.dataset.saved =
        "true";

});


// ----------------------
// Start
// ----------------------

getMovieDetails();

loadTrailer();

auth.onAuthStateChanged((user) => {

    if (user) {

        updateWatchlistButton();

    }

});