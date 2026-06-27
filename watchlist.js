import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const watchlistGrid =
document.getElementById("watchlistGrid");

async function loadWatchlist() {

    const user = auth.currentUser;

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    const snapshot = await getDocs(
        collection(
            db,
            "users",
            user.uid,
            "watchlist"
        )
    );

    watchlistGrid.innerHTML = "";

    if (snapshot.empty) {

        watchlistGrid.innerHTML = `
            <h2 style="color:white;text-align:center;width:100%;">
                Your Watchlist is Empty
            </h2>
        `;

        return;
    }

    snapshot.forEach((docSnap) => {

        const item = docSnap.data();

        const card =
        document.createElement("div");

        card.classList.add("movie-card");

        card.innerHTML = `
            <img
                src="https://image.tmdb.org/t/p/w500${item.poster}"
                alt="${item.title}"
            >

            <h3>${item.title}</h3>

            <p>⭐ ${item.rating.toFixed(1)}</p>

            <button class="remove-btn">
                🗑 Remove
            </button>
        `;

        // Open Movie / TV
        card.addEventListener("click", () => {

            if (item.type === "tv") {

                window.location.href =
                    `tv.html?id=${item.tvId}`;

            } else {

                window.location.href =
                    `movie.html?id=${item.movieId}`;

            }

        });

        // Remove Button
        const removeBtn =
        card.querySelector(".remove-btn");

        removeBtn.addEventListener("click", async (e) => {

            e.stopPropagation();

            const confirmDelete =
            confirm(`Remove "${item.title}" from your watchlist?`);

            if (!confirmDelete) return;

            try {

                await deleteDoc(
                    doc(
                        db,
                        "users",
                        user.uid,
                        "watchlist",
                        docSnap.id
                    )
                );

                card.remove();

                // Show empty message if last item removed
                if (watchlistGrid.children.length === 0) {

                    watchlistGrid.innerHTML = `
                        <h2 style="color:white;text-align:center;width:100%;">
                            Your Watchlist is Empty
                        </h2>
                    `;

                }

            } catch(error) {

                console.error(error);

                alert("Failed to remove from Watchlist.");

            }

        });

        watchlistGrid.appendChild(card);

    });

}

auth.onAuthStateChanged((user) => {

    if (user) {

        loadWatchlist();

    } else {

        window.location.href = "login.html";

    }

});