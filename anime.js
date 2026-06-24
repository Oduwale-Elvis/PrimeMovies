const apiKey = "35f0bf40a7aebc0072f422a82833e4c6"; 

const trendingAnime =
document.getElementById("trendingAnime");

const popularAnime =
document.getElementById("popularAnime");

const topRatedAnime =
document.getElementById("topRatedAnime");

function displayAnime(container, shows) {

    container.innerHTML = "";

    shows.forEach(show => {

        if (!show.poster_path) return;

        const card =
        document.createElement("div");

        card.classList.add("movie-card");

        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${show.poster_path}">
        `;

        card.addEventListener("click", () => {

            window.location.href =
            `tv.html?id=${show.id}`;

        });

        container.appendChild(card);

    });

}

async function getTrendingAnime() {

    const res = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=16&sort_by=popularity.desc`
    );

    const data = await res.json();

    displayAnime(
        trendingAnime,
        data.results
    );

}

async function getPopularAnime() {

    const res = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=16`
    );

    const data = await res.json();

    displayAnime(
        popularAnime,
        data.results
    );

}

async function getTopRatedAnime() {

    const res = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=16&sort_by=vote_average.desc&vote_count.gte=100`
    );

    const data = await res.json();

    displayAnime(
        topRatedAnime,
        data.results
    );

}

getTrendingAnime();
getPopularAnime();
getTopRatedAnime();