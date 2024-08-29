const menuBtn = document.querySelector('.menu');
const searchBox = document.querySelector('.search-box');
const addBook = document.querySelector('.add-book');
const inputs = addBook.querySelectorAll('input');
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
const coverLabel = coverPreview.querySelector('label');
const noFeatures = document.querySelector('.no-features');
const myListBook = [];
const isInput = bookDetails.querySelectorAll('.set-status input');

// Dummy
myListBook[0] = {
  author: "J.R.R. Tolkien",
  currentPages: "293",
  pages: "293",
  status: "read",
  title: "The Hobbit",
  cover: '../assets/thehobbit.jpg'
}

// Book Constructor
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

  if(currentPages == this.pages) {
    this.status = 'read';
  }
}

Book.prototype.setCover = function(cover) {
  this.cover = cover;
}

let imgList = {}

// Input Image
const coverInputHandler = () => {
  const img = coverInput.files[0];

  if(img) {
    const reader = new FileReader();

    reader.onload = function(event) {
      imgList.imageSrc = event.target.result;

      coverPreview.style.background = `url(${imgList.imageSrc}) center center / cover no-repeat`;

      coverLabel.classList.add('hidden');

      coverInput.value = '';
    }
    reader.readAsDataURL(img);
  } else {
    alert('Please select an image.');
  }
}

