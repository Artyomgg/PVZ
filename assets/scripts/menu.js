const menuButtons = document.querySelectorAll(".menu-button");

const startButton = menuButtons[0];
const settingsbutton = menuButtons[1];

startButton.addEventListener("click", () => {
  window.location.href = "intro.html";
});

settingsbutton.addEventListener("click", () => {
  window.location.href = "settings.html";
});
