const menuButtons = document.querySelectorAll(".menu-button");
localStorage.removeItem('money')
localStorage.setItem('money', 160);

const startButton = menuButtons[0];
const soundToggleButton = menuButtons[1];

const sound = new Audio("assets/img/Pyrokinesis_minus.mp3");

sound.volume = 0.04;
sound.loop = true;
sound.currentTime = 0;

let isPlaying = false;

startButton.addEventListener("click", () => {
  window.location.href = "intro.html";
});

soundToggleButton.addEventListener("click", () => {
  if (isPlaying) {
    sound.pause();
    soundToggleButton.textContent = "Включить звук";
  } else {
    sound.play();
    soundToggleButton.textContent = "Выключить звук";
  }
  isPlaying = !isPlaying;
});

const volumeSlider = document.querySelector(".volume-slider");
volumeSlider.addEventListener("input", () => {
  sound.volume = volumeSlider.value;
});
