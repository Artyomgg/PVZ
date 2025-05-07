//проигрывание гифки
document.addEventListener('DOMContentLoaded', function() {
  function showGifAndRedirect(url) {
    const overlay = document.querySelector('.gif-overlay')
    if (overlay) {
      overlay.style.display = 'flex'
      setTimeout(() => {
        window.location.href = url
      }, 2000)
    }
  }

  const buttons = document.querySelectorAll('.but')
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', (e) => {
      e.preventDefault()
      showGifAndRedirect(buttons[i].getAttribute('href'))
    })
  }
}) 