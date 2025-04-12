// Контент книги
const bookContent = [
	{
		type: 'cover',
		title: 'Книга',
		subtitle:
			'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto aspernatur molestias, maiores, ipsam corporis cumque laudantium ut assumenda blanditiis ipsa accusantium temporibus aliquam quod, necessitatibus sit voluptates reiciendis atque incidunt?',
		img: '/assets/img/Dragons/красно-белый.png',
	},
	{
		type: 'page',
		title: 'Введение',
		content:
			'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto aspernatur molestias, maiores, ipsam corporis cumque laudantium ut assumenda blanditiis ipsa accusantium temporibus aliquam quod, necessitatibus sit voluptates reiciendis atque incidunt?',
		image: '📱',
	},
	{
		type: 'page',
		title: '',
		content:
			'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto aspernatur molestias, maiores, ipsam corporis cumque laudantium ut assumenda blanditiis ipsa accusantium temporibus aliquam quod, necessitatibus sit voluptates reiciendis atque incidunt?',
		image: '💻',
	},
	{
		type: 'page',
		title: '',
		content:
			'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto aspernatur molestias, maiores, ipsam corporis cumque laudantium ut assumenda blanditiis ipsa accusantium temporibus aliquam quod, necessitatibus sit voluptates reiciendis atque incidunt?',
		image: '🎨',
	},
	{
		type: 'page',
		title: '',
		content:
			'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto aspernatur molestias, maiores, ipsam corporis cumque laudantium ut assumenda blanditiis ipsa accusantium temporibus aliquam quod, necessitatibus sit voluptates reiciendis atque incidunt?',
		image: '🚀',
	},
]

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
	const bookElement = document.getElementById('book')
	const prevBtn = document.getElementById('prev-page')
	const nextBtn = document.getElementById('next-page')
	const currentPageEl = document.getElementById('current-page')
	const totalPagesEl = document.getElementById('total-pages')
	const themeToggle = document.getElementById('theme-toggle')

	// Создаем страницы книги
	bookContent.forEach((page, index) => {
		const pageElement = document.createElement('div')
		pageElement.className = `page page-${index} ${page.type}`

		if (page.type === 'cover') {
			pageElement.innerHTML = `
                <div class="page-content">
                    <h2 class="page-title">${page.title}</h2>
                    <p class="page-text">${page.subtitle}</p>
										<img src=${page.img} />
                </div>
            `
		} else if (page.type === 'back-cover') {
			pageElement.innerHTML = `
                <div class="page-content" style="justify-content: center; text-align: center;">
                    <h2 class="page-title">${page.content}</h2>
                    <p class="page-text">${page.publisher}</p>
                    <p class="page-number">${page.year}</p>
                </div>
            `
		} else {
			pageElement.innerHTML = `
                <div class="page-content">
                    <h2 class="page-title">${page.title}</h2>
                    <p class="page-text">${page.content}</p>
                    <div class="page-image" style="font-size: 3rem; text-align: center;">${page.image}</div>
                    <span class="page-number">${index}</span>
                </div>
            `
		}

		bookElement.appendChild(pageElement)
	})

	// Инициализация книги
	// Проверяем, что библиотека загружена
	if (typeof St === 'undefined' || typeof St.PageFlip === 'undefined') {
		console.error('PageFlip library not loaded correctly')
		alert(
			'Не удалось загрузить библиотеку перелистывания страниц. Пожалуйста, обновите страницу.'
		)
	} else {
		// Инициализация книги только если библиотека доступна
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
		})

		// Остальной код инициализации...
		// Загрузка страниц
		pageFlip.loadFromHTML(document.querySelectorAll('.page'))
		totalPagesEl.textContent = bookContent.length

		// Обновление состояния кнопок и индикатора
		const updateUI = () => {
			const currentPage = pageFlip.getCurrentPageIndex() + 1
			currentPageEl.textContent = currentPage

			prevBtn.disabled = currentPage === 1
			nextBtn.disabled = currentPage === bookContent.length
		}

		// Обработчики событий
		pageFlip.on('flip', updateUI)

		prevBtn.addEventListener('click', () => {
			pageFlip.flipPrev()
		})

		nextBtn.addEventListener('click', () => {
			pageFlip.flipNext()
		})

		updateUI()
	}

	// Переключение темы
	themeToggle.addEventListener('click', () => {
		const currentTheme = document.documentElement.getAttribute('data-theme')
		const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

		document.documentElement.setAttribute('data-theme', newTheme)
		themeToggle.innerHTML =
			newTheme === 'dark'
				? '<i class="fas fa-sun"></i>'
				: '<i class="fas fa-moon"></i>'

		// Сохраняем выбор темы
		localStorage.setItem('theme', newTheme)
	})

	// Проверка сохраненной темы
	const savedTheme = localStorage.getItem('theme') || 'light'
	document.documentElement.setAttribute('data-theme', savedTheme)
	themeToggle.innerHTML =
		savedTheme === 'dark'
			? '<i class="fas fa-sun"></i>'
			: '<i class="fas fa-moon"></i>'

	// Инициализация UI
})
