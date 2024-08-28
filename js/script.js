const menuBtn = document.querySelector('.menu');
const searchBox = document.querySelector('.search-box');
const addBook = document.querySelector('.add-book');
const bookDetails = document.querySelector('.book-details');
const addStatusNotFinished = document.querySelector('label[for="status-not-finished"]');
const deleteBook = document.querySelector('.delete-book-confirm');
const card = document.querySelector('.card');

const allBook = document.querySelector('.all-book .section-content');

const searchBoxHandler = (e) => {
  if(e.target.closest('i:first-child')){
    searchBox.classList.remove('show');
  }else if(e.target.closest('i:last-child')){
    searchBox.querySelector('input').value = '';
  }
}

// Book Constructor
const myListBook = [];

function Book (title, author, pages, status) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.status = status;
  this.currentPages = 0;
}

Book.prototype.setCurrentPages = function(currentPages) {
  this.currentPages = currentPages;

  console.log(currentPages)
  console.log(this.pages);

  if(currentPages == this.pages) {
    this.status = 'read';
  }
}

Book.prototype.setCover = function(cover) {
  this.cover = cover;
}

// Input Validity Check
const handleValidity = (item) => {
  let isFinishedInput = false;

  if (item.name === 'finished-pages') {
    isFinishedInput = true;
    item.setCustomValidity('');
    console.log("set");
  }

  const isValid = item.reportValidity();

  if (!isValid) {
    if(item.type === 'radio'){
      document.querySelector('.add-book .input.read').classList.add('invalid');
    }

    return {isValid: false, isFinishedInput};
  }

  return {isValid: true, isFinishedInput};
}

// Reset Input
const resetInput = (inputs) => {
  inputs.forEach((input) => {
    if(input.type === 'radio'){
      input.checked = false;
    }else{
      input.value = '';
    }
  })
}

// Add Book Handler
const addBookHandler = (e) => {
  const inputList = {};
  const inputs = addBook.querySelectorAll('input');
  
  let finishedPagesInput = null;

  let isFormValid = true;
  let i = 0;
  for (let item of inputs) {
    const {isValid, isFinishedInput} = handleValidity(item, i);
    
    if(!isValid){
      isFormValid = false;
      break;
    }

    if(isFinishedInput) finishedPagesInput = item;
    
    if(item.type === 'radio' && item.checked){
      inputList[item.name] = item.value;
    } else if(item.type !== 'radio'){
      inputList[item.name] = item.value;
    }
  }

  if (!isFormValid) {
    return;
  }

  const newBook = new Book(inputList['title'], inputList['author'], inputList['pages'], inputList['status']);

  const finishedPages = parseFloat(inputList['finished-pages']);
  const totalPages = parseFloat(inputList['pages']);
  
  if(inputList['status'] === 'not-finished') {
    if(finishedPages > totalPages || finishedPages === '' || finishedPages === '0'){
      finishedPagesInput.setCustomValidity(`Please enter a valid page number between 1 and ${totalPages}.`);
      finishedPagesInput.reportValidity();
      return;
    }
    newBook.setCurrentPages(finishedPages);
  }else if(inputList['status'] === 'read') {
    newBook.setCurrentPages(totalPages);
  }

  myListBook.push(newBook);
  resetInput(inputs);
  addBook.close();

  showBookHandler();
}

// Show Book
const showBookHandler = () => {
  const cloneCard = card.cloneNode(true);
  const cardTitle = cloneCard.querySelector('.book-title');
  const readStatus = cloneCard.querySelector('.read .status');
  const readIndicator= cloneCard.querySelector('.read .read-indicator');
  myListBook.forEach((book) => {
    cardTitle.textContent = book['title'];
    readStatus.textContent = book['status'].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    readIndicatorHandler(readIndicator, readStatus.textContent);

    allBook.appendChild(cloneCard);
  })
}

// Set Read Indicator
const readIndicatorHandler = (readIndicator, read) => {
  let indicator;

  readIndicator.classList.remove('readed');
  readIndicator.classList.remove('not-readed');
  readIndicator.classList.remove('unfinished');

  if(read === 'Read'){
    indicator = 'readed';
  }else if(read === 'Not Read'){
    indicator = 'not-readed'
  }else if(read === 'Not Finished'){
    indicator = 'unfinished'
  }

  readIndicator.classList.add(indicator);
}

// Show Book Detail
let activeBook;

const bookDetailHandler = (e) => {
  const card = e.target.closest('.all-book .card');
  const bookIndex = Array.from(document.querySelectorAll('.all-book .card')).indexOf(card);

  bookDetails.classList.add('show');

  activeBook = myListBook[bookIndex - 3];
  
  bookDetails.querySelector('.title > *').textContent = activeBook['title'];
  bookDetails.querySelector('.author > *').textContent = activeBook['author'];
  bookDetails.querySelector('.read-status .details-current-pages').value = activeBook['currentPages'];
  bookDetails.querySelector('.read-status .details-total-pages').textContent = activeBook['pages'];

  const detailStatus = bookDetails.querySelectorAll('.set-status input');

  const detailStatusText = bookDetails.querySelector('.set-read-status h2');

  let isInput;

  detailStatus.forEach((input) => {
    console.log(input.value +" "+activeBook['status']);
    if(input.value == activeBook['status']){
      input.checked = true;
      isInput = input;
    }
  })

  detailStatusHandler(detailStatusText, isInput);
  detailStatusTextHandler();
}

