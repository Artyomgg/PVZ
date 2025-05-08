const egg = document.querySelector('.egg')
const emeralds = document.querySelector('.emeralds')

let clickone = egg.addEventListener('click', () => {
    const random = Math.random() * 100
    
    egg.addEventListener('click', () => {
      if (random < 1) {
        egg.src = '/assets/img/Dragons/dragonskinone.png'
        egg.style.transform = 'scale(0.95)' 
        egg.addEventListener('click', () => {
          confirm('добавить скин1?')
        })
    } else if (random < 11) {
        egg.src = '/assets/img/Dragons/dragonskintwo.png'
        egg.style.transform = 'scale(0.80)' 
        egg.addEventListener('click', () => {
          confirm('добавить скин2?')
        })
    } else if (random < 20) {
        egg.src = '/assets/img/Dragons/dragonskinthree.png'
        egg.style.transform = 'scale(0.80)' 
        egg.addEventListener('click', () => {
          confirm('добавить скин3?')
        })
    } else {
        egg.style.opacity = 0
    }
  })
})
