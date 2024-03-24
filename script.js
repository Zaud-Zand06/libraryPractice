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
      bookCard.classList.add("books");
      bookCard.innerText = `${book.title} by ${book.author}. ${book.pages} pages.`;
      const button = document.createElement("a");
      button.classList.add("button");
      button.innerHTML = "Remove from library";
      button.addEventListener("click", () => {
        myLibrary.removeBook(book.title);
        bookCard.remove();
        myLibrary.saveBooks();
        initializeBookShelf();
      });
      bookCard.append(button);
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

  return { initializeBookShelf };
})();
