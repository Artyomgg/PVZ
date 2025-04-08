const now = document.querySelector('.now')
const clicksscore = document.querySelector('.clicks-score')
const clicksscore2 = document.querySelector('.clicks-score2')
const future = document.querySelector('.future')
const modal = document.querySelector('.modal')

const dragonSrc = {
	one: '../assets/img/Dragons/маленький-красный.png',
	two: '../assets/img/Dragons/средний-красный.png',
	three: '../assets/img/Dragons/красно-белый.png',
	four: '../assets/img/Dragons/синий-маленький.png',
	five: '../assets/img/Dragons/фиолетово-синий.png',
	six: '../assets/img/Dragons/синий-большой.png',
}

//кликов для повышения
const purposes = {
	one: 50,
	two: 150,
	three: 350,
	four: 700,
	five: 1001,
}

let clickHandler
const key = 'clicks'

function setupDragon() {
	let nextPurpose = purposes.one // Сначала цель - 50 кликов
	let clicks = parseInt(localStorage.getItem(key)) || 0
	clicksscore.innerText = clicks

	// Устанавливаем начальное изображение дракона
	updateDragonImage(clicks)
	updateNextPurpose(clicks) // Обновляем цель при инициализации

	clickHandler = function () {
		clicks++

		updateDragonImage(clicks)
		updateNextPurpose(clicks) // Обновляем цель после каждого клика

		localStorage.setItem(key, clicks.toString())
		clicksscore.innerText = clicks
	}

	now.addEventListener('click', clickHandler)
}

function updateNextPurpose(clicks) {
	// Определяем следующий порог
	if (clicks < purposes.one) {
		clicksscore2.innerText = purposes.one - clicks
	} else if (clicks < purposes.two) {
		clicksscore2.innerText = purposes.two - clicks
		future.src = dragonSrc.three
	} else if (clicks < purposes.three) {
		clicksscore2.innerText = purposes.three - clicks
		future.src = dragonSrc.four
	} else if (clicks < purposes.four) {
		clicksscore2.innerText = purposes.four - clicks
		future.src = dragonSrc.five
	} else if (clicks < purposes.five) {
		clicksscore2.innerText = purposes.five - clicks
		future.src = dragonSrc.six
	} else {
		// Если достигнут максимальный уровень
		clicksscore2.innerText = 'Макс. уровень!'
		modal.style.display = 'flex'
	}
}

// ... остальной код без изменений ...

now.addEventListener('click', clickHandler)

function updateDragonImage(clicks) {
	if (clicks >= purposes.five) {
		now.src = dragonSrc.six
	} else if (clicks >= purposes.four) {
		now.src = dragonSrc.five
	} else if (clicks >= purposes.three) {
		now.src = dragonSrc.four
	} else if (clicks >= purposes.two) {
		now.src = dragonSrc.three
	} else if (clicks >= purposes.one) {
		now.src = dragonSrc.two
	} else {
		now.src = dragonSrc.one
	}
}

function onloadScore(){
	localStorage.removeItem(key)
	window.location.href = ''
}

// Запускаем сразу
setupDragon()

