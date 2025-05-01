const arrows = document.querySelectorAll('.level-arrows')
const arrowLeft = arrows[0]
const arrowRight = arrows[1]
const levelText = document.querySelector('.level-label')
const levelSprite = document.querySelector('.level-sprite')
const levelItem = document.querySelector('.level-item')
let level = 1

// Создаем элемент цепи
const lockElement = document.createElement('div')
lockElement.className = 'level-lock'
lockElement.innerHTML =
	'<img src="../assets/img/Islands/цепь.png" alt="Locked">'
lockElement.style.width = '65%'; 
lockElement.style.height = 'auto';
lockElement.style.left = '49%'
levelItem.appendChild(lockElement)

const islands = {
	1: '../assets/img/Islands/island1.png',
	2: '../assets/img/Islands/island2.png',
	3: '../assets/img/Islands/island3.png',
	4: '../assets/img/Islands/island4.png',
	5: '../assets/img/Islands/island1.png',
}

function updateLevel() {
	levelSprite.classList.add('fade')
	levelText.classList.add('fade')

	setTimeout(() => {
		levelText.innerText = `Уровень ${level}`
		levelSprite.src = islands[level]

		// Проверяем доступность уровня
		const passedLevels = JSON.parse(localStorage.getItem('passedLevels')) || []

		// Уровень доступен если:
		// 1. Это первый уровень (всегда доступен)
		// 2. Уровень уже пройден
		// 3. Предыдущий уровень пройден (для последовательного разблокирования)
		const isUnlocked =
			level === 1 ||
			passedLevels.includes(level) ||
			passedLevels.includes(level - 1)

		lockElement.style.display = isUnlocked ? 'none' : 'block'

		levelSprite.classList.remove('fade')
		levelText.classList.remove('fade')
	}, 300)
}

function setupIsland() {
	updateLevel()

	arrowRight.addEventListener('click', () => {
		if (level < 5) {
			level++
			updateLevel()
		}
	})

	arrowLeft.addEventListener('click', () => {
		if (level > 1) {
			level--
			updateLevel()
		}
	})

	levelSprite.addEventListener('click', () => {
		const passedLevels = JSON.parse(localStorage.getItem('passedLevels')) || []
		const isUnlocked =
			level === 1 ||
			passedLevels.includes(level) ||
			passedLevels.includes(level - 1)

		if (isUnlocked) {
			window.location.href = `../pages/levels/${level} level.html`
		} else {
			alert('Сначала пройдите предыдущий уровень!')
		}
	})
}

setupIsland()
