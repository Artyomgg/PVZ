function redirect(path) {
  if (path == "levels") {
    window.location.href = `pages/${path}.html`;
  } else if (path == "book") {
    window.location.href = `pages/${path}.html`;
  } else if (path == "dragon-grow") {
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
    gif.style.left = `70%`; // Move slightly closer on hover
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
    gif.style.left = `70%`; // Reset to initial position
  });
}
