let sunCount = 100
let score = 0
let selectedDragonType = null
const grid = document.getElementById('grid')
const sunCountDisplay = document.getElementById('sunCount')
const scoreCountDisplay = document.getElementById('scoreCount')

// Dragon types configuration
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

// Zombie types configuration
const zombieTypes = {
	normal: {
		health: 3,
		speed: 20,
		points: 100,
	},
	armored: {
		health: 5,
		speed: 25,
		points: 200,
	},
}

// Create grid
for (let i = 0; i < 40; i++) {
	const cell = document.createElement('div')
	cell.className = 'cell'
	cell.addEventListener('click', () => placeDragon(cell))
	grid.appendChild(cell)
}

// Setup dragon selection menu
document.querySelectorAll('.dragon-option').forEach(option => {
	option.addEventListener('click', () => {
		selectedDragonType = option.dataset.type
		document
			.querySelectorAll('.dragon-option')
			.forEach(opt => (opt.style.border = '2px solid #00903a'))
		option.style.border = '2px solid #ff4757'
	})
})

function placeDragon(cell) {
	if (!selectedDragonType) return

	const dragonConfig = dragonTypes[selectedDragonType]
	if (sunCount >= dragonConfig.cost && !cell.hasChildNodes()) {
		sunCount -= dragonConfig.cost
		sunCountDisplay.textContent = sunCount

		const dragon = document.createElement('div')
		dragon.className = `dragon ${selectedDragonType}`
		cell.appendChild(dragon)

		// Start shooting
		const intervalId = setInterval(
			() => shoot(dragon, dragonConfig),
			dragonConfig.shootInterval
		)
		dragon.dataset.intervalId = intervalId
	}
}

function shoot(dragon, config) {
	// Add shooting animation to dragon
	dragon.classList.add('shooting')
	setTimeout(() => dragon.classList.remove('shooting'), 300)

	const projectile = document.createElement('div')
	projectile.className = `projectile ${config.projectileClass}`

	// Get dragon's position
	const dragonRect = dragon.getBoundingClientRect()
	const gridRect = grid.getBoundingClientRect()

	// Position projectile at dragon's position
	projectile.style.left = `${dragonRect.left - gridRect.left}px`
	projectile.style.top = `${
		dragonRect.top - gridRect.top + dragon.offsetHeight / 2
	}px`

	grid.appendChild(projectile)

	// Create trail effect for projectiles
	let trailInterval
	if (config.projectileClass === 'fireball') {
		trailInterval = createFireballTrail(projectile, gridRect)
	} else if (config.projectileClass === 'iceball') {
		trailInterval = createIceballTrail(projectile, gridRect)
	}

	// Animate projectile
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

function createFireballTrail(projectile, gridRect) {
	return setInterval(() => {
		const trail = document.createElement('div')
		trail.className = 'fireball trail'
		trail.style.left = projectile.style.left
		trail.style.top = projectile.style.top
		grid.appendChild(trail)

		setTimeout(() => trail.remove(), 200)
	}, 50)
}

function createIceballTrail(projectile, gridRect) {
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
	const zombie = document.createElement('div')
	const isArmored = Math.random() > 0.7
	const zombieConfig = isArmored ? zombieTypes.armored : zombieTypes.normal

	zombie.className = `zombie ${isArmored ? 'armored' : ''}`
	zombie.style.setProperty('--move-duration', `${zombieConfig.speed}s`)

	const row = Math.floor(Math.random() * 5)
	zombie.style.top = `${row * 20}%`
	zombie.dataset.health = zombieConfig.health.toString()
	zombie.dataset.points = zombieConfig.points.toString()
	zombie.dataset.row = row.toString() // Сохраняем ряд зомби

	grid.appendChild(zombie)

	// Новая система проверки позиции
	const checkGameOver = () => {
		// Получаем все ячейки в ряду зомби
		const cells = document.querySelectorAll(`.cell:nth-child(${row * 8 + 1})`)
		if (cells.length === 0) return

		// Проверяем, находится ли зомби в первой ячейке
		const zombieRect = zombie.getBoundingClientRect()
		const firstCellRect = cells[0].getBoundingClientRect()

		if (zombieRect.right <= firstCellRect.left + firstCellRect.width / 2) {
			// Зомби достиг конца
			alert(`Game Over! Final Score: ${score}`)
			location.reload()
		}
	}

	// Проверка коллизий
	const checkCollision = setInterval(() => {
		if (!zombie.isConnected) {
			clearInterval(checkCollision)
			return
		}

		// Проверяем позицию зомби
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
				// Обработка попадания
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
				} else {
					zombie.classList.add('damaged')
					setTimeout(() => zombie.classList.remove('damaged'), 200)
				}
			}
		})
	}, 100)
}

function collectSun(sun) {
	sun.classList.add('collected')

	// Calculate position of sun counter
	const counter = document.getElementById('sunCount')
	const counterRect = counter.getBoundingClientRect()
	const sunRect = sun.getBoundingClientRect()

	// Animate sun to counter position
	sun.style.position = 'fixed'
	sun.style.left = `${sunRect.left}px`
	sun.style.top = `${sunRect.top}px`

	// Add sun value and update display
	sunCount += 50
	sunCountDisplay.textContent = sunCount

	// Remove sun after animation
	setTimeout(() => sun.remove(), 500)
}

function spawnSun() {
	const sun = document.createElement('div')
	sun.className = 'sun'
	sun.style.left = `${Math.random() * 90}%`
	grid.appendChild(sun)

	// Make sun interactive
	sun.addEventListener('click', () => {
		if (!sun.classList.contains('collected')) {
			collectSun(sun)
		}
	})

	// Remove sun if not collected
	sun.addEventListener('animationend', () => {
		if (!sun.classList.contains('collected')) {
			sun.remove()
		}
	})
}

// Difficulty progression
let zombieInterval = 7000
let sunInterval = 5000

function increaseDifficulty() {
	zombieInterval = Math.max(2000, zombieInterval - 500)
	clearInterval(zombieSpawnInterval)
	zombieSpawnInterval = setInterval(spawnZombie, zombieInterval)
}

// Game loops
let zombieSpawnInterval = setInterval(spawnZombie, zombieInterval)
setInterval(spawnSun, sunInterval)
setInterval(increaseDifficulty, 30000)
