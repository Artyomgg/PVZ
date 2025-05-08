const eggs = document.querySelectorAll('.egg');
const emeralds = document.querySelector('.emeralds');

for (let i = 0; i < eggs.length; i++) {
  const random = Math.random() * 100
    const egg = eggs[i];
    egg.addEventListener('click', () => {
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
}