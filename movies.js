const apiKey = "35f0bf40a7aebc0072f422a82833e4c6";

const popularMovies =
document.getElementById("popularMovies");

const topRatedMovies =
document.getElementById("topRatedMovies");

const actionMovies =
document.getElementById("actionMovies");

const comedyMovies =
document.getElementById("comedyMovies");

const horrorMovies =
document.getElementById("horrorMovies");

const scifiMovies =
document.getElementById("scifiMovies");

function displayMovies(container, movies) {

    container.innerHTML = "";

    movies.forEach(movie => {

        const card =
        document.createElement("div");

        card.classList.add("movie-card");

        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        `;

        card.addEventListener("click", () => {

            window.location.href =
            `movie.html?id=${movie.id}`;

        });

        container.appendChild(card);

    });

}

async function getGenreMovies(container, genreId) {

    const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`
    );

    const data = await res.json();

    displayMovies(container, data.results);

}

async function getPopularMovies() {

    const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
    );

    const data = await res.json();

    displayMovies(
        popularMovies,
        data.results
    );

}

async function getTopRatedMovies() {

    const res = await fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`
    );

    const data = await res.json();

    displayMovies(
        topRatedMovies,
        data.results
    );

}

getPopularMovies();
getTopRatedMovies();

getGenreMovies(actionMovies, 28); // Action
getGenreMovies(comedyMovies, 35); // Comedy
getGenreMovies(horrorMovies, 27); // Horror
getGenreMovies(scifiMovies, 878); // Sci-Fi