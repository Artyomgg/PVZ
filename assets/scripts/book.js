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
    content: "Огненный дракон выпускает огненные шары, наносящие 10 урона каждые 1.5 секунды. Стоимость: 50 солнц. Особенность: периодически создает огненные капли (каждые 9 секунд), которые можно собрать для получения 25 солнц.",
    image: "../assets/img/Dragons/красно-белый.png",
  },
  {
    type: "page",
    title: "Ледяной дракон ❄️",
    content: "Ледяной дракон стреляет ледяными шарами, наносящими 15 урона каждые 2 секунды. Стоимость: 75 солнц. Ледяные снаряды замедляют зомби при попадании.",
    image: "../assets/img/Dragons/синий-большой.png",
  },
  {
    type: "page",
    title: "Ядовитый дракон ☠️",
    content: "Ядовитый дракон выпускает вращающиеся ядовитые снаряды, наносящие 10 урона каждые 2.5 секунды. Стоимость: 100 солнц. Яд наносит урон нескольким зомби в небольшой области.",
    image: "../assets/img/Dragons/фиолетово-синий.png",
  },
  {
    type: "page",
    title: "Молниевый дракон ⚡",
    content: "Молниевый дракон атакует молниями, наносящими 20 урона каждые 2 секунды в двух клетках впереди. Стоимость: 150 солнц. Молнии поражают всех зомби в области клетки.",
    image: "../assets/img/Dragons/маленький-красный.png",
  },
  {
    type: "page",
    title: "Взрывной дракон 💥",
    content: "Взрывной дракон создает мощный взрыв через 3 секунды после размещения, наносящий 30 урона всем зомби в радиусе 3 клеток. Стоимость: 100 солнц. Одноразовый эффект, после взрыва дракон исчезает.",
    image: "../assets/img/Dragons/красный-большой.png",
  },
  {
    type: "back-cover",
    content: "Конец энциклопедии",
    publisher: "Издательство Драконьих Знаний",
    year: "2025",
  },
];

const bookContent2 = [
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
    content: "Самый мощный враг в игре, с 500 хп. Имеет самую сильную механику атаки. Находится на последнем уровне игры.",
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