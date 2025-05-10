const emeralds = document.querySelector('.emeralds')
let money = 0
const button1 = document.querySelector('.buttonone')
const button10 = document.querySelector('.buttonten')
const overlay = document.querySelector('.gif-overlay')


window.onload = function() {
  money = +localStorage.getItem('money') + +localStorage.getItem('score')
  localStorage.setItem('money', money)
  emeralds.innerText = money
  localStorage.removeItem('score')
}

//проигрывание гифки
document.addEventListener('DOMContentLoaded', function() {
  function showGif(url) {
    if (overlay) {
      overlay.style.display = 'flex'     
      setTimeout(() => {
        window.location.href = url
      }, 2000)
    }
  }

  if(money + localStorage.getItem('money')>=160){
    button1.addEventListener('click', (e) => {
      money -= 160
      localStorage.setItem('money', money)
      emeralds.innerText = localStorage.getItem('money')
      e.preventDefault()
      showGif(button1.getAttribute('href'))
      button1.href="gachaone.html"
    })
  } else button1.href="gacha.html"

  if(money + localStorage.getItem('money')>=1600){
    button10.addEventListener('click', (e) => {
      money -= 1600
      localStorage.setItem('money', money)
      emeralds.innerText = localStorage.getItem('money')
      e.preventDefault()
      showGif(button10.getAttribute('href'))
      button10.href="gachaten.html"
    })
  } else button10.href="gacha.html"
})