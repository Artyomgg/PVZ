const arrows = document.querySelectorAll(".level-arrows");
const arrowLeft = arrows[0];
const arrowRight = arrows[1];
const levelText = document.querySelector(".level-label");
const levelSprite = document.querySelector(".level-sprite");
let level = 1;

const islands = {
  1: "../assets/img/Islands/island1.png",
  2: "../assets/img/Islands/island2.png",
  3: "../assets/img/Islands/island1.png",
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
}

setupIsland();
