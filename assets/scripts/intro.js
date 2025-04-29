document
  .querySelector(".continue-button")
  .addEventListener("click", function () {
    document.querySelector(".modal-overlay").classList.add("fade-out");
    setTimeout(() => {
      window.location.href = "main.html";
    }, 1000);
  });

document.addEventListener("click", function () {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    document.querySelector(".modal-overlay").classList.add("fade-out");
    setTimeout(() => {
      window.location.href = "main.html";
    }, 1000);
  }, 10000);
});
