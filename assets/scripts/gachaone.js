const egg = document.querySelector('.egg')
const emeralds = document.querySelector('.emeralds')

window.onload = function() {
  emeralds.innerText = localStorage.getItem('money')
}

let clickone = egg.addEventListener('click', () => {
    const random = Math.random() * 100
    
    egg.addEventListener('click', () => {
      if (random < 1) {
        egg.src = '/assets/img/Dragons/dragonskinone.png'
        egg.style.transform = 'scale(0.95)' 
        egg.addEventListener('click', () => {
          let ans = confirm('добавить скин?')
          if(ans==true){
            localStorage.setItem('dragonSkin1', 'skinone') 
            egg.style.opacity = 0
          }
        })
    } else if (random < 11) {
        egg.src = '/assets/img/Dragons/dragonskintwo.png'
        egg.style.transform = 'scale(0.80)' 
        egg.addEventListener('click', () => {
          let ans = confirm('добавить скин?')
          if(ans==true){
            localStorage.setItem('dragonSkin2', 'skintwo') 
            egg.style.opacity = 0
          }
        })
    } else if (random < 20) {
        egg.src = '/assets/img/Dragons/dragonskinthree.png'
        egg.style.transform = 'scale(0.80)' 
        egg.addEventListener('click', () => {
          let ans = confirm('добавить скин?')
          if(ans==true){
            localStorage.setItem('dragonSkin3', 'skinthree') 
            egg.style.opacity = 0
          }
        })
    } else {
        egg.style.opacity = 0
    }
  })
})
