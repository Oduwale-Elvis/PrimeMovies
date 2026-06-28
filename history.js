import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const historyGrid = document.getElementById("historyGrid");
const emptyHistory = document.getElementById("emptyHistory");

async function loadHistory() {

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
            "history"
        )
    );

    historyGrid.innerHTML = "";

    if (snapshot.empty) {

        historyGrid.style.display = "none";
        emptyHistory.style.display = "flex";

        return;
    }

    historyGrid.style.display = "grid";
    emptyHistory.style.display = "none";

    // Newest first
    const history = [];

    snapshot.forEach(doc => {

        history.push({
            id: doc.id,
            ...doc.data()
        });

    });

    history.sort((a, b) =>
        new Date(b.viewedAt) - new Date(a.viewedAt)
    );

    history.forEach(item => {

        const card = document.createElement("div");

        card.classList.add("movie-card");

        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${item.poster}" alt="${item.title}">

            <h3>${item.title}</h3>

            <p>⭐ ${item.rating.toFixed(1)}</p>

            <button class="remove-btn">
                Remove
            </button>
        `;

        // Open correct page
        card.addEventListener("click", () => {

            if(item.type === "movie"){

                window.location.href =
                `movie.html?id=${item.movieId}`;

            }else if(item.type === "tv"){

                window.location.href =
                `tv.html?id=${item.tvId}`;

            }else if(item.type === "anime"){

                window.location.href =
                `anime.html?id=${item.animeId}`;

            }

        });

        // Remove button
        const removeBtn =
        card.querySelector(".remove-btn");

        removeBtn.addEventListener("click",
        async (e)=>{

            e.stopPropagation();

            await deleteDoc(
                doc(
                    db,
                    "users",
                    user.uid,
                    "history",
                    item.id
                )
            );

            loadHistory();

        });

        historyGrid.appendChild(card);

    });

}

auth.onAuthStateChanged((user)=>{

    if(user){

        loadHistory();

    }

});
const clearHistoryBtn =
document.getElementById("clearHistoryBtn");

clearHistoryBtn?.addEventListener("click", async () => {

    const user = auth.currentUser;

    if(!user) return;

    const snapshot = await getDocs(

        collection(
            db,
            "users",
            user.uid,
            "history"
        )

    );

    for(const document of snapshot.docs){

        await deleteDoc(document.ref);

    }

    loadHistory();

});