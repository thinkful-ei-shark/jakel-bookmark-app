import cuid from 'cuid';
import api from './api';

const bookmarks = [];
let adding = false;
let error = null;
let filter = 0;
let state = 0;


const create = function (title, url, description, rating,id) {
  return {
    id,
    title,
    url,
    description,
    rating,
    expanded: false
  };
};
const addItem = function (bookmark) {
  bookmarks.push(create(bookmark.title,bookmark.url, bookmark.desc,bookmark.rating,bookmark.id));
};


const findAndToggleDelete = function (id) {
  const currentItem = findById(id);
  this.bookmarks = this.bookmarks.filter(currentItem => currentItem.id !== id);
};
const findAndToggleExpanded = function (id) {
  const currentItem = findById(id);
  currentItem.expanded = !currentItem.expanded;
};
const toggleCheckedFilter = function () {
  //Expands the bookmark item
  this.expanded = !this.expanded;
};
const setError = function (error) {
  this.error = error;
  console.log(error)
};
const findById = function (id) {
  //Gets called by findAndToggle to get the id of current object clicked
  return bookmarks.find(currentItem => currentItem.id === id);
};


export default {
  bookmarks,
  adding,
  error,
  filter,
  state,
  create,
  findAndToggleDelete,
  findAndToggleExpanded,
  toggleCheckedFilter,
  findById,
  addItem,
  setError,
}








  // const bookmarks = [
//     {
//         id: 'x56w',
//         title: 'Title 1',
//         rating: 3,
//         url: 'http://www.title1.com',
//         description: 'lorem ipsum dolor sit',
//         expanded: false
//     },
//     {
//         id: '6ffw',
//         title: 'Title 2',
//         rating: 5,
//         url: 'http://www.title2.com',
//         description: 'dolorum tempore deserunt',
//         expanded: false
//     },
//     {
//         id: 'zbfw',
//         title: 'Title 3',
//         rating: 2,
//         url: 'http://www.title2.com',
//         description: 'dolorum tempore deserunt',
//         expanded: false
//     },
//     {
//         id: 'y6fw',
//         title: 'Title 4',
//         rating: 1,
//         url: 'http://www.title2.com',
//         description: 'dolorum tempore deserunt',
//         expanded: false
//     },
// ]
// let adding= false;
// let error=null;
// let filter= 0;
