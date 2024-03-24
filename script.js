class Book {
  read = false;
  constructor(author, title, pages) {
    this.author = author;
    this.title = title;
    this.pages = pages;
  }
  changeReadStatus() {
    this.read = this.read === false ? true : false;
  }
  get ReadStatus() {
    return this.read;
  }
}

class Library {
  books = [];

  constructor(books = []) {
    this.books = [...books];
  }

  addBook(author, title, pages) {
    const existingBook = this.books.find(
      (book) =>
        book.author === author && book.title === title && book.pages === pages
    );
    if (existingBook) {
      console.log("This book already exists in the library.");
    } else {
      const book = new Book(author, title, pages);
      this.books.push(book);
    }
  }

  saveBooks() {
    const booksToSave = JSON.stringify(this.books);
    localStorage.setItem("libraryBooks", booksToSave);
  }

  getBooks() {
    this.books = [];
    const booksFromStorage = localStorage.getItem("libraryBooks");
    [...JSON.parse(booksFromStorage)].forEach((book) => {
      const bookClass = new Book(book.author, book.title, book.pages);
      if (book.read == true) {
        bookClass.changeReadStatus();
      }
      this.books.push(bookClass);
    });
  }

  removeBook(bookTitle) {
    this.books = this.books.filter((book) => book.title !== bookTitle);
  }
}

const screenController = (function () {
  const bookShelf = document.getElementById("book-shelf");
  const myLibrary = new Library();
  const addBookButton = document.getElementById("new-book-button");

  function initializeBookShelf() {
    while (bookShelf.firstChild) {
      bookShelf.removeChild(bookShelf.firstChild);
    }
    myLibrary.getBooks();
    console.log(myLibrary.books);
    myLibrary.books.forEach((book) => {
      const bookCard = document.createElement("div");
      bookCard.innerText = `${book.title} by ${book.author}. ${book.pages} pages.`;
      console.log(book.read);
      book.read === true
        ? bookCard.classList.add("books", "books-read")
        : bookCard.classList.add("books");

      const removeButton = document.createElement("a");
      removeButton.classList.add("button");
      removeButton.innerHTML = "Remove from library";
      removeButton.addEventListener("click", () => {
        myLibrary.removeBook(book.title);
        bookCard.remove();
        myLibrary.saveBooks();
        initializeBookShelf();
      });

      const readButton = document.createElement("a");
      readButton.classList.add("button");
      book.read == true
        ? (readButton.innerHTML = `I haven't read this!`)
        : (readButton.innerHTML = `I've read this!`);
      readButton.addEventListener("click", () => {
        book.changeReadStatus();
        book.read
          ? (readButton.innerHTML = `I've read this!`)
          : (readButton.innerHTML = `I haven't read this!`);
        console.log(book.read);
        myLibrary.saveBooks();
        initializeBookShelf();
      });
      bookCard.append(readButton);
      bookCard.append(removeButton);
      bookShelf.append(bookCard);
    });
  }

  initializeBookShelf(); // initialize bookshelf on page load

  addBookButton.addEventListener("click", () => {
    const dialog = document.getElementById("book-dialog");
    const cancelButton = document.getElementById("cancel");
    dialog.returnValue = "newBook";
    const form = dialog.querySelector("form");
    dialog.showModal();

    cancelButton.addEventListener("click", () => {
      dialog.close("New book cancelled");
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      let bookInfo = new FormData(event.target);
      const { author, title, length } = Object.fromEntries(bookInfo);
      myLibrary.addBook(author, title, length);
      myLibrary.saveBooks();
      dialog.close("New Book added!");
      initializeBookShelf();
    });
  });
})();
