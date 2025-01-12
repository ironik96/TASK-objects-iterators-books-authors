const authors = require("./authors.json");
const books = require("./books.json");

/**************************************************************
 * getBookById(bookId, books):
 * - receives a bookId
 * - recieves an array of book objects
 * - returns the book object that matches that id
 * - returns undefined if no matching book is found
 ****************************************************************/
function getBookById(bookId, books) {
  return books.find((book) => book.id === bookId);
}
// console.log(getBookById(12, books));

/**************************************************************
 * getAuthorByName(authorName, authors):
 * - receives an authorName
 * - recieves an array of author objects
 * - returns the author that matches that name (CASE INSENSITIVE)
 * - returns undefined if no matching author is found
 ****************************************************************/
function getAuthorByName(authorName, authors) {
  return authors.find(
    (author) => author.name.toLowerCase() === authorName.toLowerCase()
  );
}
// console.log(getAuthorByName("J.K. Rowling", authors));

/**************************************************************
 * bookCountsByAuthor(authors):
 * - receives an array of authors
 * - returns an array of objects with the format:
 *    [{ author: <NAME>, bookCount: <NUMBER_OF_BOOKS> }]
 ****************************************************************/
function bookCountsByAuthor(authors) {
  const authorArray = [];
  authors.forEach((authorObject) => {
    authorArray.push({
      author: authorObject.name,
      bookCount: authorObject.books.length,
    });
  });
  return authorArray;
}
// console.log(bookCountsByAuthor(authors));

/**************************************************************
 * booksByColor(books):
 * - receives an array of books
 * - returns an object where the keys are colors
 *   and the values are arrays of book titles:
 *    { <COLOR>: [<BOOK_TITLES>] }
 ****************************************************************/
function booksByColor(books) {
  const colors = {};
  books.forEach((book) => {
    if (book.color in colors) colors[book.color].push(book.title);
    else colors[book.color] = [book.title];
  });
  return colors;
}
// console.log(booksByColor(books));

/**************************************************************
 * titlesByAuthorName(authorName, authors, books):
 * - receives an authorName
 * - recieves an array of author objects
 * - recieves an array of book objects
 * - returns an array of the titles of the books written by that author:
 *    ["The Hitchhikers Guide", "The Meaning of Liff"]
 ****************************************************************/
/**
 * @param  {string} authorName
 * @param  {Array} authors
 * @param  {Array} books
 */
function titlesByAuthorName(authorName, authors, books) {
  let getAuthors = authors.find(
    (author) => author.name.toLowerCase() === authorName.toLowerCase()
  );
  if (getAuthors === undefined) return [];
  let bookIDs = getAuthors.books;
  let authorBooks = books.filter((book) => bookIDs.includes(book.id));
  return authorBooks.map((book) => book.title);
}
// console.log(titlesByAuthorName("George R.R. Martin", authors, books));

/**************************************************************
 * mostProlificAuthor(authors):
 * - receives a list of authors
 * - returns the name of the author with the most books
 *
 * Note: assume there will never be a tie
 ****************************************************************/
function mostProlificAuthor(authors) {
  let mostBooks = 0;
  let authorName = "";
  authors.forEach((author) => {
    if (author.books.length > mostBooks) {
      mostBooks = author.books.length;
      authorName = author.name;
    }
  });
  return authorName;
}
// console.log(mostProlificAuthor(authors));

/**************************************************************
 * relatedBooks(bookId, authors, books):
 * - receives a bookId
 * - receives a list of authors
 * - receives a list of books
 * - returns a list of the titles of all the books by
 *   the same author as the book with bookId
 *   (including the original book)
 *
 * e.g. Let's send in bookId 37 ("The Shining Girls" by Lauren Beukes):
 *      relatedBooks(37);
 * We should get back all of Lauren Beukes's books:
 *      ["The Shining Girls", "Zoo City"]
 *
 * NOTE: YOU NEED TO TAKE INTO ACCOUNT BOOKS WITH MULTIPLE AUTHORS
 *
 * e.g. Let's send in bookId 46 ("Good Omens" by Terry Pratchett and Neil Gaiman):
 *      relatedBooks(46);
 * We should get back all of Neil Gaiman's books AND all of Terry Pratchett's books:
 *      ["Good Omens", "Good Omens", "Neverwhere", "Coraline", "The Color of Magic", "The Hogfather", "Wee Free Men", "The Long Earth", "The Long War", "The Long Mars"]
 *
 * BONUS: REMOVE DUPLICATE BOOKS
 ****************************************************************/
/**
 * @param  {string} bookId
 * @param  {Array} authors
 * @param  {Array} books
 */
function relatedBooks(bookId, authors, books) {
  // get related authors id in an array
  let relatedAuthors = getBookById(bookId, books).authors.map(
    (author) => author.id
  );
  // map author id to book array (resulting in array of array)
  let authorIDToBooksArray = authors
    .filter((author) => relatedAuthors.includes(author.id))
    .map((author) => author.books);
  // flatten nested array
  let relatedBooksIDs = [].concat.apply([], authorIDToBooksArray);
  // find book title WITH duplicates
  let relatedBooks = [];
  relatedBooksIDs.forEach((id) => {
    relatedBooks.push(books.find((book) => book.id === id).title);
  });
  return relatedBooks.sort();
}
// console.log(relatedBooks(50, authors, books));
/**************************************************************
 * friendliestAuthor(authors):
 * - receives a list of authors
 * - returns the name of the author that has
 *   co-authored the greatest number of books
 ****************************************************************/
/**
 * @param  {Array} authors
 */
function friendliestAuthor(authors) {
  // filter in books that are co authored
  let coAuthoredBooks = books.filter((book) => book.authors.length > 1);
  // map books to objects where the key value pair = name and count
  let coAuthors = {};
  coAuthoredBooks.forEach((book) => {
    book.authors.forEach((author) => {
      author.name in coAuthors
        ? coAuthors[author.name]++
        : (coAuthors[author.name] = 1);
    });
  });
  // find the heighest count
  let heighestCount = Math.max(...Object.values(coAuthors));
  // return the name (key) of the heighest count
  return Object.keys(coAuthors).find((key) => coAuthors[key] === heighestCount);
}
// console.log(friendliestAuthor(authors));

module.exports = {
  getBookById,
  getAuthorByName,
  bookCountsByAuthor,
  booksByColor,
  titlesByAuthorName,
  mostProlificAuthor,
  relatedBooks,
  friendliestAuthor,
};
