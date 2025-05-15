let sunCount = 100
let score = 0
let selectedDragonType = null
const grid = document.getElementById('grid')
const sunCountDisplay = document.getElementById('sunCount')
const scoreCountDisplay = document.getElementById('scoreCount')
let modalLose = document.querySelector('.modal.lose')
let modalWin = document.querySelector('.modal.win')
let isGameOver = false

window.addEventListener('load', () => {
	const skin1 = localStorage.getItem('dragonSkin1')
	const skin2 = localStorage.getItem('dragonSkin2')
	const skin3 = localStorage.getItem('dragonSkin3')

	let styleText = ''

	if (skin1 === 'skinone') {
		styleText += `
          .dragon.fire {
                background-image: url('/assets/img/Dragons/dragonskinone.png')
          }
      `
	}
	if (skin2 === 'skintwo') {
		styleText += `
          .dragon.poison {
              background-image: url('/assets/img/Dragons/dragonskintwo.png');
          }
      `
	}
	if (skin3 === 'skinthree') {
		styleText += `
          .dragon.ice {
              background-image: url('/assets/img/Dragons/dragonskinthree.png')
          }
      `
	}

	if (styleText) {
		const style = document.createElement('style')
		style.textContent = styleText
		document.head.appendChild(style)
	}
})

if (!modalLose || !modalWin) {
	console.error('Modal elements not found!')
}

const dragonTypes = {
	fire: {
		cost: 50,
		damage: 1,
		shootInterval: 1500,
		projectileClass: 'fireball',
		sunSpawnInterval: 5000,
		sunSpawnChance: 0.2,
	},
	ice: {
		cost: 75,
		damage: 2,
		shootInterval: 2000,
		projectileClass: 'iceball',
	},
}

const zombieTypes = {
	normal: {
		health: 4,
		speed: 50,
		points: 100,
		spawnChance: 1,
	},
}

for (let i = 0; i < 40; i++) {
	const cell = document.createElement('div')
	cell.className = 'cell'
	// Добавляем данные о позиции клетки
	const row = Math.floor(i / 8)
	const col = i % 8
	cell.dataset.row = row
	cell.dataset.col = col
	cell.addEventListener('click', () => placeDragon(cell))
	grid.appendChild(cell)
}

