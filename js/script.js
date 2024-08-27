const menuBtn = document.querySelector('.menu');
const searchBox = document.querySelector('.search-box');
const addBook = document.querySelector('.add-book');

const searchBoxHandler = (e) => {
  if(e.target.closest('i:first-child')){
    searchBox.classList.remove('show');
  }else if(e.target.closest('i:last-child')){
    searchBox.querySelector('input').value = '';
  }
}

document.addEventListener('click', (e) => {
  if(e.target.closest('.search i')){
    searchBox.classList.toggle('show');
  }else if(e.target.closest('.menu .menu-button')){
    menuBtn.classList.toggle('open');
  }else if(e.target.closest('.search-box .close')){
    searchBoxHandler(e);
  }else if(e.target.closest('.add-book-btn')) {
    console.log(e.target)
    addBook.showModal();
  }else if(e.target.closest('.add-book .close')){
    console.log(e.target)
    addBook.close();
  }
})

document.querySelector('label[for="status-not-finished"]').addEventListener('click', function() {
  document.getElementById('finished-pages').focus();
});