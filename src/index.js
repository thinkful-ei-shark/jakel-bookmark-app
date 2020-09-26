import $ from 'jquery';
// import 'normalize.css';
import './index.css';
import bookmarks from './bookmark-list';
import api from './api';
import store from './store';


function main() {
    api.getItems()
    .then(res => res.json())
    .then((items) => {
      items.forEach((item) => store.addItem(item));
      bookmarks.render();
   });
    bookmarks.bindEventListeners();
    bookmarks.render();
}

$(main);