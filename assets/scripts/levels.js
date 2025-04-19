let sunCount = 100
let score = 0
let selectedDragonType = null
const grid = document.getElementById('grid')
const sunCountDisplay = document.getElementById('sunCount')
const scoreCountDisplay = document.getElementById('scoreCount')

// типы драконов
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

for (let i = 0; i < 40; i++) {
	const cell = document.createElement('div')
	cell.className = 'cell'
	cell.addEventListener('click', () => placeDragon(cell))
	grid.appendChild(cell)
}

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

		// начало стрельбы дракона
		setInterval(() => shoot(dragon, dragonConfig), dragonConfig.shootInterval)
	}
}

function shoot(dragon, config) {
	// добавляем анимацию стрельбы драконов
	dragon.classList.add('shooting')
	setTimeout(() => dragon.classList.remove('shooting'), 300)

	const projectile = document.createElement('div')
	projectile.className = `projectile ${config.projectileClass}`

	// позиции драконов
	const dragonRect = dragon.getBoundingClientRect()
	const gridRect = grid.getBoundingClientRect()

	projectile.style.left = `${dragonRect.left - gridRect.left}px`
	projectile.style.top = `${
		dragonRect.top - gridRect.top + dragon.offsetHeight / 2
	}px`

	grid.appendChild(projectile)

	let trailInterval
	if (config.projectileClass === 'fireball') {
		trailInterval = createFireballTrail(projectile, gridRect)
	} else if (config.projectileClass === 'iceball') {
		trailInterval = createIceballTrail(projectile, gridRect)
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

	// удаляем солнце после анимации
	setTimeout(() => sun.remove(), 500)
}

function spawnSun() {
	const sun = document.createElement('div')
	sun.className = 'sun'
	sun.style.left = `${Math.random() * 90}%`
	grid.appendChild(sun)

	// делаем солнца кликабельными
	sun.addEventListener('click', () => {
		if (!sun.classList.contains('collected')) {
			collectSun(sun)
		}
	})

	// удаляем солнце если игрок по нему не кликнул
	sun.addEventListener('animationend', () => {
		if (!sun.classList.contains('collected')) {
			sun.remove()
		}
	})
}

let sunInterval = 5000

setInterval(spawnSun, sunInterval)
setInterval(increaseDifficulty, 30000)
