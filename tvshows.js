const apiKey = "35f0bf40a7aebc0072f422a82833e4c6";

const popularTV =
document.getElementById("popularTV");

const topRatedTV =
document.getElementById("topRatedTV");

const trendingTV =
document.getElementById("trendingTV");

function displayShows(container, shows) {

    container.innerHTML = "";

    shows.forEach(show => {

        const card =
        document.createElement("div");

        card.classList.add("movie-card");

        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}">
        `;

        container.appendChild(card);

    });

}

async function getPopularTV() {

    const res = await fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}`
    );

    const data = await res.json();

    displayShows(
        popularTV,
        data.results
    );

}

async function getTopRatedTV() {

    const res = await fetch(
        `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}`
    );

    const data = await res.json();

    displayShows(
        topRatedTV,
        data.results
    );

}

async function getTrendingTV() {

    const res = await fetch(
        `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`
    );

    const data = await res.json();

    displayShows(
        trendingTV,
        data.results
    );

}

getPopularTV();
getTopRatedTV();
getTrendingTV();