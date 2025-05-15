function redirect(path) {
  if (path == "levels") {
    window.location.href = `pages/${path}.html`;
  } else if (path == "book") {
    window.location.href = `pages/${path}.html`;
  } else if (path == "dragon-grow") {
    window.location.href = `pages/${path}.html`;
  } else if (path == "gacha") {
    window.location.href = `pages/${path}.html`;
  } else if (path == "infinity") {
    window.location.href = `pages/${path}.html`;
  }
}

const liItems = document.querySelectorAll(".container ul li");
const gif = document.getElementById("gif");

for (let i = 0; i < liItems.length; i++) {
  liItems[i].addEventListener("mouseenter", function (e) {
    const liRect = this.getBoundingClientRect();
    const containerRect = document
      .querySelector(".container")
      .getBoundingClientRect();
    const liCenterY = liRect.top + liRect.height / 2 - containerRect.top;
    gif.style.opacity = "1";
    gif.style.top = `${liCenterY - gif.offsetHeight / 2}px`;
    gif.style.left = `76%`;
    triangle;
  });

  liItems[i].addEventListener("mousemove", function (e) {
    const liRect = this.getBoundingClientRect();
    const containerRect = document
      .querySelector(".container")
      .getBoundingClientRect();
    const liCenterY = liRect.top + liRect.height / 2 - containerRect.top;
    gif.style.top = `${liCenterY - gif.offsetHeight / 2}px`;
  });

  liItems[i].addEventListener("mouseleave", function () {
    gif.style.opacity = "0";
    gif.style.left = `76%`;
  });
}

const sound = new Audio("assets/img/Pyrokinesis_minus.mp3");
const soundToggleButton = document.querySelector(".soundon");
sound.volume = 0.035;
sound.loop = true;
sound.currentTime = 0;

let isPlaying = false;

soundToggleButton.addEventListener("click", () => {
  if (isPlaying) {
    soundToggleButton.src = ('/assets/img/323420356034211_4.png')
    sound.pause();
  } else {
    sound.play();
    soundToggleButton.src = ('/assets/img/323420356034211.png')
  }
  isPlaying = !isPlaying;
});
