const eggs = document.querySelectorAll('.egg');
const emeralds = document.querySelector('.emeralds');

for (let i = 0; i < eggs.length; i++) {
  const random = Math.random() * 100
    const egg = eggs[i];
    egg.addEventListener('click', () => {
      if (random < 1) {
        egg.src = '/assets/img/Dragons/dragonskinone.png'
        egg.style.transform = 'scale(0.95)' 
        egg.addEventListener('click', () => {
          let ans = confirm('добавить скин 1?')
          if(ans==true){
            localStorage.setItem('dragonSkin1', 'skinone') 
          }
        })
    } else if (random < 11) {
        egg.src = '/assets/img/Dragons/dragonskintwo.png'
        egg.style.transform = 'scale(0.80)' 
        egg.addEventListener('click', () => {
          let ans = confirm('добавить скин 2?')
          if(ans==true){
            localStorage.setItem('dragonSkin2', 'skintwo')  
          }
        })
    } else if (random < 20) {
        egg.src = '/assets/img/Dragons/dragonskinthree.png'
        egg.style.transform = 'scale(0.80)' 
        egg.addEventListener('click', () => {
          let ans = confirm('добавить скин 3?')
          if(ans==true){
            localStorage.setItem('dragonSkin3', 'skinthree') 
          }
        })
    } else {
        egg.style.opacity = 0
    }
  })
}