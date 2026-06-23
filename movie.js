import { auth, db } from "./firebase.js";

import {
    doc,
    setDoc
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const apiKey = "35f0bf40a7aebc0072f422a82833e4c6";

const params = new URLSearchParams(window.location.search);

const movieId = params.get("id");

const movieHero = document.getElementById("movieHero");
const moviePoster = document.getElementById("moviePoster");
const movieTitle = document.getElementById("movieTitle");
const movieRating = document.getElementById("movieRating");
const movieRelease = document.getElementById("movieRelease");
const movieOverview = document.getElementById("movieOverview");
const movieRuntime = document.getElementById("movieRuntime");
const movieGenres = document.getElementById("movieGenres");
const similarMovies = document.getElementById("similarMovies");
const watchTrailer = document.getElementById("watchTrailer");
const watchlistBtn = document.getElementById("watchlistBtn");

async function getMovieDetails() {

    const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
    );

    window.currentMovie = await res.json();
    const movie = window.currentMovie;

    // Backdrop
    movieHero.style.backgroundImage =
        `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

    // Poster
    moviePoster.src =
        `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    // Info
    movieTitle.textContent = movie.title;

    movieRating.textContent =
        `⭐ ${movie.vote_average.toFixed(1)}`;

    movieRelease.textContent =
        `📅 ${movie.release_date}`;

    movieRuntime.textContent =
        `⏱ ${movie.runtime} mins`;

    movieOverview.textContent =
        movie.overview;

    // Genres
    movieGenres.innerHTML = "";

    movie.genres.forEach(genre => {

        const span = document.createElement("span");

        span.classList.add("genre");

        span.textContent = genre.name;

        movieGenres.appendChild(span);

    });

    // Load similar movies
    getSimilarMovies();
}
async function getSimilarMovies() {

    const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}`
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
                `movie.html?id=${movie.id}`;

        });

        similarMovies.appendChild(card);

    });

}
async function loadTrailer() {

    const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`
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
                movieId
            ),
            {
                movieId: currentMovie.id,
                title: currentMovie.title,
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