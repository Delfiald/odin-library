const menuBtn = document.querySelector('.menu');
const searchBox = document.querySelector('.search-box');
const addBook = document.querySelector('.add-book');
const bookDetails = document.querySelector('.book-details');
const addStatusNotFinished = document.querySelector('label[for="status-not-finished"]');
const deleteBook = document.querySelector('.delete-book-confirm');
const card = document.querySelector('.card');

const allBook = document.querySelector('.all-book .section-content');

const finishedBooks = document.querySelector('.finished .section-content');
const notReadBooks = document.querySelector('.not-read .section-content');
const notFinishedBooks = document.querySelector('.not-finished .section-content');

const sectionFinished = document.querySelector('section.finished');
const sectionNotRead = document.querySelector('section.not-read');
const sectionNotFinished = document.querySelector('section.not-finished');

const template = document.getElementById('card-template').content;
const templateEmpty = document.getElementById('card-empty').content;

const coverPreview = addBook.querySelector('.input.img');
const coverInput = coverPreview.querySelector('#cover');
const coverLabel = document.querySelector('.add-book .input.img label');

let imgList = {}

// Input Image
const coverInputHandler = () => {
  const img = coverInput.files[0];

  if(img) {
    const reader = new FileReader();

    reader.onload = function(event) {
      imgList.imageSrc = event.target.result;

      console.log('read');

      coverPreview.style.background = `url(${imgList.imageSrc}) center center / cover no-repeat`;

      coverLabel.classList.add('hidden');

      coverInput.value = '';
    }
    reader.readAsDataURL(img);
  } else {
    alert('Please select an image.');
  }
}

// Book Constructor
const myListBook = [];

// Dummy
myListBook[0] = {
  author: "J.R.R. Tolkien",
  currentPages: "259",
  pages: "259",
  status: "read",
  title: "The Hobbit",
  cover: '../assets/thehobbit.jpg'
}

function Book (title, author, pages, status) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.status = status;
  this.currentPages = 0;
  this.cover = '../assets/no-preview.jpg';
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

  if(imgList.imageSrc){
    newBook.setCover(imgList.imageSrc);
  }

  coverPreview.style.background = '';
  imgList = {};
  if(Object.keys(imgList).length === 0) {
    coverLabel.classList.remove('hidden');
  }

  myListBook.push(newBook);
  resetInput(inputs);
  addBook.close();

  showBookHandler();
}

// Section Handler
const isSectionEmpty = () => {
  if (finishedBooks.childElementCount === 0) {
    sectionFinished.classList.add('empty');
  } else {
    sectionFinished.classList.remove('empty');
  }

  if (notReadBooks.childElementCount === 0) {
    console.log("kosong");
    sectionNotRead.classList.add('empty');
  } else {
    sectionNotRead.classList.remove('empty');
  }

  if (notFinishedBooks.childElementCount === 0) {
    sectionNotFinished.classList.add('empty');
  } else {
    sectionNotFinished.classList.remove('empty');
  }
}

const sectionHandler = (card, book, index) => {
  if(allBook.querySelector('.card.empty')){
    allBook.querySelector('.card.empty').remove();
  }

  if(book['status'] === 'read'){
    console.log('here read')
    sectionFinished.classList.remove('empty')
    finishedBooks.appendChild(card);
  }

  else if(book['status'] === 'not-read'){
    console.log('here not-read')
    sectionNotRead.classList.remove('empty')
    notReadBooks.appendChild(card);
  }

  else if(book['status'] === 'not-finished'){
    sectionNotFinished.classList.remove('empty')
    notFinishedBooks.appendChild(card);
  }
}

// Clone Card
const cloneCardHandler = () => {
  const cloneCard = document.importNode(template, true);

  const cardCover = cloneCard.querySelector('.book-cover img');
  const cardTitle = cloneCard.querySelector('.book-title');
  const readStatus = cloneCard.querySelector('.read .status');
  const readIndicator= cloneCard.querySelector('.read .read-indicator');

  return {cloneCard, cardTitle, readStatus, readIndicator, cardCover};
}

