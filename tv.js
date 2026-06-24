import { auth, db } from "./firebase.js";

import {
    doc,
    setDoc
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const apiKey = "35f0bf40a7aebc0072f422a82833e4c6";

const params = new URLSearchParams(window.location.search);

const tvId = params.get("id");

const tvHero = document.getElementById("tvHero");
const tvPoster = document.getElementById("tvPoster");
const tvTitle = document.getElementById("tvTitle");
const tvRating = document.getElementById("tvRating");
const tvRelease = document.getElementById("tvRelease");
const tvOverview = document.getElementById("tvOverview");
const tvRuntime = document.getElementById("tvRuntime");
const tvGenres = document.getElementById("tvGenres");
const similarMovies = document.getElementById("similarMovies");
const watchTrailer = document.getElementById("watchTrailer");
const watchlistBtn = document.getElementById("watchlistBtn");

async function getMovieDetails() {

    const res = await fetch(
        `https://api.themoviedb.org/3/tv/${tvId}?api_key=${apiKey}`
    );

    window.currentMovie = await res.json();
    const movie = window.currentMovie;

    // Backdrop
    tvHero.style.backgroundImage =
        `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

    // Poster
    tvPoster.src =
        `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    // Info
    tvTitle.textContent = movie.name;

    tvRating.textContent =
        `⭐ ${movie.vote_average.toFixed(1)}`;

    tvRelease.textContent =
        `📅 ${movie.first_air_date}`;

    tvRuntime.textContent =
        `⏱ ${movie.number_of_season} Seasons`;

    tvOverview.textContent =
        movie.overview;

    // Genres
    tvGenres.innerHTML = "";

    movie.genres.forEach(genre => {

        const span = document.createElement("span");

        span.classList.add("genre");

        span.textContent = genre.name;

        tvGenres.appendChild(span);

    });

    // Load similar movies
    getSimilarMovies();
}
async function getSimilarMovies() {

    const res = await fetch(
        `https://api.themoviedb.org/3/tv/${tvId}/similar?api_key=${apiKey}`
    );

    const data = await res.json();

    similarMovies.innerHTML = "";

    data.results.slice(0, 10).forEach(movie => {

        const card = document.createElement("img");

        card.src =
            `https://image.tmdb.org/t/p/w300${movie.poster_path}`;

        card.alt = movie.title;

        card.style.cursor = "pointer";

        card.addEventListener("click", () => {

           window.location.href =
                `tv.html?id=${movie.id}`;

        });

        similarMovies.appendChild(card);

    });

}
async function loadTrailer() {

    const res = await fetch(
        `https://api.themoviedb.org/3/tv/${tvId}/videos?api_key=${apiKey}`
    );

    const data = await res.json();

    const trailer = data.results.find(
        video =>
            video.type === "Trailer" &&
            video.site === "YouTube"
    );

    if(trailer){

        watchTrailer.addEventListener("click", () => {

            window.open(
                `https://www.youtube.com/watch?v=${trailer.key}`,
                "_blank"
            );

        });

    }
}
watchlistBtn?.addEventListener("click", async () => {

    const user = auth.currentUser;

    if (!user) {

        alert("Please login first");

        window.location.href = "login.html";
        return;
    }

    try {

        await setDoc(
            doc(
                db,
                "users",
                user.uid,
                "watchlist",
                tvId
            ),
            {
                tvId: currentMovie.name,
                title: currentMovie.name,
                poster: currentMovie.poster_path,
                rating: currentMovie.vote_average,
                addedAt: new Date().toISOString()
            }
        );

        alert("Added to Watchlist");

    } catch(error) {

        console.error(error);
        alert("Failed to save watchlist");
    }

});
getMovieDetails();
loadTrailer();