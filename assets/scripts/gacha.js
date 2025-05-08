const emeralds = document.querySelector('.emeralds')
let money = 1600
const button1 = document.querySelector('.buttonone')
const button10 = document.querySelector('.buttonten')
const overlay = document.querySelector('.gif-overlay')


window.onload = function() {
  emeralds.innerText = money
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

  if(money>=160){
    button1.addEventListener('click', (e) => {
      e.preventDefault()
      showGif(button1.getAttribute('href'))
      button1.href="gachaone.html"
    })
  } else button1.href="gacha.html"

  if(money>=1600){
    button10.addEventListener('click', (e) => {
      e.preventDefault()
      showGif(button10.getAttribute('href'))
      button10.href="gachaten.html"
    })
  } else button10.href="gacha.html"
})