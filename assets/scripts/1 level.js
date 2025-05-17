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
    sunSpawnChance: 0.2
  },
  ice: {
    cost: 75,
    damage: 2,
    shootInterval: 2000,
    projectileClass: 'iceball',
    freezeDuration: 2000
  },
}

const zombieTypes = {
  normal: {
    health: 4,
    speed: 25,
    points: 100,
    spawnChance: 1
  }
}

for (let i = 0; i < 40; i++) {
  const cell = document.createElement('div')
  cell.className = 'cell'
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
    cell.appendChild(dragon)

    if (selectedDragonType === 'blast') {
      startBlastDragon(dragon, dragonConfig, cell)
    } else {
      const shootIntervalId = setInterval(
        () => shoot(dragon, dragonConfig),
        dragonConfig.shootInterval
      )
      dragon.dataset.shootIntervalId = shootIntervalId

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
    if (isGameOver || !dragon.isConnected) {
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
      { left: `${gridRect.width}px` }
    ],
    {
      duration: 2000,
      easing: 'linear'
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

function freezeZombie(zombie, duration) {
  if (zombie.classList.contains('frozen')) return

  zombie.classList.add('frozen')
  zombie.dataset.slowMultiplier = '0'

  const iceOverlay = document.createElement('div')
  iceOverlay.className = 'ice-overlay'
  zombie.appendChild(iceOverlay)

  const timeoutId = setTimeout(() => {
    if (zombie.isConnected) {
      zombie.classList.remove('frozen')
      zombie.dataset.slowMultiplier = '1'
      iceOverlay.remove()
      delete zombie.dataset.freezeTimeoutId
    }
  }, duration)

  zombie.dataset.freezeTimeoutId = timeoutId
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
  zombie.dataset.slowMultiplier = '1'

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
          if (projectile.classList.contains(dragonTypes[type].projectileClass)) {
            damage = dragonTypes[type].damage
            if (type === 'ice') {
              freezeZombie(zombie, dragonTypes.ice.freezeDuration)
            }
            break
          }
        }

        if (projectile.classList.contains('fireball') && zombie.classList.contains('frozen')) {
          zombie.dataset.slowMultiplier = 1
          zombie.classList.remove('frozen')
          const iceOverlay = zombie.querySelector('.ice-overlay')
          if (iceOverlay) iceOverlay.remove()
          if (zombie.dataset.freezeTimeoutId) {
            clearTimeout(zombie.dataset.freezeTimeoutId)
            delete zombie.dataset.freezeTimeoutId
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

let zombieInterval = 4000
let sunInterval = 5000

function increaseDifficulty() {
  zombieInterval = Math.max(2000, zombieInterval - 500)
  clearInterval(zombieSpawnInterval)
  zombieSpawnInterval = setInterval(spawnZombie, zombieInterval)
}

let zombieSpawnInterval = setInterval(spawnZombie, zombieInterval)
let sunSpawnInterval = setInterval(spawnSun, sunInterval)
let difficultyInterval = setInterval(increaseDifficulty, 30000)