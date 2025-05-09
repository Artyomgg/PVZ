const bookContent = [
  {
    type: "cover",
    title: "Энциклопедия врагов",
    subtitle: "Механики и особенности врагов игры",
    img: "../assets/img/field.png",
    enemyImg: "../assets/img/KNIGHTS/chel.gif",
  },
  {
    type: "page",
    title: "Обычный рыцарь 🗡️",
    content: "Обычный рыцарь — базовый враг с 5 единицами здоровья и скоростью передвижения 20 единиц в секунду. Появляется с вероятностью 50%.",
    image: "../assets/img/KNIGHTS/chel.gif",
  },
  {
    type: "page",
    title: "Бронированный рыцарь 🛡️",
    content: "Бронированный рыцарь обладает повышенной защитой с 13 единицами здоровья и скоростью 25 единиц в секунду. Появляется с вероятностью 25%.",
    image: "../assets/img/KNIGHTS/chel2.gif",
  },
  {
    type: "page",
    title: "Рыцарь-охотник 🏹",
    content: "Рыцарь-охотник имеет 10 единиц здоровья и скорость 22 единицы в секунду. Появляется с вероятностью 25%. ",
    image: "../assets/img/KNIGHTS/chel3.gif",
  },
  {
    type: "page",
    title: "Золотой рыцарь ✨",
    content: "Золотой рыцарь — редкий и мощный враг с 28 единицами здоровья и скоростью 19 единиц в секунду. Появляется с вероятностью 15%.",
    image: "../assets/img/KNIGHTS/chel4.gif",
  },
  {
    type: "page",
    title: "Король-рыцарь 👑",
    content: "",
    image: "../assets/img/KNIGHTS/boss.gif",
  },
  {
    type: "back-cover",
    content: "Конец энциклопедии",
    publisher: "Издательство Рыцарских Хроник",
    year: "2025",
  },
];

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  const bookElement = document.getElementById("book");
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");
  const currentPageEl = document.getElementById("current-page");
  const totalPagesEl = document.getElementById("total-pages");

  // Создаем страницы книги
  bookContent.forEach((page, index) => {
    const pageElement = document.createElement("div");
    pageElement.className = `page page-${index} ${page.type}`;

    if (page.type === "cover") {
      pageElement.style.backgroundImage = `url('${page.img}')`;
      pageElement.innerHTML = `
        <div class="page-content">
          <h2 class="page-title">${page.title}</h2>
          <p class="page-subtitle">${page.subtitle}</p>
          <div class="enemy-image-container">
            <img src="${page.enemyImg}" class="enemy-image" />
          </div>
        </div>
      `;
    } else if (page.type === "back-cover") {
      pageElement.innerHTML = `
        <div class="page-content" style="justify-content: center; text-align: center;">
          <h2 class="page-title">${page.content}</h2>
          <p class="page-text">${page.publisher}</p>
          <p class="page-number">${page.year}</p>
        </div>
      `;
    } else {
      pageElement.innerHTML = `
        <div class="page-content">
          <h2 class="page-title">${page.title}</h2>
          <p class="page-text">${page.content}</p>
          <div class="enemy-image-container">
            <img src="${page.image}" class="enemy-image" />
          </div>
          <span class="page-number">${index}</span>
        </div>
      `;
    }

    bookElement.appendChild(pageElement);
  });

  // Инициализация книги
  if (typeof St === "undefined" || typeof St.PageFlip === "undefined") {
    console.error("PageFlip library not loaded correctly");
    alert(
      "Не удалось загрузить библиотеку перелистывания страниц. Пожалуйста, обновите страницу."
    );
  } else {
    const pageFlip = new St.PageFlip(bookElement, {
      width: 900,
      height: 650,
      showCover: true,
      maxShadowOpacity: 0.2,
      mobileScrollSupport: true,
      swipeDistance: 30,
      clickEventForward: false,
      useMouseEvents: true,
      flippingTime: 800,
      disableFlipByClick: false,
    });

    pageFlip.loadFromHTML(document.querySelectorAll(".page"));
    totalPagesEl.textContent = bookContent.length;

    const updateUI = () => {
      const currentPage = pageFlip.getCurrentPageIndex() + 1;
      currentPageEl.textContent = currentPage;

      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === bookContent.length;
    };

    pageFlip.on("flip", updateUI);

    prevBtn.addEventListener("click", () => {
      pageFlip.flipPrev();
    });

    nextBtn.addEventListener("click", () => {
      pageFlip.flipNext();
    });

    updateUI();
  }
});