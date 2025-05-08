const eggs = document.querySelectorAll('.egg');
const emeralds = document.querySelector('.emeralds');

for (let i = 0; i < eggs.length; i++) {
  const egg = eggs[i];
    egg.addEventListener('click', () => {
      egg.style.opacity = 0;
  })
}