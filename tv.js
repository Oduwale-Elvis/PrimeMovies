import { auth, db } from "./firebase.js";

import {
    doc,
    setDoc
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const apiKey = "35f0bf40a7aebc0072f422a82833e4c6";

const params = new URLSearchParams(window.location.search);

const tvId = params.get("id");

const tvHero = document.getElementById("movieHero");
const tvPoster = document.getElementById("moviePoster");
const tvTitle = document.getElementById("movieTitle");
const tvRating = document.getElementById("movieRating");
const tvRelease = document.getElementById("movieRelease");
const tvOverview = document.getElementById("movieOverview");
const tvRuntime = document.getElementById("movieRuntime");
const tvGenres = document.getElementById("movieGenres");
const similarMovies = document.getElementById("similarMovies");
const watchTrailer = document.getElementById("watchTrailer");
const watchlistBtn = document.getElementById("watchlistBtn");

async function getTVDetails() {

    if (!tvId) {
        alert("Missing TV id");
        return;
    }

    try {

        const res = await fetch(
            `https://api.themoviedb.org/3/tv/${tvId}?api_key=${apiKey}`
        );

        if (!res.ok) {
            throw new Error(`TMDB request failed: ${res.status}`);
        }

        window.currentShow = await res.json();

        const show = window.currentShow;

        // Backdrop
        tvHero.style.backgroundImage =
            `url(https://image.tmdb.org/t/p/original${show.backdrop_path})`;

        // Poster
        tvPoster.src =
            `https://image.tmdb.org/t/p/w500${show.poster_path}`;

        // Title
        tvTitle.textContent = show.name;

        // Rating
        tvRating.textContent =
            `⭐ ${show.vote_average.toFixed(1)}`;

        // Release Date
        tvRelease.textContent =
            `📅 ${show.first_air_date}`;

        // Runtime / Seasons
        const runtimeMinutes =
            show.episode_run_time &&
            show.episode_run_time.length > 0
                ? show.episode_run_time[0]
                : null;

        tvRuntime.textContent =
            runtimeMinutes
                ? `⏱ ${runtimeMinutes} mins`
                : `📺 ${show.number_of_seasons} Seasons`;

        // Overview
        tvOverview.textContent =
            show.overview || "No overview available.";

        // Genres
        tvGenres.innerHTML = "";

        show.genres.forEach(genre => {

            const span = document.createElement("span");

            span.classList.add("genre");

            span.textContent = genre.name;

            tvGenres.appendChild(span);

        });

        await getSimilarMovies();

    } catch(error) {

        console.error(error);

        alert("Failed to load TV show details");

    }

}
async function getSimilarMovies() {
    const res = await fetch(
        `https://api.themoviedb.org/3/tv/${tvId}/similar?api_key=${apiKey}`
    );

    const data = await res.json();

    similarMovies.innerHTML = "";

    data.results.slice(0, 10).forEach(show => {

        const card = document.createElement("img");

        if (!show.poster_path) return;

        card.src =
        `https://image.tmdb.org/t/p/w300${show.poster_path}`;

        card.alt = show.name;


        card.style.cursor = "pointer";

        card.addEventListener("click", () => {

           window.location.href =
                `tv.html?id=${show.id}`;


        });

        similarMovies.appendChild(card);

    });

}
async function loadTrailer() {
    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/tv/${tvId}/videos?api_key=${apiKey}`
        );
        if (!res.ok) throw new Error(`TMDB trailer request failed: ${res.status}`);

        const data = await res.json();

        const trailer = data.results.find(
            video =>
                video.type === "Trailer" &&
                video.site === "YouTube"
        );

        if (trailer) {
            watchTrailer?.addEventListener("click", () => {
                window.open(
                    `https://www.youtube.com/watch?v=${trailer.key}`,
                    "_blank"
                );
            });
        }
    } catch (e) {
        console.error(e);
    }
}
watchlistBtn?.addEventListener("click", async () => {
    const user = auth.currentUser;

    if (!user) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    const show = window.currentShow;
    if (!show) {
        alert("Loading show details...");
        return;
    }

    try {
        await setDoc(
            doc(
                db,
                "users",
                user.uid,
                "watchlist",
                String(tvId)
            ),
            {
                tvId: show.id,
                title: show.name,
                poster: show.poster_path,
                rating: show.vote_average,
                type: "tv",
                addedAt: new Date().toISOString()
            }
        );

        alert("Added to Watchlist");

    } catch (error) {
        console.error(error);
        alert("Failed to save watchlist");
    }

});
getTVDetails();
loadTrailer();