// Edit Details Status
const detailStatusHandler = (detailStatusText, isInput) => {
  if(isInput.value == 'read') {
    detailStatusText.textContent = 'Finished';
  }else if(isInput.value == 'not-read') {
    detailStatusText.textContent = 'Not Read Yet';
  }else if(isInput.value == 'not-finished') {
    detailStatusText.textContent = 'Not Finished';
  }
}

const detailStatusTextHandler = () => {
  const isInput = bookDetails.querySelectorAll('.set-status input');

  const detailText = bookDetails.querySelector('.set-read-status h2');

  const currentPagesInput = bookDetails.querySelector('.details-current-pages');
  
  isInput.forEach((input) => {
    if (input.checked) {
      if (input.value == 'read') {
        detailText.textContent = 'Finished';
        currentPagesInput.disabled = true;
      } else if (input.value == 'not-read') {
        detailText.textContent = 'Not Read Yet';
        currentPagesInput.disabled = true;
      } else if (input.value == 'not-finished') {
        detailText.textContent = 'Not Finished';
        currentPagesInput.disabled = false;
      }
    }
  });
}

// Edit Status
const editStatusHandler = () => {
  const statusActive = bookDetails.querySelectorAll('.set-status input');
  const currentPagesInput = bookDetails.querySelector('.details-current-pages');

  statusActive.forEach((radio) => {
    if(radio.checked){
      activeBook['status'] = radio.value;
      if(radio.value == 'not-read') {
        activeBook['currentPages'] = 0;
      }else if(radio.value == 'read') {
        activeBook['currentPages'] = activeBook['pages'];
      }else if(radio.value == 'not-finished') {
        const isValid = currentPagesValidation(currentPagesInput.value, activeBook['pages'], currentPagesInput);
        if(isValid === 0){
          activeBook['status'] = 'not-read';
          activeBook['currentPages'] = 0;
        }else if(isValid === 1) {
          activeBook['status'] = 'read';
          activeBook['currentPages'] = activeBook['pages'];
        }else if(isValid != -1){
          activeBook['currentPages'] = currentPagesInput.value;
        }
      }
    }
  })
  
  updateBookCard(activeBook);
}

const currentPagesValidation = (currentPages, totalPages, input) => {
  if(parseFloat(currentPages) > parseFloat(totalPages)){
    input.setCustomValidity(`Please enter a valid page number between 1 and ${totalPages}.`);
    input.reportValidity();
    return -1;
  }else {
    input.setCustomValidity('');
    if(input.value == 0){
      return 0;
    }else if(input.value == parseFloat(totalPages)){
      return 1;
    }
  }
}

const updateBookCard = (activeBook) => {
  const index = myListBook.findIndex(book => book == activeBook);

  const card = document.querySelectorAll('.all-book .card');
  
  currentCard = card[index + 3];

  const readStatus = currentCard.querySelector('.read .status');
  const readIndicator= currentCard.querySelector('.read .read-indicator');

  readStatus.textContent = activeBook['status'].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  readIndicatorHandler(readIndicator, readStatus.textContent);

  console.log(myListBook);
}

const deleteBookHandler = () => {
  const index = myListBook.findIndex(book => book == activeBook);

  const card = document.querySelectorAll('.all-book .card');
  
  currentCard = card[index + 3];

  myListBook.splice(index, 1);
  currentCard.remove();

  console.log(myListBook);
  deleteBook.classList.remove('show');
  bookDetails.classList.remove('show');
}

const isInput = bookDetails.querySelectorAll('.set-status input');

isInput.forEach((radio) => {
  radio.addEventListener('change', detailStatusTextHandler);
})

document.addEventListener('click', (e) => {
  if(e.target.closest('.search i')){
    searchBox.classList.toggle('show');
  }else if(e.target.closest('.menu .menu-button')){
    menuBtn.classList.toggle('open');
  }else if(e.target.closest('.search-box .close')){
    searchBoxHandler(e);
  }else if(e.target.closest('.add-book-btn')) {
    addBook.showModal();
  }else if(e.target.closest('.add-book .close')){
    addBook.close();
  }else if(e.target.closest('.card .details')){
    bookDetailHandler(e);
  }else if(e.target.closest('.confirm')) {
    editStatusHandler();
    bookDetails.classList.remove('show');
  }else if(e.target.closest('.book-details .delete-book')) {
    deleteBook.classList.add('show');
  }else if(e.target.closest('.book-details .delete-cancel')) {
    deleteBook.classList.remove('show');
  }else if(e.target.closest('.book-details .delete-confirm')){
    deleteBookHandler();
  }else if(e.target.closest('.add-book .submit-book')){
    addBookHandler();
  }else if(e.target.closest('label[for="status-not-finished"]') ){
    document.getElementById('finished-pages').focus();
  }
})

// addStatusNotFinished.addEventListener('click', function() {
//   document.getElementById('finished-pages').focus();
// });