// Add New Book
const newBookHandler = () => {
  allBook.innerHTML = '';
  finishedBooks.innerHTML = '';
  notReadBooks.innerHTML = '';
  notFinishedBooks.innerHTML = '';

  myListBook.forEach((book, index) => {
    const {cloneCard, cardTitle, readStatus, readIndicator, cardCover} = cloneCardHandler();

    cardCover.src = book['cover'];
    cardTitle.textContent = book['title'];
    readStatus.textContent = book['status'].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    readIndicatorHandler(readIndicator, readStatus.textContent);

    const card = cloneCard.querySelector('.card');

    card.dataset.index = index;
    
    const cloneCardForSection = cloneCard.cloneNode(true);

    allBook.appendChild(cloneCard);
    sectionHandler(cloneCardForSection, book, index);
  })
}

// Show Book
const showBookHandler = () => {
  isSectionEmpty();
  if(myListBook.length === 0){
    const emptyCard = templateEmpty.cloneNode(true);
    allBook.appendChild(emptyCard);
  }
  else{
    newBookHandler();
  }
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
const getCardIndex = (e) => {
  const card = e.target.closest('.card');
  if(!card){
    return {card: null, bookIndex: -1};
  }

  const bookIndex = card.dataset.index;

  return bookIndex;
}

let activeBook;

const bookDetailHandler = (e) => {
  const bookIndex = getCardIndex(e)

  bookDetails.classList.add('show');

  activeBook = myListBook[bookIndex];
  
  bookDetails.querySelector('.cover > img').src = activeBook['cover'];
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

  let valid = true;

  for(let radio of statusActive){
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
        }else{
          valid = false;
          return;
        }
      }
    }
  }
  
  if(valid){
    updateBookCard(activeBook);
  }
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

  const sections = document.querySelectorAll('.all-book, .finished, .not-read, .not-finished');

  sections.forEach(section => {
    const currentCard = section.querySelector(`.card[data-index="${index}"]`);

    if(currentCard){
      const readStatus = currentCard.querySelector('.read .status');
      const readIndicator= currentCard.querySelector('.read .read-indicator');
    
      readStatus.textContent = activeBook['status'].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
      readIndicatorHandler(readIndicator, readStatus.textContent);

      let targetSection;
      if (activeBook.status === "read") {
        targetSection = finishedBooks;
      } else if (activeBook.status === "not-read") {
        targetSection = notReadBooks;
      } else if (activeBook.status === "not-finished") {
        targetSection = notFinishedBooks;
      }

      const allBookSection = document.querySelector('.all-book');
      if (!allBookSection.contains(currentCard)) {
        allBookSection.appendChild(currentCard);
      }

      if (section !== targetSection && section !== allBookSection) {
        targetSection.appendChild(currentCard);
      }
    }
  })
  isSectionEmpty();

  bookDetails.classList.remove('show');
  console.log(myListBook);
}

const deleteBookHandler = () => {
  const index = myListBook.findIndex(book => book == activeBook);

  const cards = document.querySelectorAll('section .card');
  
  cards.forEach((card) => {
    if(card.dataset.index == index){
      card.remove();
    }
  })

  myListBook.splice(index, 1);

  console.log(myListBook);
  deleteBook.classList.remove('show');
  bookDetails.classList.remove('show');
  showBookHandler();

  isSectionEmpty();
}

const isInput = bookDetails.querySelectorAll('.set-status input');

const searchBoxHandler = (e) => {
  if(e.target.closest('i:first-child')){
    searchBox.classList.remove('show');
  }else if(e.target.closest('i:last-child')){
    searchBox.querySelector('input').value = '';
  }
}

isInput.forEach((radio) => {
  radio.addEventListener('change', detailStatusTextHandler);
})

coverInput.addEventListener('change', coverInputHandler);

document.addEventListener('click', (e) => {
  if(e.target.closest('.search i')){
    searchBox.classList.toggle('show');
  }else if(e.target.closest('.menu .menu-button')){
    menuBtn.classList.toggle('open');
  }else if(e.target.closest('.search-box .close')){
    searchBoxHandler(e);
  }else if(e.target.closest('.add-book-btn') || e.target.closest('.card.empty')) {  
    addBook.showModal();
  }else if(e.target.closest('.add-book .close')){
    addBook.close();
  }else if(e.target.closest('.all-book .card .details')){
    bookDetailHandler(e);
  }else if(e.target.closest('.finished .card .details')){
    bookDetailHandler(e);
  }else if(e.target.closest('.not-read .card .details')){
    bookDetailHandler(e);
  }else if(e.target.closest('.not-finished .card .details')){
    bookDetailHandler(e);
  }else if(e.target.closest('.confirm')) {
    editStatusHandler();
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

showBookHandler();