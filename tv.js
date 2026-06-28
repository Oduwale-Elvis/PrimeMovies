import { auth, db } from "./firebase.js";

import {
    doc,
    setDoc,
    getDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const apiKey = "35f0bf40a7aebc0072f422a82833e4c6";

const params = new URLSearchParams(window.location.search);
const tvId = params.get("id");

// Elements
const tvHero = document.getElementById("movieHero");
const tvPoster = document.getElementById("moviePoster");
const tvTitle = document.getElementById("movieTitle");
const tvRating = document.getElementById("movieRating");
const tvRelease = document.getElementById("movieRelease");
const tvRuntime = document.getElementById("movieRuntime");
const tvGenres = document.getElementById("movieGenres");
const tvOverview = document.getElementById("movieOverview");

const similarMovies = document.getElementById("similarMovies");

const watchTrailer = document.getElementById("watchTrailer");
const watchlistBtn = document.getElementById("watchlistBtn");


// ----------------------
// Watchlist Button State
// ----------------------

async function updateWatchlistButton() {

    const user = auth.currentUser;

    if (!user) return;

    const showRef = doc(
        db,
        "users",
        user.uid,
        "watchlist",
        String(tvId)
    );

    const snapshot = await getDoc(showRef);

    if (snapshot.exists()) {

        watchlistBtn.textContent = "✔ In Watchlist";
        watchlistBtn.dataset.saved = "true";

    } else {

        watchlistBtn.textContent = "+ Add to Watchlist";
        watchlistBtn.dataset.saved = "false";

    }

}
async function saveToHistory() {

    const user = auth.currentUser;

    if (!user) return;

    const show = window.currentShow;

    if (!show) return;

    await setDoc(

        doc(
            db,
            "users",
            user.uid,
            "history",
            String(show.id)
        ),

        {
            tvId: show.id,
            title: show.name,
            poster: show.poster_path,
            rating: show.vote_average,
            type: "tv",
            viewedAt: new Date().toISOString()
        }

    );

}


// ----------------------
// TV Details
// ----------------------

async function getTVDetails() {

    try {

        const res = await fetch(
            `https://api.themoviedb.org/3/tv/${tvId}?api_key=${apiKey}`
        );

        const show = await res.json();

        window.currentShow = show;

        tvHero.style.backgroundImage =
            `url(https://image.tmdb.org/t/p/original${show.backdrop_path})`;

        tvPoster.src =
            `https://image.tmdb.org/t/p/w500${show.poster_path}`;

        tvTitle.textContent = show.name;

        tvRating.textContent =
            `⭐ ${show.vote_average.toFixed(1)}`;

        tvRelease.textContent =
            `📅 ${show.first_air_date}`;

        if (show.episode_run_time.length > 0) {

            tvRuntime.textContent =
                `⏱ ${show.episode_run_time[0]} mins`;

        } else {

            tvRuntime.textContent =
                `📺 ${show.number_of_seasons} Seasons`;

        }

        tvOverview.textContent =
            show.overview;

        tvGenres.innerHTML = "";

        show.genres.forEach(genre => {

            const span =
            document.createElement("span");

            span.classList.add("genre");

            span.textContent = genre.name;

            tvGenres.appendChild(span);

        });
        getSimilarTV();
        saveToHistory();

    }

    catch(error){

        console.error(error);

    }

}



// ----------------------
// Similar TV Shows
// ----------------------

async function getSimilarTV() {

    const res = await fetch(
        `https://api.themoviedb.org/3/tv/${tvId}/similar?api_key=${apiKey}`
    );

    const data = await res.json();

    similarMovies.innerHTML = "";

    data.results.slice(0,10).forEach(show=>{

        if(!show.poster_path) return;

        const card =
        document.createElement("img");

        card.src =
        `https://image.tmdb.org/t/p/w300${show.poster_path}`;

        card.alt =
        show.name;

        card.style.cursor =
        "pointer";

        card.addEventListener("click",()=>{

            window.location.href =
            `tv.html?id=${show.id}`;

        });

        similarMovies.appendChild(card);

    });

}



// ----------------------
// Trailer
// ----------------------

async function loadTrailer(){

    const res = await fetch(
        `https://api.themoviedb.org/3/tv/${tvId}/videos?api_key=${apiKey}`
    );

    const data = await res.json();

    const trailer =
    data.results.find(video=>

        video.type==="Trailer" &&
        video.site==="YouTube"

    );

    if(trailer){

        watchTrailer.onclick=()=>{

            window.open(

                `https://www.youtube.com/watch?v=${trailer.key}`,

                "_blank"

            );

        };

    }

}



// ----------------------
// Watchlist
// ----------------------

watchlistBtn.addEventListener("click", async ()=>{

    const user =
    auth.currentUser;

    if(!user){

        window.location.href="login.html";

        return;

    }

    const showRef = doc(

        db,

        "users",

        user.uid,

        "watchlist",

        String(tvId)

    );


    // Remove

    if(watchlistBtn.dataset.saved==="true"){

        await deleteDoc(showRef);

        watchlistBtn.textContent =
        "+ Add to Watchlist";

        watchlistBtn.dataset.saved =
        "false";

        return;

    }


    // Add

    const show =
    window.currentShow;

    if(!show){

        alert("Still loading...");

        return;

    }

    await setDoc(showRef,{

        tvId:show.id,

        title:show.name,

        poster:show.poster_path,

        rating:show.vote_average,

        type:"tv",

        addedAt:new Date().toISOString()

    });


    watchlistBtn.textContent =
    "✔ In Watchlist";

    watchlistBtn.dataset.saved =
    "true";

});



// ----------------------
// Start
// ----------------------

getTVDetails();

loadTrailer();

auth.onAuthStateChanged(user=>{

    if(user){

        updateWatchlistButton();

    }

});