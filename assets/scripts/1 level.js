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
		speed: 25,
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

function spawnSunNearDragon(dragon, cell) {
	if (isGameOver || Math.random() > dragonTypes.fire.sunSpawnChance) return

	const sun = document.createElement('div')
	sun.className = 'sun'

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

	const zombieType = 'normal'
	const zombieConfig = zombieTypes[zombieType]
	const zombie = document.createElement('div')
	zombie.className = `zombie ${zombieType}`

	let isVulnerable = true
	const baseSpeed = zombieConfig.speed
	const cellWidth = grid.offsetWidth / 8
	let currentPosition = 0

	// Устанавливаем ряд зомби
	const row = Math.floor(Math.random() * 5)
	zombie.dataset.row = row
	zombie.style.top = `${row * 20}%`
	zombie.style.setProperty('--move-duration', `${baseSpeed}s`)
	zombie.dataset.health = zombieConfig.health
	zombie.dataset.points = zombieConfig.points

	grid.appendChild(zombie)

	// В функции moveZombie():
	function moveZombie() {
		if (!zombie.isConnected || isGameOver) return

		const speedMultiplier = parseFloat(zombie.dataset.slowMultiplier) || 1
		currentPosition += cellWidth * 0.015 * speedMultiplier
		zombie.style.left = `${currentPosition}px`
		checkGameOver()
		requestAnimationFrame(moveZombie)
	}

	const checkGameOver = () => {
		const zombieRect = zombie.getBoundingClientRect()
		const firstCell = document.querySelector(
			`.cell[data-row="${row}"][data-col="0"]`
		)

		if (
			firstCell &&
			zombieRect.right <= firstCell.getBoundingClientRect().left
		) {
			GameOver()
		}
	}

	const checkCollision = setInterval(() => {
		if (!zombie.isConnected) {
			clearInterval(checkCollision)
			return
		}

		const zombieRect = zombie.getBoundingClientRect()
		const zombieRow = zombie.dataset.row

		document.querySelectorAll('.dragon').forEach(dragon => {
			if (!dragon.isConnected || !isVulnerable) return

			const dragonRect = dragon.getBoundingClientRect()
			const dragonRow = dragon.parentElement.dataset.row

			if (isColliding(zombieRect, dragonRect) && zombieRow === dragonRow) {
				isVulnerable = false

				anime({
					targets: zombie,
					translateX: '-=96',
					translateY: ['-60px', '0px'],
					easing: 'easeOutQuad',
					duration: 800,
					complete: () => {
						isVulnerable = true
						checkGameOver()
					},
				})
			}
		})
	}, 100)

	const hitCheck = setInterval(() => {
		if (!zombie.isConnected) {
			clearInterval(hitCheck)
			return
		}

		if (isVulnerable) {
			const zombieRect = zombie.getBoundingClientRect() // <-- Перемещаем сюда
			document.querySelectorAll('.projectile').forEach(projectile => {
				if (!projectile.isConnected) return // Добавляем проверку существования

				const projectileRect = projectile.getBoundingClientRect()

				if (isColliding(zombieRect, projectileRect)) {
					const damage = projectile.classList.contains('fireball')
						? dragonTypes.fire.damage
						: dragonTypes.ice.damage

					zombie.dataset.health = parseInt(zombie.dataset.health) - damage

					if (zombie.dataset.health <= 0) {
						zombie.remove()
						score += parseInt(zombie.dataset.points)
						scoreCountDisplay.textContent = score
					} else if (projectile.classList.contains('iceball')) {
						freezeZombie(zombie)
					}

					projectile.remove()
				}
			})
		}
	}, 50)

	moveZombie()
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

	if (zombie.dataset.freezeTimeoutId) {
		clearTimeout(zombie.dataset.freezeTimeoutId)
	}

	zombie.dataset.slowMultiplier = 0.3 // Сильное замедление
	zombie.classList.add('frozen')

	const timeoutId = setTimeout(() => {
		if (zombie.isConnected) {
			zombie.dataset.slowMultiplier = 1
			zombie.classList.remove('frozen')
			delete zombie.dataset.freezeTimeoutId
		}
	}, 1000)

	zombie.dataset.freezeTimeoutId = timeoutId
}

let zombieSpawnInterval = setInterval(spawnZombie, zombieInterval)
let sunSpawnInterval = setInterval(spawnSun, sunInterval)
let difficultyInterval = setInterval(increaseDifficulty, 30000)
