const eggs = document.querySelectorAll('.egg');
const emeralds = document.querySelector('.emeralds');

for (let i = 0; i < eggs.length; i++) {
  const random = Math.random() * 100
    const egg = eggs[i];
    egg.addEventListener('click', () => {
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
}