function updateDragonMenu() {
	const dragonMenu = document.querySelector('.dragon-menu')
	dragonMenu.innerHTML = ''

	for (const type in dragonTypes) {
		const option = document.createElement('div')
		option.className = 'dragon-option'
		option.dataset.type = type
		option.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} (${
			dragonTypes[type].cost
		} 🔥)`

		option.addEventListener('click', () => {
			selectedDragonType = type
			document.querySelectorAll('.dragon-option').forEach(opt => {
				opt.style.border = '2px solid #3d8f4c'
			})
			option.style.border = '2px solid #ff4757'
		})

		dragonMenu.appendChild(option)
	}
}

updateDragonMenu()

function GameOver() {
	isGameOver = true
	modalLose.classList.add('visible')

	document.querySelectorAll('.dragon').forEach(dragon => {
		clearInterval(dragon.dataset.shootIntervalId)
		if (dragon.dataset.sunIntervalId) {
			clearInterval(dragon.dataset.sunIntervalId)
		}
		if (dragon.dataset.flashIntervalId) {
			clearInterval(dragon.dataset.flashIntervalId)
		}
	})

	stopAllIntervals()
}

function stopAllIntervals() {
	clearInterval(zombieSpawnInterval)
	clearInterval(sunSpawnInterval)
	clearInterval(difficultyInterval)
}

function placeDragon(cell) {
	if (!selectedDragonType || isGameOver) return

	const dragonConfig = dragonTypes[selectedDragonType]
	if (sunCount >= dragonConfig.cost && !cell.hasChildNodes()) {
		sunCount -= dragonConfig.cost
		sunCountDisplay.textContent = sunCount

		const dragon = document.createElement('div')
		dragon.className = `dragon ${selectedDragonType}`
		// Сохраняем метаданные позиции
		dragon.dataset.row = cell.dataset.row
		dragon.dataset.col = cell.dataset.col
		cell.appendChild(dragon)

		// Запуск стрельбы
		const shootIntervalId = setInterval(
			() => shoot(dragon, dragonConfig),
			dragonConfig.shootInterval
		)
		dragon.dataset.shootIntervalId = shootIntervalId

		// Особенность для огненного дракона
		if (selectedDragonType === 'fire') {
			const sunIntervalId = setInterval(
				() => spawnSunNearDragon(dragon, cell),
				dragonConfig.sunSpawnInterval
			)
			dragon.dataset.sunIntervalId = sunIntervalId
		}
	}
}

function collectSun(sun) {
	sun.classList.add('collected')
	const counter = document.getElementById('sunCount')
	const counterRect = counter.getBoundingClientRect()
	const sunRect = sun.getBoundingClientRect()

	sun.style.position = 'fixed'
	sun.style.left = `${sunRect.left}px`
	sun.style.top = `${sunRect.top}px`

	sunCount += 50
	sunCountDisplay.textContent = sunCount

	setTimeout(() => sun.remove(), 500)
}

function shoot(dragon, config) {
	if (isGameOver) return
	dragon.classList.add('shooting')
	setTimeout(() => dragon.classList.remove('shooting'), 300)

	const projectile = document.createElement('div')
	projectile.className = `projectile ${config.projectileClass}`

	const dragonRect = dragon.getBoundingClientRect()
	const gridRect = grid.getBoundingClientRect()

	projectile.style.left = `${dragonRect.left - gridRect.left}px`
	projectile.style.top = `${
		dragonRect.top - gridRect.top + dragon.offsetHeight / 2
	}px`

	grid.appendChild(projectile)

	let trailInterval
	if (config.projectileClass === 'fireball') {
		trailInterval = createFireballTrail(projectile)
	} else if (config.projectileClass === 'iceball') {
		trailInterval = createIceballTrail(projectile)
	}

	const animation = projectile.animate(
		[
			{ left: `${dragonRect.left - gridRect.left}px` },
			{ left: `${gridRect.width}px` },
		],
		{
			duration: 2000,
			easing: 'linear',
		}
	)

	animation.onfinish = () => {
		clearInterval(trailInterval)
		projectile.remove()
	}
}

function createFireballTrail(projectile) {
	return setInterval(() => {
		const trail = document.createElement('div')
		trail.className = 'fireball trail'
		trail.style.left = projectile.style.left
		trail.style.top = projectile.style.top
		grid.appendChild(trail)
		setTimeout(() => trail.remove(), 200)
	}, 50)
}

function createIceballTrail(projectile) {
	return setInterval(() => {
		const trail = document.createElement('div')
		trail.className = 'iceball trail'
		trail.style.left = projectile.style.left
		trail.style.top = projectile.style.top
		grid.appendChild(trail)
		setTimeout(() => trail.remove(), 200)
	}, 50)
}

function spawnZombie() {
	if (isGameOver) return

	// Конфигурация зомби
	const zombieType = 'normal'
	const zombieConfig = zombieTypes[zombieType]

	// Создание элемента зомби
	const zombie = document.createElement('div')
	zombie.className = `zombie ${zombieType}`

	// Инициализация параметров
	const row = Math.floor(Math.random() * 5)
	const topPosition = row * 20 + 10
	zombie.style.top = `${topPosition}%`
	zombie.style.left = '100%'
	zombie.dataset.row = row
	zombie.dataset.health = zombieConfig.health
	zombie.dataset.points = zombieConfig.points
	zombie.dataset.slowMultiplier = '1' // Начальный множитель скорости
	zombie.dataset.baseSpeed = zombieConfig.speed.toString() // Сохраняем базовую скорость

	grid.appendChild(zombie)

	// Переменные для анимации
	let startTime = null
	let currentPosition = 0

	// Функция анимации движения
	const animate = timestamp => {
		if (!zombie.isConnected || isGameOver) return

		// Инициализация времени начала
		if (!startTime) startTime = timestamp
		const deltaTime = timestamp - startTime
		startTime = timestamp

		// Расчет скорости
		const baseSpeed = parseFloat(zombie.dataset.baseSpeed)
		const speedMultiplier = parseFloat(zombie.dataset.slowMultiplier)
		const movement = (baseSpeed * deltaTime * speedMultiplier) / 1000

		// Обновление позиции
		currentPosition += movement
		zombie.style.left = `calc(100% - ${currentPosition}px)`

		// Проверка достижения базы
		const zombieRect = zombie.getBoundingClientRect()
		const gridRect = grid.getBoundingClientRect()
		if (zombieRect.right <= gridRect.left + 50) {
			GameOver()
			return
		}

		requestAnimationFrame(animate)
	}

	// Запуск анимации
	requestAnimationFrame(animate)

	// Проверка столкновений с драконами
	const collisionInterval = setInterval(() => {
		if (!zombie.isConnected) {
			clearInterval(collisionInterval)
			return
		}

		const zombieRect = zombie.getBoundingClientRect()
		document.querySelectorAll('.dragon').forEach(dragon => {
			const dragonRect = dragon.getBoundingClientRect()
			if (isColliding(zombieRect, dragonRect)) {
				console.log('Dragon attacked!')
			}
		})
	}, 100)

	// Обработка попаданий снарядов
	const hitInterval = setInterval(() => {
		if (!zombie.isConnected) {
			clearInterval(hitInterval)
			return
		}

		const zombieRect = zombie.getBoundingClientRect()
		document.querySelectorAll('.projectile').forEach(projectile => {
			if (isColliding(zombieRect, projectile.getBoundingClientRect())) {
				handleProjectileHit(zombie, projectile)
			}
		})
	}, 50)
}

function handleProjectileHit(zombie, projectile) {
	// Создаем эффект попадания
	const hitEffect = document.createElement('div')
	hitEffect.className = 'hit-effect'
	const zombieRect = zombie.getBoundingClientRect()
	hitEffect.style.left = `${zombieRect.left}px`
	hitEffect.style.top = `${zombieRect.top}px`
	document.body.appendChild(hitEffect)
	setTimeout(() => hitEffect.remove(), 500)

	const damage = projectile.classList.contains('fireball')
		? dragonTypes.fire.damage
		: dragonTypes.ice.damage

	zombie.dataset.health -= damage

	if (zombie.dataset.health <= 0) {
		score += parseInt(zombie.dataset.points)
		scoreCountDisplay.textContent = score
		zombie.remove()
	} else {
		// Анимация получения урона
		zombie.classList.add('damaged')
		setTimeout(() => zombie.classList.remove('damaged'), 200)

		if (projectile.classList.contains('iceball')) {
			freezeZombie(zombie)
		}
	}

	projectile.remove()
}

// Вспомогательная функция для анимации
function isColliding(a, b) {
	return !(
		a.right < b.left ||
		a.left > b.right ||
		a.bottom < b.top ||
		a.top > b.bottom
	)
}

function spawnSun() {
	if (isGameOver) return

	const sun = document.createElement('div')
	sun.className = 'sun'
	sun.style.left = `${Math.random() * 90}%`
	grid.appendChild(sun)

	sun.addEventListener('click', () => {
		if (!sun.classList.contains('collected')) {
			collectSun(sun)
		}
	})

	sun.addEventListener('animationend', () => {
		if (!sun.classList.contains('collected')) {
			sun.remove()
		}
	})
}

let zombieInterval = 4000
let sunInterval = 8000

function increaseDifficulty() {
	zombieInterval = Math.max(2000, zombieInterval - 500)
	clearInterval(zombieSpawnInterval)
	zombieSpawnInterval = setInterval(spawnZombie, zombieInterval)
}

function freezeZombie(zombie) {
	if (!zombie.isConnected) return

	// Сохраняем текущую трансформацию
	const currentTransform = window.getComputedStyle(zombie).transform

	// Сброс предыдущей заморозки
	if (zombie.dataset.freezeTimeoutId) {
		clearTimeout(zombie.dataset.freezeTimeoutId)
		zombie.classList.remove('frozen')
		const existingIce = zombie.querySelector('.ice-overlay')
		if (existingIce) existingIce.remove()
	}

	// Визуальные эффекты
	zombie.dataset.slowMultiplier = 0
	zombie.classList.add('frozen')

	const iceOverlay = document.createElement('div')
	iceOverlay.className = 'ice-overlay'
	zombie.appendChild(iceOverlay)

	// Таймер разморозки
	const timeoutId = setTimeout(() => {
		if (zombie.isConnected) {
			zombie.dataset.slowMultiplier = 1
			zombie.classList.remove('frozen')
			iceOverlay.remove()

			// Восстанавливаем исходную трансформацию
			zombie.style.transform = currentTransform
		}
	}, 1500)

	zombie.dataset.freezeTimeoutId = timeoutId
}

let zombieSpawnInterval = setInterval(spawnZombie, zombieInterval)
let sunSpawnInterval = setInterval(spawnSun, sunInterval)
let difficultyInterval = setInterval(increaseDifficulty, 30000)
