import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const apiKey = "35f0bf40a7aebc0072f422a82833e4c6";

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

const profileBtn =
document.getElementById("profileBtn");

const profileDropdown =
document.getElementById("profileDropdown");

const logoutBtn =
document.getElementById("logoutBtn");


// Profile Picture
onAuthStateChanged(auth, (user) => {

    if (!profileBtn) return;

    if (user && user.photoURL) {

        profileBtn.innerHTML = `
            <img
                src="${user.photoURL}"
                style="
                    width:100%;
                    height:100%;
                    border-radius:50%;
                    object-fit:cover;
                "
            >`;

    } else {

        profileBtn.innerHTML = "👤";

    }

});


// Dropdown

profileBtn?.addEventListener("click", (e) => {

    e.stopPropagation();

    profileDropdown?.classList.toggle("active");

});

document.addEventListener("click", (e) => {

    // Close profile dropdown
    if (
        profileDropdown &&
        profileBtn &&
        !profileDropdown.contains(e.target) &&
        !profileBtn.contains(e.target)
    ) {

        profileDropdown.classList.remove("active");

    }

    // Close search results
    if (
        searchResults &&
        searchInput &&
        !searchResults.contains(e.target) &&
        !searchInput.contains(e.target)
    ) {

        searchResults.style.display = "none";

    }

});

// Logout

logoutBtn?.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

});
async function searchTMDB(query) {

    if (!query.trim()) {

        searchResults.style.display = "none";
        return;

    }

    try {

        const res = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`
        );

        const data = await res.json();

        showSearchResults(data.results);

    } catch (err) {

        console.error(err);

    }

}
function showSearchResults(results) {

    searchResults.innerHTML = "";

    const filtered = results.filter(item =>
        item.media_type === "movie" ||
        item.media_type === "tv"
    );

    if (filtered.length === 0) {

        searchResults.style.display = "none";
        return;

    }

    filtered.slice(0, 8).forEach(item => {

        if (!item.poster_path) return;

        const div = document.createElement("div");

        div.className = "search-item";

        div.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${item.poster_path}">

            <div class="search-info">

                <h4>${item.title || item.name}</h4>

                <p>
                    ${item.media_type === "movie" ? "🎬 Movie" : "📺 TV Show"}
                </p>

            </div>
        `;

        div.addEventListener("click", () => {

            if (item.media_type === "movie") {

                window.location.href =
                    `movie.html?id=${item.id}`;

            } else {

                window.location.href =
                    `tv.html?id=${item.id}`;

            }

        });

        searchResults.appendChild(div);

    });

    searchResults.style.display = "block";

}
searchInput?.addEventListener("input", () => {

    searchTMDB(searchInput.value);

});
