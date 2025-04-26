const arrows = document.querySelectorAll(".level-arrows");
const arrowLeft = arrows[0];
const arrowRight = arrows[1];
const levelText = document.querySelector(".level-label");
const levelSprite = document.querySelector(".level-sprite");
let level = 1;

const islands = {
  1: "../assets/img/Islands/island1.png",
  2: "../assets/img/Islands/island2.png",
  3: "../assets/img/Islands/island3.png",
  4: "../assets/img/Islands/island1.png",
  5: "../assets/img/Islands/island1.png",
};

function updateLevel() {
  levelSprite.classList.add("fade");
  levelText.classList.add("fade");

  setTimeout(() => {
    levelText.innerText = `Уровень ${level}`;
    levelSprite.src = islands[level];

    levelSprite.classList.remove("fade");
    levelText.classList.remove("fade");
  }, 300);
}

function setupIsland() {
  updateLevel();

  arrowRight.addEventListener("click", () => {
    if (level < 5) {
      level++;
      updateLevel();
    }
  });

  arrowLeft.addEventListener("click", () => {
    if (level > 1) {
      level--;
      updateLevel();
    }
  });

  levelSprite.addEventListener("click", () => {
    if (level === 1) {
      window.location.href = "../pages/levels/1 level.html";
    } else if (level === 2) {
      window.location.href = "../pages/levels/2 level.html";
    } else if (level === 3) {
      window.location.href = "../pages/levels/3 level.html";
    } else if (level === 4) {
      window.location.href = "../pages/levels/4 level.html";
    } else if (level === 5) {
      window.location.href = "../pages/levels/5 level.html";
    }
  });
}

setupIsland();