// Input Validity Check
const handleValidity = (item) => {
  let isFinishedInput = false;

  if (item.name === 'finished-pages') {
    isFinishedInput = true;
    item.setCustomValidity('');
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

const notFinishedInputHandler = (finishedPagesInput, newBook, inputList) => {
  const finishedPages = parseFloat(inputList['finished-pages']);
  const totalPages = parseFloat(inputList['pages']);
  
  if(inputList['status'] === 'not-finished') {
    if(finishedPages > totalPages || finishedPagesInput.value == ''){
      finishedPagesInput.setCustomValidity(`Please enter a valid page number between 1 and ${totalPages}.`);
      finishedPagesInput.reportValidity();
      return false;
    }else if(finishedPages === 0){
      newBook.status = 'not-read';
    }
    newBook.setCurrentPages(finishedPages);
  }else if(inputList['status'] === 'read') {
    newBook.setCurrentPages(totalPages);
  }

  return true;
}

// Reset Input
const resetAddBook = () => {
  inputs.forEach((input) => {
    if(input.type === 'radio'){
      input.checked = false;
    }else{
      input.value = '';
    }
  })

  imgList = {};
  if(Object.keys(imgList).length === 0) {
    coverLabel.classList.remove('hidden');
  }

  coverPreview.style.background = '';
  addBook.close();
}

// Add Book Handler
const addBookHandler = () => {
  const inputList = {};
  
  let finishedPagesInput = null;

  let isFormValid = true;
  for (let item of inputs) {
    const {isValid, isFinishedInput} = handleValidity(item);
    
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
  }else{
    // Set Object
    const newBook = new Book(inputList['title'], inputList['author'], inputList['pages'], inputList['status']);

    if(!notFinishedInputHandler(finishedPagesInput, newBook, inputList)){
      return;
    }

    if(imgList.imageSrc){
      newBook.setCover(imgList.imageSrc);
    }

    // Push newBook into Array
    myListBook.push(newBook);

    resetAddBook();

    showBookHandler();
  }
}

// Section Handler
const isSectionEmpty = () => {
  const sections = document.querySelectorAll('section.finished, section.not-read, section.not-finished');

  for(let section of sections){
    if(!section.querySelector('.section-content > div')){
      section.classList.add('empty');
    }else{
      section.classList.remove('empty');
    }
  }
}

const sectionHandler = (card, book) => {
  if(allBook.querySelector('.card.empty')){
    allBook.querySelector('.card.empty').remove();
  }

  if(book['status'] === 'read'){
    finishedBooks.appendChild(card);
  }

  else if(book['status'] === 'not-read'){
    notReadBooks.appendChild(card);
  }

  else if(book['status'] === 'not-finished'){
    notFinishedBooks.appendChild(card);
  }
}

// Clone Card
const cloneCardHandler = () => {
  const cloneCard = template.cloneNode(true);

  const cardCover = cloneCard.querySelector('.book-cover img');
  const cardTitle = cloneCard.querySelector('.book-title');
  const readStatus = cloneCard.querySelector('.read .status');
  const readIndicator= cloneCard.querySelector('.read .read-indicator');

  return {cloneCard, cardTitle, readStatus, readIndicator, cardCover};
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
  isSectionEmpty();
}

// Show Book
const showBookHandler = () => {
  if(myListBook.length === 0){
    const emptyCard = templateEmpty.cloneNode(true);
    allBook.appendChild(emptyCard);
  }
  else{
    newBookHandler();
  }
}

// Get Index
let activeBook;
const getCardIndex = (e) => {
  const card = e.target.closest('.card');
  if(!card){
    return {card: null, bookIndex: -1};
  }

  const bookIndex = card.dataset.index;

  return bookIndex;
}

// Edit Details Status
const detailStatusHandler = () => {
  const detailStatus = bookDetails.querySelectorAll('.set-status input');

  const detailStatusText = bookDetails.querySelector('.set-read-status h2');

  let isInput;

  detailStatus.forEach((input) => {
    if(input.value == activeBook['status']){
      input.checked = true;
      isInput = input;
    }
  })

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

  const currentPagesInput = bookDetails.querySelector('#details-current-pages');
  
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

// Book Detail Content
const setBookDetailContent = () => {
  bookDetails.querySelector('.cover > img').src = activeBook['cover'];
  bookDetails.querySelector('.title > *').textContent = activeBook['title'];
  bookDetails.querySelector('.author > *').textContent = activeBook['author'];
  bookDetails.querySelector('.read-status #details-current-pages').value = activeBook['currentPages'];
  bookDetails.querySelector('.read-status .details-total-pages').textContent = activeBook['pages'];
}

// Show Book Detail
const bookDetailHandler = (e) => {
  const bookIndex = getCardIndex(e)

  bookDetails.classList.add('show');

  activeBook = myListBook[bookIndex];
  
  setBookDetailContent();

  detailStatusHandler();
  detailStatusTextHandler();
}

// CurrentPagesValidation
const currentPagesValidation = (totalPages, input) => {
  input.setCustomValidity('');
  if(!input.reportValidity()){
    return false
  }

  if(parseFloat(input.value) > parseFloat(totalPages)){
    input.setCustomValidity(`Please enter a valid page number between 1 and ${totalPages}.`);
    input.reportValidity();
    return false;
  }else if(parseFloat(input.value) === 0){
    activeBook['status'] = 'not-read';
    activeBook['currentPages'] = 0;
  }else if(parseFloat(input.value) === parseFloat(totalPages)){
    activeBook['status'] = 'read';
    activeBook['currentPages'] = activeBook['pages'];
  }else {
    activeBook['currentPages'] = input.value;
  }

  return true;
}

// Edit Status
const editStatusHandler = () => {
  const statusActive = bookDetails.querySelectorAll('.set-status input');
  const currentPagesInput = bookDetails.querySelector('#details-current-pages');

  let valid = true;

  for(let radio of statusActive){
    if(radio.checked){
      activeBook['status'] = radio.value;
      
      if(radio.value == 'not-read') {
        activeBook['currentPages'] = 0;
      }else if(radio.value == 'read') {
        activeBook['currentPages'] = activeBook['pages'];
      }else if(radio.value == 'not-finished') {
        valid = currentPagesValidation(activeBook['pages'], currentPagesInput);
      }
    }
  }
  
  if(valid){
    updateBookCard(activeBook);
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

  // Close Modal
  deleteBook.classList.remove('show');
  bookDetails.classList.remove('show');

  // Refresh Card also Reset Data-* based on Index
  showBookHandler();

  // Reset Section
  isSectionEmpty();
}

const searchBoxHandler = (e) => {
  if(e.target.closest('i:first-child')){
    searchBox.classList.remove('show');
  }else if(e.target.closest('i:last-child')){
    searchBox.querySelector('input').value = '';
  }
}

// Event Listener
isInput.forEach((radio) => {
  radio.addEventListener('change', detailStatusTextHandler);
})

coverInput.addEventListener('change', coverInputHandler);

document.addEventListener('click', (e) => {
  const target = e.target;
  if(target.closest('.search i')){
    searchBox.classList.toggle('show');
  }else if(target.closest('.menu .menu-button')){
    menuBtn.classList.toggle('open');
  }else if(target.closest('.search-box .close')){
    searchBoxHandler(e);
  }else if(target.closest('.add-book-btn') || target.closest('.card.empty')) {  
    addBook.showModal();
  }else if(target.closest('.add-book .close')){
    addBook.close();
  }else if(target.closest('.all-book .card .details')){
    bookDetailHandler(e);
  }else if(target.closest('.finished .card .details')){
    bookDetailHandler(e);
  }else if(target.closest('.not-read .card .details')){
    bookDetailHandler(e);
  }else if(target.closest('.not-finished .card .details')){
    bookDetailHandler(e);
  }else if(target.closest('.confirm')) {
    editStatusHandler();
  }else if(target.closest('.book-details .delete-book')) {
    deleteBook.classList.add('show');
  }else if(target.closest('.book-details .delete-cancel')) {
    deleteBook.classList.remove('show');
  }else if(target.closest('.book-details .delete-confirm')){
    deleteBookHandler();
  }else if(target.closest('.add-book .submit-book')){
    addBookHandler();
  }else if(target.closest('label[for="status-not-finished"]') ){
    document.getElementById('finished-pages').focus();
  }else if(target.closest('.edit-book') || target.closest('.sort') || target.closest('.filter') || target.closest('.no-features .close') || target.closest('.about-button')){
    noFeatures.classList.toggle('show');
  }
})

// Initialize Dummy Book
showBookHandler();