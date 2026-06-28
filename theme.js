const savedTheme = localStorage.getItem("theme") || "dark";

document.documentElement.classList.toggle(
    "light-mode",
    savedTheme === "light"
);