import { IntoLocalStorage } from './intoLocalStorage.js'

let sunCount = 100
let score = 0
let selectedDragonType = null
const grid = document.getElementById('grid')
const sunCountDisplay = document.getElementById('sunCount')
const scoreCountDisplay = document.getElementById('scoreCount')
let modalLose = document.querySelector('.modal.lose')
let modalWin = document.querySelector('.modal.win')
const SMOKE = document.querySelector('.smoke')
let isGameOver = false

const function

setInterval(SmokeOpacity, 10000)

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
		damage: 4,
		shootInterval: 1500,
		projectileClass: 'fireball',
		sunSpawnInterval: 50000000000000000000000000000000000000000000000000000000000000000000000000000000, // Интервал спавна солнца (5 секунд)
		sunSpawnChance: 0, // Шанс спавна солнца (10%)
	},
	ice: {
		cost: 75,
		damage: 7,
		shootInterval: 2000,
		projectileClass: 'iceball',
	},
	poison: {
		cost: 100,
		damage: 10,
		shootInterval: 2500,
		projectileClass: 'poisonball',
	},
	lightning: {
		cost: 150,
		damage: 16,
		shootInterval: 2000,
		projectileClass: 'lightningball',
	},
	blast: {
		cost: 100,
		damage: 100,
		flashDuration: 1000,
		flashCount: 3,
		explosionRadius: 3,
	},
}

// 2. МАССИВ ЗОМБИ
const zombieTypes = {
	normal: {
		health: 5,
		speed: 20,
		points: 100,
		spawnChance: 0.5,
	},
	armored: {
		health: 13,
		speed: 25,
		points: 150,
		spawnChance: 0.25,
	},
	hz: {
		health: 10,
		speed: 22,
		points: 175,
		spawnChance: 0.25,
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
				opt.style.border = '2px solid #985e01'
			})
			option.style.border = '2px solid #ff4757'
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
		if (selectedDragonType === 'blast') {
			startBlastDragon(dragon, dragonConfig, cell)
		} else {
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
}

function startBlastDragon(dragon, config, cell) {
	let flashCount = 0

	const flashInterval = setInterval(() => {
		if ((isGameOver = !dragon.isConnected)) {
			clearInterval(flashInterval)
			return
		}

		dragon.classList.toggle('flashing')
		flashCount++

		if (flashCount >= config.flashCount * 2) {
			clearInterval(flashInterval)
			triggerExplosion(dragon, config, cell)
		}
	}, config.flashDuration / 2)
	dragon.dataset.flashIntervalId = flashInterval
}

function triggerExplosion(dragon, config, cell) {
	if (isGameOver || !dragon.isConnected) return

	const explosion = document.createElement('div')
	explosion.className = 'blast-explosion'
	const cellRect = cell.getBoundingClientRect()
	const gridRect = grid.getBoundingClientRect()
	explosion.style.left = `${
		cellRect.left - gridRect.left + cellRect.width / 2 - 180
	}px`
	explosion.style.top = `${
		cellRect.top - gridRect.top + cellRect.height / 2 - 180
	}px`
	grid.appendChild(explosion)
	setTimeout(() => explosion.remove(), 500)

	const cellIndex = Array.from(grid.children).indexOf(cell)
	const row = Math.floor(cellIndex / 8)
	const col = cellIndex % 8
	const radius = config.explosionRadius

	const zombies = document.querySelectorAll('.zombie')
	zombies.forEach(zombie => {
		const zombieRow = parseInt(zombie.dataset.row)
		const zombieRect = zombie.getBoundingClientRect()
		const cellCenterX = cellRect.left + cellRect.width / 2
		const cellCenterY = cellRect.top + cellRect.height / 2
		const zombieCenterX = zombieRect.left + zombieRect.width / 2
		const zombieCenterY = zombieRect.top + zombieRect.height / 2

		const rowDiff = Math.abs(zombieRow - row)
		const colDiff =
			Math.abs(zombieCenterX - cellCenterX) / cellRect.width +
			Math.abs(zombieCenterY - cellCenterY) / cellRect.height

		if (rowDiff <= radius && colDiff <= radius) {
			let currentHealth = parseInt(zombie.dataset.health)
			currentHealth -= config.damage
			zombie.dataset.health = currentHealth.toString()

			const hitEffect = document.createElement('div')
			hitEffect.className = 'hit-effect'
			hitEffect.style.left = `${zombieRect.left - gridRect.left}px`
			hitEffect.style.top = `${zombieRect.top - gridRect.top}px`
			grid.appendChild(hitEffect)
			setTimeout(() => hitEffect.remove(), 500)

			if (currentHealth <= 0) {
				score += parseInt(zombie.dataset.points)
				scoreCountDisplay.textContent = score
				zombie.remove()
				if (score >= 1500) {
					clearInterval(zombieSpawnInterval)
					modalWin.classList.add('visible')
					IntoLocalStorage(1)
				}
			} else {
				zombie.classList.add('damaged')
				setTimeout(() => zombie.classList.remove('damaged'), 200)
			}
		}
	})

	dragon.remove()
}

