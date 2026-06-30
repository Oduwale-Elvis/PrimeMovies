const apiKey = "35f0bf40a7aebc0072f422a82833e4c6";

const searchInput = document.getElementById("searchInput");
const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");

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
        card.addEventListener("click", () => {
            window.location.href =
                `tv.html?id=${show.id}`;
        });
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

getPopularTV();
getTopRatedTV();
getTrendingTV();