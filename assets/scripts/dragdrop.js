document.addEventListener('DOMContentLoaded', () => {
	const gameContainer = document.getElementById('game-container')
	const lawn = document.getElementById('lawn')
	const plantOptions = document.querySelectorAll('.plant-option')
	const lawnCells = document.querySelectorAll('.lawn-cell')

	let currentDraggedPlant = null
	let ghostElement = null
	let isDragging = false
	let highlightElement = null

	// Функция для центрирования растения в клетке
	function centerPlantInCell(plant, cell) {
		const cellRect = cell.getBoundingClientRect()
		const containerRect = gameContainer.getBoundingClientRect()

		// Вычисляем позицию для центрирования
		const x = cellRect.left - containerRect.left + (cellRect.width - 60) / 2
		const y = cellRect.top - containerRect.top + (cellRect.height - 80) / 2

		plant.style.left = `${x}px`
		plant.style.top = `${y}px`
	}

	// Plant selection
	plantOptions.forEach(option => {
		option.addEventListener('mousedown', e => {
			if (e.button !== 0) return

			currentDraggedPlant = e.target.dataset.plant
			isDragging = true

			// Create ghost element
			ghostElement = document.createElement('div')
			ghostElement.className = 'plant-ghost'
			ghostElement.textContent = getPlantEmoji(currentDraggedPlant)
			document.body.appendChild(ghostElement)

			updateGhostPosition(e)
			e.target.classList.add('dragging')

			e.preventDefault()
		})
	})

	// Update ghost position
	function updateGhostPosition(e) {
		if (!ghostElement) return

		ghostElement.style.left = `${e.clientX - 30}px`
		ghostElement.style.top = `${e.clientY - 40}px`

		// Highlight potential drop cell
		const cell = document
			.elementFromPoint(e.clientX, e.clientY)
			.closest('.lawn-cell')
		if (cell && !cell.querySelector('.plant')) {
			// Remove previous highlight
			if (highlightElement) {
				highlightElement.remove()
			}

			// Add new highlight
			highlightElement = document.createElement('div')
			highlightElement.className = 'cell-highlight'
			cell.appendChild(highlightElement)
		} else if (highlightElement) {
			highlightElement.remove()
			highlightElement = null
		}
	}

	// Mouse move for dragging
	document.addEventListener('mousemove', e => {
		if (!isDragging) return
		updateGhostPosition(e)
	})

	// Mouse up to place plant
	document.addEventListener('mouseup', e => {
		if (!isDragging) return

		// Find the cell under mouse
		const cell = document
			.elementFromPoint(e.clientX, e.clientY)
			.closest('.lawn-cell')

		if (cell && !cell.querySelector('.plant')) {
			// Create new plant
			const plant = document.createElement('div')
			plant.className = 'plant'
			plant.dataset.plant = currentDraggedPlant
			plant.dataset.row = cell.dataset.row
			plant.dataset.col = cell.dataset.col
			plant.textContent = getPlantEmoji(currentDraggedPlant)

			// Центрируем растение в клетке
			centerPlantInCell(plant, cell)

			lawn.appendChild(plant)

			// Make plant draggable
			makePlantDraggable(plant, cell)
		}

		// Clean up
		if (ghostElement) {
			ghostElement.remove()
			ghostElement = null
		}

		if (highlightElement) {
			highlightElement.remove()
			highlightElement = null
		}

		plantOptions.forEach(opt => opt.classList.remove('dragging'))
		currentDraggedPlant = null
		isDragging = false
	})

	// Make existing plants draggable
	function makePlantDraggable(plant, originalCell) {
		let isPlantDragging = false
		let startX, startY
		let startLeft, startTop
		let currentCell = originalCell

		plant.addEventListener('mousedown', e => {
			if (e.button !== 0) return

			isPlantDragging = true
			startX = e.clientX
			startY = e.clientY
			startLeft = parseInt(plant.style.left)
			startTop = parseInt(plant.style.top)

			plant.style.zIndex = '20'
			plant.style.cursor = 'grabbing'

			e.preventDefault()
		})

		document.addEventListener('mousemove', e => {
			if (!isPlantDragging) return

			const dx = e.clientX - startX
			const dy = e.clientY - startY

			plant.style.left = `${startLeft + dx}px`
			plant.style.top = `${startTop + dy}px`

			// Highlight potential drop cell
			const hoverCell = document
				.elementFromPoint(e.clientX, e.clientY)
				.closest('.lawn-cell')
			if (
				hoverCell &&
				(!hoverCell.querySelector('.plant') || hoverCell === currentCell)
			) {
				// Remove previous highlight
				if (highlightElement) {
					highlightElement.remove()
				}

				// Add new highlight
				highlightElement = document.createElement('div')
				highlightElement.className = 'cell-highlight'
				hoverCell.appendChild(highlightElement)
			} else if (highlightElement) {
				highlightElement.remove()
				highlightElement = null
			}
		})

		document.addEventListener('mouseup', e => {
			if (!isPlantDragging) return

			isPlantDragging = false
			plant.style.zIndex = '10'
			plant.style.cursor = 'grab'

			// Find drop cell
			const newCell = document
				.elementFromPoint(e.clientX, e.clientY)
				.closest('.lawn-cell')

			if (
				newCell &&
				(!newCell.querySelector('.plant') || newCell === currentCell)
			) {
				// Центрируем растение в новой клетке
				centerPlantInCell(plant, newCell)
				currentCell = newCell
				plant.dataset.row = newCell.dataset.row
				plant.dataset.col = newCell.dataset.col
			} else {
				// Возвращаем в исходную клетку
				centerPlantInCell(plant, currentCell)
			}

			if (highlightElement) {
				highlightElement.remove()
				highlightElement = null
			}
		})
	}

	function getPlantEmoji(plantType) {
		const emojis = {
			peashooter: '🌱',
			sunflower: '🌻',
			wallnut: '🥜',
			cherry: '🍒',
			snowpea: '❄️',
		}
		return emojis[plantType] || '🌱'
	}
})
