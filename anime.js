const apiKey = "35f0bf40a7aebc0072f422a82833e4c6"; 

const searchInput = document.getElementById("searchInput");
const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");

const trendingAnime =
document.getElementById("trendingAnime");

const popularAnime =
document.getElementById("popularAnime");

const topRatedAnime =
document.getElementById("topRatedAnime");

async function saveToHistory() {

    const user = auth.currentUser;

    if (!user) return;

    const anime = window.currentShow;

    if (!anime) return;

    await setDoc(

        doc(
            db,
            "users",
            user.uid,
            "history",
            String(anime.id)
        ),

        {
            animeId: anime.id,
            title: anime.name,
            poster: anime.poster_path,
            rating: anime.vote_average,
            type: "anime",
            viewedAt: new Date().toISOString()
        }

    );

}

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

getTrendingAnime();
getPopularAnime();
getTopRatedAnime();
saveToHistory();