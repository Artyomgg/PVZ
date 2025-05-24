const bookContent = [
  {
    type: "cover",
    title: "Энциклопедия драконов",
    subtitle: "Механики и особенности драконов игры",
    img: "../assets/img/field.png",
    dragonImg: "../assets/img/Dragons/красно-белый.png",
  },
  {
    type: "page",
    title: "Огненный дракон 🔥",
    content: "Огненный дракон выпускает огненные шары, наносящие 1 урона каждые 1.5 секунды. Стоимость: 50 огоньков. Особенность: периодически создает огненные капли (каждые 9 секунд), которые можно собрать для получения 25 солнц.",
    image: "../assets/img/Dragons/красно-белый.png",
  },
  {
    type: "page",
    title: "Ледяной дракон ❄️",
    content: "Ледяной дракон стреляет ледяными шарами, наносящими 1 урона каждые 3 секунды. Стоимость: 75 огоньков. Ледяные снаряды замедляют зомби при попадании.",
    image: "../assets/img/Dragons/синий-большой.png",
  },
  {
    type: "page",
    title: "Ядовитый дракон 🐍",
    content: "Ядовитый дракон выпускает вращающиеся ядовитые снаряды, наносящие 2 урона каждые 2.5 секунды. Стоимость: 100 огоньков. Яд наносит урон нескольким зомби в небольшой области.",
    image: "../assets/img/Dragons/фиолетово-синий.png",
  },
  {
    type: "page",
    title: "Молниевый дракон ⚡",
    content: "Молниевый дракон атакует молниями, наносящими 6 урона каждые 2 секунды в двух клетках впереди. Стоимость: 150 огоньков. Молнии поражают всех зомби в области клетки.",
    image: "../assets/img/Dragons/маленький-красный.png",
  },
  {
    type: "page",
    title: "Взрывной дракон 💥",
    content: "Взрывной дракон создает мощный взрыв через 3 секунды после размещения, наносящий 13 урона всем зомби в радиусе 3 клеток. Стоимость: 100 огоньков. Одноразовый эффект, после взрыва дракон исчезает.",
    image: "../assets/img/Dragons/красный-большой.png",
  },
  {
    type: "page",
    title: "Смертельный дракон 💀",
    content: "Смертельный дракон атакует раз в 6 секунд, если противник находится дальше 2-x клеток. Мгновенно убивает почти любого врага. Стоимость: 250 огоньков.",
    image: "../assets/img/Dragons/красно-серый.png",
  },
  {
    type: "back-cover",
    content: "Конец энциклопедии",
    publisher: "Издательство Драконьих Знаний",
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
  const book1 = document.querySelector(".book1");
  const book2 = document.querySelector(".book2");

  book1.addEventListener('click', () => {
    book1.classList.add('active');
    book2.classList.remove('active');
  });

  book2.addEventListener('click', () => {
    book2.classList.add('active');
    book1.classList.remove('active');
  });

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
          <div class="dragon-image-container">
            <img src="${page.dragonImg}" class="dragon-image" />
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
          <div class="dragon-image-container">
            <img src="${page.image}" class="dragon-image" />
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