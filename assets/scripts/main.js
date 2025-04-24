function redirect(path) {
  if (path == "levels") {
    window.location.href = `pages/${path}.html`;
  } else if (path == "book") {
    window.location.href = `pages/${path}.html`;
  } else if (path == "dragon-grow") {
    window.location.href = `pages/${path}.html`;
  }
}

const liItems = document.querySelectorAll('.container ul li')
const gif = document.getElementById('gif')

for (let i = 0; i < liItems.length; i++) {
  liItems[i].addEventListener('mouseenter', function(e) {
    gif.style.opacity = '1'
    gif.style.transform = 'translate(-50%, -50%)'
    gif.style.top = `${e.clientY - 170}px`
    gif.style.left = `${gif.offsetLeft}px`
  })

  liItems[i].addEventListener('mousemove', function(e) {
    gif.style.top = `${e.clientY - 170}px`
  })

  liItems[i].addEventListener('mouseleave', function() {
    gif.style.opacity = '0'
  })
}
