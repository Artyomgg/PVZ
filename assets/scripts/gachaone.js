const egg = document.querySelector('.egg')
const emeralds = document.querySelector('.emeralds')

let clickone = egg.addEventListener('click', () => {
    const random = Math.random() * 100
    
    if (random < 1) {
        egg.src = '/assets/img/Dragons/dragonskinone.png'
        egg.addEventListener('click', () => {
          alert('клик1')
        })
    } else if (random < 11) {
        egg.src = '/assets/img/Dragons/dragonskintwo.png'
        egg.addEventListener('click', () => {
          alert('клик2')
        })
    } else if (random < 20) {
        egg.src = '/assets/img/Dragons/dragonskinthree.png'
        egg.addEventListener('click', () => {
          alert('клик3')
        })
    } else {
        egg.style.opacity = 0
    }
  })
