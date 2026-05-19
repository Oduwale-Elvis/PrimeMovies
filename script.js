/* NAVBAR EFFECT */

const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
    if(window.scrollY > 50){
        navbar.style.background = "#0b0b0b";
    }
    else{
        navbar.style.background = "rgba(11,11,11,0.92)";
    }

});

/* SEARCH */
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", () => {
    const searchValue = searchInput.value.toLowerCase();
    const movieCards = document.querySelectorAll(".movie-card");
    movieCards.forEach(card => {
        const movieName = card.innerText.toLowerCase();
        if(movieName.includes(searchValue)){
            card.style.display = "flex";
        }
        else{
            card.style.display = "none";
        }
    });
});

/* CARD CLICK */
const cards = document.querySelectorAll(".movie-card");
cards.forEach(card => {
    card.addEventListener("click", () => {
        const movieTitle = card.innerText;
        alert("Opening " + movieTitle);
    });
});

/* HERO SLIDER */
const hero = document.querySelector(".hero");
const heroTitle = document.getElementById("hero-title");
const heroDescription = document.getElementById("hero-description");
const heroTag = document.getElementById("hero-tag");
const heroMovies = [
{
    title:"Shadow City",
    description:"In a world ruled by secrets, one man must uncover the truth before the city falls.",
    tag:"#1 TRENDING NOW",
    image:"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600"
},

{
    title:"War Zone",
    description:"A retired soldier returns for one final mission against a dangerous syndicate.",
    tag:"#2 ACTION MOVIE",
    image:"https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1600"
},

{
    title:"Dark Ocean",
    description:"A mysterious signal from the sea changes humanity forever.",
    tag:"#1 SCI-FI SERIES",
    image:"https://images.unsplash.com/photo-1505685296765-3a2736de412f?q=80&w=1600"
},

{
    title:"Final Byte",
    description:"A genius hacker discovers a hidden AI capable of controlling the world.",
    tag:"#1 TECH THRILLER",
    image:"https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?q=80&w=1600"
}
];

let currentMovie = 0;
function changeHero(){
    currentMovie++;
    if(currentMovie >= heroMovies.length){
        currentMovie = 0;
    }
    hero.style.backgroundImage = `
    linear-gradient(
        to right,
        rgba(11,11,11,0.95),
        rgba(11,11,11,0.45),
        rgba(11,11,11,0.2)
    ),
    url('${heroMovies[currentMovie].image}')
    `;
    heroTitle.textContent = heroMovies[currentMovie].title;
    heroDescription.textContent = heroMovies[currentMovie].description;
    heroTag.textContent = heroMovies[currentMovie].tag;

}

/* INITIAL HERO */

hero.style.backgroundImage = `
linear-gradient(
    to right,
    rgba(11,11,11,0.95),
    rgba(11,11,11,0.45),
    rgba(11,11,11,0.2)
),
url('${heroMovies[0].image}')
`;

/* AUTO SLIDE */
setInterval(changeHero, 5000);

/* PROFILE DROPDOWN */
const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");
profileBtn.addEventListener("click", () => {
    profileDropdown.classList.toggle("active");

});

/* CLOSE WHEN CLICKING OUTSIDE */
window.addEventListener("click", (e) => {
    if(
        !profileBtn.contains(e.target)
        &&
        !profileDropdown.contains(e.target)
    ){
        profileDropdown.classList.remove("active");
    }
});

/* TRAILER MODAL */
const trailerModal = document.getElementById("trailerModal");
const trailerVideo = document.getElementById("trailerVideo");
const closeTrailer = document.getElementById("closeTrailer");
const playButtons = document.querySelectorAll(".play-btn");

/* OPEN TRAILER */
playButtons.forEach(button => {
    button.addEventListener("click", () => {
        const trailerLink = button.dataset.trailer;
        trailerVideo.src = trailerLink + "?autoplay=1";
        trailerModal.classList.add("active");
    });
});

/* CLOSE TRAILER */
closeTrailer.addEventListener("click", () => {
    trailerModal.classList.remove("active");
    trailerVideo.src = "";
});

/* CLOSE OUTSIDE CLICK */

window.addEventListener("click", (e) => {
    if(e.target === trailerModal){
        trailerModal.classList.remove("active");
        trailerVideo.src = "";
    }
});

/* TMDB API */
const apiKey = "e0fef4758e1a3c3d72ba1b55682c7785";
const trendingMovies = document.getElementById("trendingMovies");
/* FETCH TRENDING MOVIES */
async function getTrendingMovies(){
    const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
    );
    const data = await response.json();
    showMovies(data.results);
}

/* DISPLAY MOVIES */

function showMovies(movies){
    trendingMovies.innerHTML = "";
    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.innerHTML = `
            <img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            alt="${movie.title}"
            >
            <div class="movie-overlay">
                <button
                class="play-btn">
                ▶
                </button>
                <h3>${movie.title}</h3>
                <p>
                ⭐ ${movie.vote_average.toFixed(1)}
                </p>
            </div>
        `;
        trendingMovies.appendChild(movieCard);
    });
}

/* LOAD MOVIES */

getTrendingMovies();