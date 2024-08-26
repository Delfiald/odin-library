const searchBtn = document.querySelector('.search');
const menuBtn = document.querySelector('.menu');

document.addEventListener('click', (e) => {
  if(e.target.closest('.search i')){
    searchBtn.classList.toggle('open');
  }else if(e.target.closest('.menu .menu-button')){
    menuBtn.classList.toggle('open');
  }
})