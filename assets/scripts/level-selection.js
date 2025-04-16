const arrowright = document.querySelector('.level-arrows:last-child')
const arrowleft = document.querySelector('.level-arrows:first-child')
const levels = document.querySelector('.levels-list')
const levelsprite = document.querySelector('.level-sprite')
let clicks = 0

const islands = {
    one: '../assets/img/Islands/island1.png',
    two: '../assets/img/Islands/island2.png',
    three: '../assets/img/Islands/island1.png', //потом вставить спрайты след. уровней
    four: '../assets/img/Islands/island1.png',
    five: '../assets/img/Islands/island1.png',
}

function updateLevelText() {
    let levelnumber = clicks + 1
    if (clicks >= 5) levelnumber = 5
    levels.innerText = `Уровень ${levelnumber}` 
}

function updateIsland(clicks) {
    alert('+') // проверка
	if (clicks === 5) {
		levelsprite.src = islands.five
	} else if (clicks === 4) {
		levelsprite.src = islands.four
	} else if (clicks === 3) {
		levelsprite.src = islands.three
	} else if (clicks === 2) {
		levelsprite.src = islands.two
	} else if (clicks === 1) {
		levelsprite.src = islands.one
	} else {
		levelsprite.src = islands.one
	}
}

function setupIsland() {
    updateLevelText()
    updateIsland(clicks)

    function clickHandler() {
        clicks++
        updateLevelText() 
        updateIsland(clicks) 
    }

    arrowright.addEventListener('click', clickHandler)
}

setupIsland()
