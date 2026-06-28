const themeToggle = document.getElementById("themeToggle");

const currentTheme = localStorage.getItem("theme") || "dark";

themeToggle.checked = currentTheme === "light";

themeToggle.addEventListener("change", () => {

    const theme = themeToggle.checked ? "light" : "dark";

    localStorage.setItem("theme", theme);

    document.documentElement.classList.toggle(
        "light-mode",
        theme === "light"
    );

});