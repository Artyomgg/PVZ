const egg = document.querySelector('.egg')
const emeralds = document.querySelector('.emeralds')

egg.addEventListener('click', () => {
    const random = Math.random() * 100
    
    if (random < 1) {
        egg.src = '/assets/img/Dragons/dragonskinone.png'
    } else if (random < 10) {
        egg.src = '/assets/img/Dragons/dragonskintwo.png'
    } else if (random < 10) {
        egg.src = '/assets/img/Dragons/dragonskinthree.png'
    } else {
        egg.style.opacity = 0
    }
})  