// Функция спавна солнца рядом с драконом
function spawnSunNearDragon(dragon, cell) {
	if (isGameOver || Math.random() > dragonTypes.fire.sunSpawnChance) return

	const sun = document.createElement('div')
	sun.className = 'sun'

	// Позиционируем солнце рядом с драконом
	const cellRect = cell.getBoundingClientRect()
	const gridRect = grid.getBoundingClientRect()

	sun.style.left = `${
		cellRect.left - gridRect.left + (Math.random() * 150 - 30)
	}px`
	sun.style.top = `${cellRect.top - gridRect.top + (Math.random() * 60 - 30)}px`

	grid.appendChild(sun)

	sun.addEventListener('click', () => {
		if (!sun.classList.contains('collected')) {
			collectSun(sun)
		}
	})

	// Автоматическое исчезновение через 10 секунд, если не собрано
	setTimeout(() => {
		if (sun.isConnected && !sun.classList.contains('collected')) {
			sun.remove()
		}
	}, 10000)
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
					if (score >= 5000) {
						clearInterval(zombieSpawnInterval)
						modalWin.classList.add('visible')
						IntoLocalStorage(4)
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
	sun.style.left = `${Math.random() * 150}%`
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
let sunInterval = 8000

function increaseDifficulty() {
	zombieInterval = Math.max(2000, zombieInterval - 500)
	clearInterval(zombieSpawnInterval)
	zombieSpawnInterval = setInterval(spawnZombie, zombieInterval)
}

function lightningAttack(dragon, config) {
	if (isGameOver) return

	const dragonRect = dragon.getBoundingClientRect()
	const gridRect = grid.getBoundingClientRect()
	const cellWidth = gridRect.width / 8
	const cellHeight = gridRect.height / 5

	const dragonCell = dragon.parentElement
	const cellIndex = Array.from(grid.children).indexOf(dragonCell)
	const row = Math.floor(cellIndex / 8)
	const col = cellIndex % 8

	const dragonX = dragonRect.left - gridRect.left + dragonRect.width / 2
	const dragonY = dragonRect.top - gridRect.top + dragonRect.height / 2

	for (let i = 1; i <= 2; i++) {
		if (col + i >= 8) break

		const targetCellIndex = row * 8 + (col + i)
		const targetCell = grid.children[targetCellIndex]

		if (!targetCell) continue

		const targetX = targetCell.offsetLeft + cellWidth / 2
		const targetY = targetCell.offsetTop + cellHeight / 2

		createLightningBolt(dragonX, dragonY, targetX, targetY)

		const lightningEffect = document.createElement('div')
		lightningEffect.className = 'lightning-effect'
		lightningEffect.style.width = `${cellWidth}px`
		lightningEffect.style.height = `${cellHeight}px`
		lightningEffect.style.left = `${targetCell.offsetLeft}px`
		lightningEffect.style.top = `${targetCell.offsetTop}px`
		grid.appendChild(lightningEffect)

		setTimeout(() => lightningEffect.remove(), 500)

		damageZombiesInArea(targetCell, cellWidth, cellHeight, config.damage)
	}
}

function createLightningBolt(x1, y1, x2, y2) {
	const bolt = document.createElement('div')
	bolt.className = 'lightning-bolt'

	const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
	const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI

	bolt.style.width = `${length}px`
	bolt.style.left = `${x1}px`
	bolt.style.top = `${y1}px`
	bolt.style.transformOrigin = '0 0'
	bolt.style.transform = `rotate(${angle}deg)`

	grid.appendChild(bolt)
	setTimeout(() => bolt.remove(), 200)
}

function damageZombiesInArea(cell, width, height, damage) {
	const zombies = document.querySelectorAll('.zombie')
	const gridRect = grid.getBoundingClientRect()
	const cellRight = cell.offsetLeft + width
	const cellBottom = cell.offsetTop + height

	zombies.forEach(zombie => {
		const zombieRect = zombie.getBoundingClientRect()
		const zombieLeft = zombieRect.left - gridRect.left
		const zombieRight = zombieRect.right - gridRect.left
		const zombieTop = zombieRect.top - gridRect.top
		const zombieBottom = zombieRect.bottom - gridRect.top

		if (
			zombieRight > cell.offsetLeft &&
			zombieLeft < cellRight &&
			zombieBottom > cell.offsetTop &&
			zombieTop < cellBottom
		) {
			const overlapX =
				Math.min(zombieRight, cellRight) - Math.max(zombieLeft, cell.offsetLeft)
			const overlapY =
				Math.min(zombieBottom, cellBottom) - Math.max(zombieTop, cell.offsetTop)
			const overlapArea = overlapX * overlapY
			const zombieArea = zombieRect.width * zombieRect.height

			if (overlapArea > zombieArea * 0.25) {
				applyDamage(zombie, damage)
			}
		}
	})
}

function applyDamage(zombie, damage) {
	let currentHealth = parseInt(zombie.dataset.health)
	currentHealth -= damage
	zombie.dataset.health = currentHealth.toString()

	const hitEffect = document.createElement('div')
	hitEffect.className = 'lightning-hit-effect'
	const zombieRect = zombie.getBoundingClientRect()
	hitEffect.style.left = `${zombieRect.left - zombieRect.width / 2}px`
	hitEffect.style.top = `${zombieRect.top - zombieRect.height / 2}px`
	hitEffect.style.width = `${zombieRect.width * 2}px`
	hitEffect.style.height = `${zombieRect.height * 2}px`
	document.body.appendChild(hitEffect)

	setTimeout(() => {
		hitEffect.remove()
	}, 300)

	if (currentHealth <= 0) {
		score += parseInt(zombie.dataset.points)
		scoreCountDisplay.textContent = score
		zombie.remove()
	} else {
		zombie.classList.add('damaged')
		setTimeout(() => zombie.classList.remove('damaged'), 200)
	}
}

// Game loops
let zombieSpawnInterval = setInterval(spawnZombie, zombieInterval)
let sunSpawnInterval = setInterval(spawnSun, sunInterval)
let difficultyInterval = setInterval(increaseDifficulty, 30000)

function SmokeOpacity() {
	SMOKE.style.opacity = '0'
	setTimeout(smokeOne, 2000)
	function smokeOne() {
		SMOKE.style.opacity = '1'
	}
}
