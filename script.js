/* ======================
   TMDB API
====================== */
const apiKey = "35f0bf40a7aebc0072f422a82833e4c6";

const hero = document.querySelector(".hero");
const heroTitle = document.getElementById("hero-title");
const heroDescription = document.getElementById("hero-description");
const heroTag = document.getElementById("hero-tag");

const trendingMovies = document.getElementById("trendingMovies");
const popularMovies = document.getElementById("popularMovies");
const topRatedMovies = document.getElementById("topRatedMovies");
const actionMovies = document.getElementById("actionMovies");
const searchInput = document.getElementById("searchInput");
const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");
const trailerModal = document.getElementById("trailerModal");
const trailerVideo = document.getElementById("trailerVideo");
const closeTrailer = document.getElementById("closeTrailer");

let heroMovies = [];
let currentHeroIndex = 0;

/* ======================
   HERO SECTION
====================== */

function initHero() {
    if (heroMovies.length === 0) return;

    const movie = heroMovies[0];

    hero.style.backgroundImage = `
        linear-gradient(to right, rgba(11,11,11,0.95), rgba(11,11,11,0.45), rgba(11,11,11,0.2)),
        url(https://image.tmdb.org/t/p/original${movie.backdrop_path})
    `;

    heroTitle.textContent = movie.title;
    heroDescription.textContent = movie.overview;
    heroTag.textContent = "🔥 TRENDING NOW";
}

function updateHero() {
    const movie = heroMovies[currentHeroIndex];

    hero.style.backgroundImage = `
        linear-gradient(to right, rgba(11,11,11,0.95), rgba(11,11,11,0.45), rgba(11,11,11,0.2)),
        url(https://image.tmdb.org/t/p/original${movie.backdrop_path})
    `;

    heroTitle.textContent = movie.title;
    heroDescription.textContent = movie.overview;
    heroTag.textContent = "🔥 TRENDING NOW";
}

function startHeroSlider() {
    setInterval(() => {
        currentHeroIndex = (currentHeroIndex + 1) % heroMovies.length;
        updateHero();
    }, 5000);
}

/* ======================
   FETCH HERO + TRENDING
====================== */

async function getHeroMovies() {
    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
        );

        const data = await res.json();
        heroMovies = data.results.slice(0, 5);

        initHero();
        startHeroSlider();

    } catch (err) {
        console.error("Hero error:", err);
    }
}

async function getTrendingMovies() {
    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
        );

        const data = await res.json();
        showMovies(data.results);

    } catch (err) {
        console.error("Trending error:", err);
    }
}

/* ======================
   DISPLAY MOVIES
====================== */


function showMovies(movies) {
    trendingMovies.innerHTML = "";

    movies.forEach(movie => {

        const card = document.createElement("div");

        card.classList.add("movie-card");

        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <div class="movie-overlay">
                <button class="play-btn">
                    ▶
                </button>
                <h3>${movie.title}</h3>
                <p>⭐ ${movie.vote_average.toFixed(1)}</p>
            </div>
        `;

        card.addEventListener("click", () => {
            window.location.href = `movie.html?id=${movie.id}`;
        });

        trendingMovies.appendChild(card);
    });
}
function displayMovieRow(container, movies) {

    container.innerHTML = "";

    movies.forEach(movie => {

        const card = document.createElement("div");

        card.classList.add("movie-card");

        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">

            <div class="movie-overlay">
                <button class="play-btn">▶</button>

                <h3>${movie.title}</h3>

                <p>⭐ ${movie.vote_average.toFixed(1)}</p>
            </div>
        `;

        card.addEventListener("click", () => {
            window.location.href = `movie.html?id=${movie.id}`;
        });

        container.appendChild(card);

    });

}

/*Popular Movies */
async function getPopularMovies() {

    try {

        const res = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
        );

        const data = await res.json();

        displayMovieRow(popularMovies, data.results);

    } catch(err) {

        console.error(err);

    }

}
/*Top Rated Movies*/
async function getTopRatedMovies() {

    try {

        const res = await fetch(
            `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`
        );

        const data = await res.json();

        displayMovieRow(topRatedMovies, data.results);

    } catch(err) {

        console.error(err);

    }

}
/*Action Movies*/
async function getActionMovies() {

    try {

        const res = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=28`
        );

        const data = await res.json();

        displayMovieRow(actionMovies, data.results);

    } catch(err) {

        console.error(err);

    }

}
/* ======================
   SEARCH
====================== */

searchInput?.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll(".movie-card");

    cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(value) ? "flex" : "none";
    });
});

/* ======================
   PROFILE DROPDOWN
====================== */

profileBtn?.addEventListener("click", () => {
    profileDropdown.classList.toggle("active");
});

window.addEventListener("click", (e) => {
    if (
        profileBtn &&
        profileDropdown &&
        !profileBtn.contains(e.target) &&
        !profileDropdown.contains(e.target)
    ) {
        profileDropdown.classList.remove("active");
    }
});
document.addEventListener("scroll", () => {

    profileDropdown?.classList.remove("active");

});
/* ======================
   TRAILER MODAL
====================== */

document.addEventListener("click", (e) => {
    const btn = e.target.closest(".play-btn");

    if (btn) {
        trailerModal.classList.add("active");
        trailerVideo.src = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
    }
});

closeTrailer?.addEventListener("click", () => {
    trailerModal.classList.remove("active");
    trailerVideo.src = "";
});

window.addEventListener("click", (e) => {
    if (e.target === trailerModal) {
        trailerModal.classList.remove("active");
        trailerVideo.src = "";
    }
});

/* ======================
   INIT APP
====================== */

getHeroMovies();
getTrendingMovies();
getPopularMovies();
getTopRatedMovies();
getActionMovies();

import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

    if(user){

        profileBtn.innerHTML = `
            <img
                src="${user.photoURL}"
                style="
                    width:100%;
                    height:100%;
                    border-radius:50%;
                    object-fit:cover;
                "
            >
        `;

    }

});

const logoutBtn =
document.getElementById("logoutBtn");

logoutBtn?.addEventListener("click",
async () => {

    await signOut(auth);

    window.location.href =
    "login.html";

});