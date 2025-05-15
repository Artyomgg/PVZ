import { IntoLocalStorage } from './intoLocalStorage.js'

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
            .dragon.fire::before {
                content: url('/assets/img/Dragons/dragonskinone.png') !important;
            }
        `
	}
	if (skin2 === 'skintwo') {
		styleText += `
            .dragon.poison::before {
                content: url('/assets/img/Dragons/dragonskintwo.png') !important;
				scale: 11.5%;
				left: -600%;
				top: -570%;
            }
        `
	}
	if (skin3 === 'skinthree') {
		styleText += `
            .dragon.ice::before {
                content: url('/assets/img/Dragons/dragonskinthree.png') !important;
				scale: 11.5%;
				left: -750%;
				top: -660%;
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

// 1. МАССИВ ДРАКОНОВ
const dragonTypes = {
	fire: {
		cost: 50,
		damage: 1,
		shootInterval: 1500,
		projectileClass: 'fireball',
	},
	ice: {
		cost: 75,
		damage: 2,
		shootInterval: 2000,
		projectileClass: 'iceball',
	},
	poison: {
		cost: 100,
		damage: 3,
		shootInterval: 2500,
		projectileClass: 'poisonball',
	},
}

// 2. МАССИВ ЗОМБИ
const zombieTypes = {
	normal: {
		health: 5,
		speed: 17,
		points: 100,
		spawnChance: 0.8,
	},
	armored: {
		health: 10,
		speed: 25,
		points: 150,
		spawnChance: 0.2,
	},
}

// Создаем сетку
for (let i = 0; i < 40; i++) {
	const cell = document.createElement('div')
	cell.className = 'cell'
	cell.addEventListener('click', () => placeDragon(cell))
	grid.appendChild(cell)
}

// Обновляем меню драконов
function updateDragonMenu() {
	const dragonMenu = document.querySelector('.dragon-menu')
	dragonMenu.innerHTML = ''

	for (const type in dragonTypes) {
		const option = document.createElement('div')
		option.className = 'dragon-option'
		option.dataset.type = type
		option.textContent = `${type} (${dragonTypes[type].cost} 🔥)`

		option.addEventListener('click', () => {
			selectedDragonType = type
			document.querySelectorAll('.dragon-option').forEach(opt => {
				opt.style.border = '2px solid #ddb643'
			})
			option.style.border = '2px solid rgb(198, 6, 22)'
		})

		dragonMenu.appendChild(option)
	}
}

// Инициализируем меню драконов
updateDragonMenu()

function GameOver() {
	isGameOver = true
	modalLose.classList.add('visible')

	// Останавливаем все интервалы драконов
	document.querySelectorAll('.dragon').forEach(dragon => {
		clearInterval(dragon.dataset.shootIntervalId)
		if (dragon.dataset.sunIntervalId) {
			clearInterval(dragon.dataset.sunIntervalId)
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
		cell.appendChild(dragon)

		// Интервал для стрельбы
		const shootIntervalId = setInterval(
			() => shoot(dragon, dragonConfig),
			dragonConfig.shootInterval
		)
		dragon.dataset.shootIntervalId = shootIntervalId

		// Для fire дракона - интервал спавна солнца
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

	if (config.projectileClass === 'lightningball') {
		lightningAttack(dragon, config)
		return
	}

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

	let random = Math.random()
	let cumulativeChance = 0
	let zombieType

	for (const type in zombieTypes) {
		cumulativeChance += zombieTypes[type].spawnChance
		if (random <= cumulativeChance) {
			zombieType = type
			break
		}
	}

	const zombieConfig = zombieTypes[zombieType]

	const zombie = document.createElement('div')
	zombie.className = `zombie ${zombieType}`
	zombie.style.setProperty('--move-duration', `${zombieConfig.speed}s`)

	const row = Math.floor(Math.random() * 5)
	zombie.style.top = `${row * 20}%`
	zombie.dataset.health = zombieConfig.health.toString()
	zombie.dataset.points = zombieConfig.points.toString()
	zombie.dataset.row = row.toString()

	grid.appendChild(zombie)

	const checkGameOver = () => {
		if (isGameOver) return
		const cells = document.querySelectorAll(`.cell:nth-child(${row * 8 + 1})`)
		if (cells.length === 0) return

		const zombieRect = zombie.getBoundingClientRect()
		const firstCellRect = cells[0].getBoundingClientRect()

		if (zombieRect.right <= firstCellRect.left + firstCellRect.width / 2) {
			GameOver()
		}
	}

	const checkCollision = setInterval(() => {
		if (!zombie.isConnected) {
			clearInterval(checkCollision)
			return
		}

		checkGameOver()

		const projectiles = document.querySelectorAll('.projectile')
		const zombieRect = zombie.getBoundingClientRect()

		projectiles.forEach(projectile => {
			if (!projectile.isConnected) return

			const projectileRect = projectile.getBoundingClientRect()

			if (
				projectileRect.right > zombieRect.left &&
				projectileRect.left < zombieRect.right &&
				projectileRect.bottom > zombieRect.top &&
				projectileRect.top < zombieRect.bottom
			) {
				const hitEffect = document.createElement('div')
				hitEffect.className = 'hit-effect'
				hitEffect.style.left = `${zombieRect.left}px`
				hitEffect.style.top = `${zombieRect.top}px`
				document.body.appendChild(hitEffect)
				setTimeout(() => hitEffect.remove(), 500)

				let damage = 1
				for (const type in dragonTypes) {
					if (
						projectile.classList.contains(dragonTypes[type].projectileClass)
					) {
						damage = dragonTypes[type].damage
						break
					}
				}

				let currentHealth = parseInt(zombie.dataset.health)
				currentHealth -= damage
				zombie.dataset.health = currentHealth.toString()

				projectile.remove()

				if (currentHealth <= 0) {
					score += parseInt(zombie.dataset.points)
					scoreCountDisplay.textContent = score
					zombie.remove()
					clearInterval(checkCollision)
					if (score >= 2500) {
						clearInterval(zombieSpawnInterval)
						modalWin.classList.add('visible')
						IntoLocalStorage(2)
					}
				} else {
					zombie.classList.add('damaged')
					setTimeout(() => zombie.classList.remove('damaged'), 200)
				}
			}
		})
	}, 100)
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

// Увеличение сложности
let zombieInterval = 4000
let sunInterval = 5000

function increaseDifficulty() {
	zombieInterval = Math.max(2000, zombieInterval - 500)
	clearInterval(zombieSpawnInterval)
	zombieSpawnInterval = setInterval(spawnZombie, zombieInterval)
}

// Game loops
let zombieSpawnInterval = setInterval(spawnZombie, zombieInterval)
let sunSpawnInterval = setInterval(spawnSun, sunInterval)
let difficultyInterval = setInterval(increaseDifficulty, 30000)
