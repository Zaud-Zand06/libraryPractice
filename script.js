const myLibrary = [];
const bookShelf = document.getElementById('book-shelf');

function Book(author, title, pages) {
    this.author = author;
    this.title = title;
    this.pages = pages;
}

Book.prototype.readStatus = function() {
    return read != 1 ? 'Not read' : 'Read';
}

const houseOfLeaves = new Book('Mark, Z., Danielewski', 'House of Leaves', '709', 'Read');
const popisho = new Book('Leone Ross', 'Popisho', '304', 'Read');
const tenderIsTheFlesh = new Book('Agustina Bazterrica', 'Tender is the Flesh', '205', 'Read');
const bodyKeepsTheScore = new Book('Bessel van der Kolk', 'Body Keeps the Score', '807', 'Not read');

function addBookToLibrary(bookName) {
    myLibrary.push(bookName);
};

addBookToLibrary(houseOfLeaves);
addBookToLibrary(popisho);
addBookToLibrary(tenderIsTheFlesh);
addBookToLibrary(bodyKeepsTheScore);

console.table(myLibrary);

function initializeLibrary(library) {
    for (let index = 0; index < library.length; index++) {

        const book = document.createElement('div');
        book.classList.add('books');
        book.id = 'book' + index; // 0 indexed array

        const info = getBookInfo(library, index);
        book.appendChild(info);

        const read = readReport();
        info.appendChild(read);

        const button = removeFromLibraryButton(library, index)
        book.appendChild(button);

        bookShelf.appendChild(book);
    }
}

function readReport() {
    const readReport = document.createElement('div');
    const checkbox = document.createElement('input');
    readReport.appendChild(checkbox);
    checkbox.type = 'checkbox';
    readReport.appendChild(document.createTextNode('Read'));
    readReport.classList.add('read-status');
    return readReport;
}

function getBookInfo(library, index) {
    const info = document.createElement('div');
    info.classList.add('info');
    Object.values(library[index]).forEach(value => {
        const data = document.createElement('div');
        data.appendChild(document.createTextNode(value));
        info.appendChild(data);
    })
    return info;
}

function removeFromLibraryButton(library, index) {
    const button = document.createElement('a');
    button.appendChild(document.createTextNode('Remove from library'));
    button.dataset.book = library.indexOf(library[index]);
    button.classList.add('button');
    button.addEventListener('click', e => {
        myLibrary.splice(button.dataset.book, 1);
        clearBookshelf();
        initializeLibrary(myLibrary);
    })
    return button;
}


initializeLibrary(myLibrary);

function clearBookshelf() {
    let books = document.getElementsByClassName('books');
    while (books[0]) {
        books[0].parentNode.removeChild(books[0]);
    };
};

const newBookButton = document.getElementById('new-book-button');
const cancelButton = document.getElementById("cancel");
const dialog = document.getElementById("book-dialog");
dialog.returnValue = "newBook";
const form = dialog.querySelector('form');

newBookButton.addEventListener("click", () => {
    dialog.showModal();
});

cancelButton.addEventListener("click", () => {
    dialog.close("New book cancelled");
});

form.addEventListener('submit', function(event) {
    event.preventDefault();
    let bookInfo = new FormData(event.target);
    const { author, title, length, read } = Object.fromEntries(bookInfo);
    const newBook = new Book(author, title, length, read);
    console.log(newBook);
    addBookToLibrary(newBook);
    dialog.close("New Book added!")
    clearBookshelf();
    initializeLibrary(myLibrary);
});

