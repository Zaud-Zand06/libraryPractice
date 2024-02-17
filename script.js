const myLibrary = [];
const bookShelf = document.getElementById("book-shelf");

function book(author, title, pages) {
  const readStatus = false;
  myLibrary.push({ author, title, pages });
  return { author, title, pages };
}

// Book.prototype.readStatus = function() {
    //     return read != 1 ? 'Not read' : 'Read';
// }

function libraryController() {
    const houseOfLeaves = book("Mark, Z., Danielewski",
   "House of Leaves",
   "709"
   );
  const popisho = book("Leone Ross",
   "Popisho",
   "304"
   );
   const tenderIsTheFlesh = book(
    "Agustina Bazterrica",
    "Tender is the Flesh",
    "205"
  );
  const bodyKeepsTheScore = book(
    "Bessel van der Kolk",
    "Body Keeps the Score",
    "807"
  );

  console.log(houseOfLeaves);
  console.table(myLibrary);
}

libraryController();

function screenController() {
    function initializeLibrary(library) {
        for (let index = 0; index < library.length; index++) {
            const book = document.createElement("div");
      book.classList.add("books");
      book.id = "book" + index; // 0 indexed array

      const info = getBookInfo(library, index);
      book.appendChild(info);

      const read = readReport();
      info.appendChild(read);

      const button = removeFromLibraryButton(library, index);
      book.appendChild(button);

      bookShelf.appendChild(book);
    }
  };

  initializeLibrary(myLibrary);

  function getBookInfo(library, index) {
    const info = document.createElement("div");
    info.classList.add("info");
    Object.values(library[index]).forEach((value) => {
      const data = document.createElement("div");
      data.appendChild(document.createTextNode(value));
      info.appendChild(data);
    });
    return info;
  };

  function removeFromLibraryButton(library, index) {
    const button = document.createElement("a");
    button.appendChild(document.createTextNode("Remove from library"));
    button.dataset.book = library.indexOf(library[index]);
    button.classList.add("button");
    button.addEventListener("click", (e) => {
      myLibrary.splice(button.dataset.book, 1);
      clearBookshelf();
      initializeLibrary(myLibrary);
    });
    return button;
  };

  function readReport() {
    const readReport = document.createElement("div");
    const checkbox = document.createElement("input");
    readReport.appendChild(checkbox);
    checkbox.type = "checkbox";
    readReport.appendChild(document.createTextNode("Read"));
    readReport.classList.add("read-status");
    return readReport;
  };

  function clearBookshelf() {
    let books = document.getElementsByClassName("books");
    while (books[0]) {
      books[0].parentNode.removeChild(books[0]);
    }
  };

}

screenController();



const newBookButton = document.getElementById("new-book-button");
const cancelButton = document.getElementById("cancel");
const dialog = document.getElementById("book-dialog");
dialog.returnValue = "newBook";
const form = dialog.querySelector("form");

newBookButton.addEventListener("click", () => {
  dialog.showModal();
});

cancelButton.addEventListener("click", () => {
  dialog.close("New book cancelled");
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let bookInfo = new FormData(event.target);
  const { author, title, length, read } = Object.fromEntries(bookInfo);
  const newBook = book(author, title, length);
  console.log(newBook);
  addBookToLibrary(newBook);
  dialog.close("New Book added!");
  clearBookshelf();
  initializeLibrary(myLibrary);
});
