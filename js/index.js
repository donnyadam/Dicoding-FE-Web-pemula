const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

//local storage checking
function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
};

//render event
document.addEventListener(RENDER_EVENT, function () {
  const unreadBookList = document.getElementById('unread');
  unreadBookList.innerHTML = '';

  const readBookList = document.getElementById('read');
  readBookList.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete)
      unreadBookList.append(bookElement);
    else
      readBookList.append(bookElement);
  }
});

function makeBook(bookObject) {
  const textTitle = document.createElement('h2');
  textTitle.innerText = bookObject.title;

  const textauthor = document.createElement('p');
  textauthor.innerText = bookObject.author;

  const textYear = document.createElement('p');
  textYear.innerText = bookObject.year;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner', 'col-9', 'ms-2');
  textContainer.append(textTitle, textauthor, textYear);

  const divRow = document.createElement('div');
  divRow.classList.add('row');

  if (bookObject.isComplete) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('button', 'undo-button', 'col');

    const iconUndo = document.createElement('i');
    iconUndo.classList.add('bi', 'bi-arrow-counterclockwise', 'icon-100');
    undoButton.append(iconUndo);

    undoButton.addEventListener('click', function () {
      undo(bookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('button', 'trash-button', 'col', 'me-2');

    const iconTrash = document.createElement('i');
    iconTrash.classList.add('bi', 'bi-trash', 'icon-100');
    trashButton.append(iconTrash);

    trashButton.addEventListener('click', function () {
      remove(bookObject.id);
    });

    divRow.append(textContainer, undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('button', 'check-button', 'col', 'rounded-circle');

    const icon = document.createElement('i');
    icon.classList.add('bi', 'bi-check-circle-fill', 'icon-100');
    checkButton.append(icon);

    checkButton.addEventListener('click', function () {
      done(bookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('button', 'trash-button', 'col', 'me-2');

    const iconTrash = document.createElement('i');
    iconTrash.classList.add('bi', 'bi-trash', 'icon-100');
    trashButton.append(iconTrash);

    trashButton.addEventListener('click', function () {
      remove(bookObject.id);
    });

    divRow.append(textContainer, checkButton, trashButton);
  }

  const container = document.createElement('div');
  container.classList.add('item', 'shadow', 'bg-light', 'rounded-4', 'mt-3');
  container.append(divRow);
  container.setAttribute('id', `book-${bookObject.id}`);

  return container;
}

function undo(bookId){
  const bookTarget = findById(bookId);

  if(bookTarget === null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findById(bookId){
  for(const bookItem of books){
    if(bookItem.id === bookId){
      return bookItem;
    }
  }

  return null;
}

function remove(bookId){
  const bookTarget = findIndexById(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findIndexById(bookId){
  for (const index in books){
    if(books[index].id === bookId){
      return index;
    }
  }
  return -1;
}

function done(bookId){
  const bookTarget = findById(bookId);

  if(bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

//add book
document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('form');
  const submit = document.getElementById('submit');

  //belum menemukan cara menambahkan data-bs-dismiss
  //submit.dataset.dsDismiss = 'modal';

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist) {
    loadDataFromStorage();
  }
});

function addBook() {
  const title = document.getElementById('judul').value;
  const author = document.getElementById('penulis').value;
  const year = document.getElementById('tahun').value;

  const generateID = +new Date();
  const bookObject = {
    id: generateID,
    title: title,
    author: author,
    year: parseInt(year),
    isComplete: false
  };
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

function loadDataFromStorage(){
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if(data !== null){
      for(const book of data){
          books.push(book);
      }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  };
};


//save
document.addEventListener(SAVED_EVENT, function(){
  console.log(localStorage.getItem(STORAGE_KEY));
});

//modal
const exampleModal = document.getElementById('myModal');
const input = document.getElementById('judul');

exampleModal.addEventListener('shown.bs.modal', () => {
  input.focus();
})
