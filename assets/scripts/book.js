// Контент книги с описанием всех драконов
const bookContent = [
  {
    type: "cover",
    title: "Энциклопедия драконов",
    subtitle: "Собрание знаний о самых удивительных существах",
    img: "../assets/img/field.png", // Фон обложки
    dragonImg: "../assets/img/Dragons/красно-белый.png",
  },
  {
    type: "page",
    title: "Красно-белый дракон 🔥❄️",
    content:
      "Уникальный гибрид огненного и ледяного драконов, сочетающий в себе противоположные стихии. Его красные чешуйки переливаются на свету, а белые плавники излучают холодное сияние. Способен одновременно выдыхать пламя и ледяное дыхание.",
    image: "../assets/img/Dragons/красно-белый.png",
  },
  {
    type: "page",
    title: "Малый огнедыш 🐉",
    content:
      "Небольшой, но проворный дракон с ярко-красной чешуей. Несмотря на скромные размеры, обладает недюжинной силой и храбростью. Часто служит посланником или разведчиком у более крупных сородичей. Любит солнечные камни и вулканические пещеры.",
    image: "../assets/img/Dragons/маленький-красный.png",
  },
  {
    type: "page",
    title: "Алый разрушитель 🏰",
    content:
      "Среднего размера дракон с темно-красной чешуей и мощными крыльями. Известен своей агрессивностью и территориальностью. Часто нападает на замки и крепости, считая их вторжением на свою территорию. Его пламя может плавить камень.",
    image: "../assets/img/Dragons/средний-красный.png",
  },
  {
    type: "page",
    title: "Ледяной титан ❄️",
    content:
      "Величественный дракон с синей чешуей, обитающий в северных широтах. Его дыхание мгновенно замораживает все на своем пути. В отличие от огненных сородичей, предпочитает уединение и редко показывается людям. Покровительствует полярным экспедициям.",
    image: "../assets/img/Dragons/синий-большой.png",
  },
  {
    type: "page",
    title: "Голубой страж ✨",
    content:
      "Маленький дракон с бирюзовой чешуей, излучающей мягкий свет. Обладает способностью создавать ледяные иллюзии. Часто сопровождает волшебников и алхимиков, помогая им в исследованиях. Любит играть с северными сияниями.",
    image: "../assets/img/Dragons/синий-маленький.png",
  },
  {
    type: "page",
    title: "Мистический шторм ⚡",
    content:
      "Загадочный дракон с переливающейся фиолетово-синей чешуей. Контролирует грозовые облака и атмосферные явления. Считается посредником между миром драконов и богов. Его появление предвещает важные события и перемены.",
    image: "../assets/img/Dragons/фиолетово-синий.png",
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
