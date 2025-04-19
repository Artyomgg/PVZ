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
  levelText.innerText = `Уровень ${level}`;
  levelSprite.src = islands[level];
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
      window.location.href = "../pages/levels/1.html";
    } else if (level === 2) {
    } else if (level === 3) {
    } else if (level === 4) {
    } else if (level === 5) {
    }
  });
}

setupIsland();
