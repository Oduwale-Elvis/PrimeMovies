const apiKey = "35f0bf40a7aebc0072f422a82833e4c6";

const trendingMovies =
document.getElementById("trendingMovies");

const nowPlayingMovies =
document.getElementById("nowPlayingMovies");

const upcomingMovies =
document.getElementById("upcomingMovies");

const popularTVShows =
document.getElementById("popularTVShows");

function displayMovies(container, movies) {

    container.innerHTML = "";

    movies.forEach(movie => {

        const card =
        document.createElement("div");

        card.classList.add("movie-card");

        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="">
        `;

        card.addEventListener("click", () => {

            window.location.href =
            `movie.html?id=${movie.id}`;

        });

        container.appendChild(card);

    });

}

function displayTVShows(container, shows) {

    container.innerHTML = "";

    shows.forEach(show => {

        const card = document.createElement("div");

        card.classList.add("movie-card");

        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}">
        `;

        card.addEventListener("click", () => {

            window.location.href =
            `tv.html?id=${show.id}`;

        });

        container.appendChild(card);

    });

}

async function getTrendingMovies() {

    const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
    );

    const data = await res.json();

    displayMovies(
        trendingMovies,
        data.results
    );

}

async function getNowPlayingMovies() {

    const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`
    );

    const data = await res.json();

    displayMovies(
        nowPlayingMovies,
        data.results
    );

}

async function getUpcomingMovies() {

    const res = await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`
    );

    const data = await res.json();

    displayMovies(
        upcomingMovies,
        data.results
    );

}

async function getPopularTVShows() {

    const res = await fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}`
    );

    const data = await res.json();

    displayTVShows(
        popularTVShows,
        data.results
);

}
getTrendingMovies();
getNowPlayingMovies();
getUpcomingMovies();
getPopularTVShows();