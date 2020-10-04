import $ from 'jquery';

import store from './store';
import api from './api';

const handleItemClicked = function () {
    $('.boxed').on('click', '.bookmark-item', event => {
        const item = event.currentTarget
        const id = getItemIdFromElement(event.currentTarget)
        store.findAndToggleExpanded(id)
        render()
    });
}
const getItemIdFromBtn = function (item) {
    return $(item)
        .closest('.delete-item')
        .data('item-id')
};
const getItemIdFromElement = function (item) {
    return $(item)
        .closest('.bookmark-item')
        .data('item-id')
};

const newItemSubmit = function () {
    $('#submit').on('click', function (event) {
        event.preventDefault()
        store.state += 1
        render()
    })
}

const createNewItem = function () {
    $('#createBtn').on('click', function (event) {
        event.preventDefault()
        const title = $('#bookmark-title').val()
        const rating = $(`input[name = "radio"]:checked`).val()
        const url = $('#bookmark-url').val()
        const description = $('#description').val()
        const expanded = false;
        if (title != '' && description != '' && rating > 0 && url.includes("https://")) {
            api.createItem(title, url, description, rating)
                .then(res => res.json())
                .then((newItem) => {
                    store.addItem(newItem)
                    store.state -= 1;
                    render()
                })
        } else {
            //Self generated error
            store.setError("Title, Url (with https://) , Rating & Description Required!")
            renderError()
        }
        // .catch((error) => {
        //     store.setError(error.message);
        //     renderError();
        // });
    })
}


const deleteItem = function () {
    $('.boxed').on('click', '.delete-item', event => {
        event.preventDefault();
        const item = event.currentTarget;
        const id = getItemIdFromBtn(event.currentTarget);
        api.deleteItem(id)
            .then(res => res.json())
            .then((newItem) => {
                store.findAndToggleDelete(id);
                render();
            })
    })
}
const cancelItemSubmit = function () {
    $('#cancelBtn').on('click', function (event) {
        event.preventDefault();
        store.state -= 1;
        render();
    })
}

const generateError = function (message) {
    return `
        <section class="error-content">
          <button id="cancel-error">X</button>
          <p>${message}</p>
        </section>
      `
}

const renderError = function () {
    if (store.error) {
        const el = generateError(store.error);
        $('.error-container').html(el);
    } else {
        $('.error-container').empty();
    }
}

const handleCloseError = function () {
    $('.error-container').on('click', '#cancel-error', () => {
        store.setError(null);
        renderError();
    })
}

const handleDropDown = function () {
    $('form').on('change', 'select', function () {
        let rating = $('select').val();
        if (rating) {
            store.filter = rating;
            render();
        }
    })
}

const generateBookmarkItemsString = function (bookmarkList) {
    //Maps bookMarks 1 by 1 and calls generate bookmarks until list is complete
    const items = bookmarkList.map((item) => generateBookmarks(item));
    return items.join('');
};

const generateBookmarks = function (item) {
    //This is the actual creation of the bookmark with its star ratings and info
    let rating = item.rating
    let descItem = ""
    let itemTitle = ''
    let starRating1 = `<i class = "fa fa-star ${rating > 0 ? 'fa fa-star checked' : 'fa fa-star'}"></i>`
    rating -= 1;
    let starRating2 = `<i class = "fa fa-star ${rating > 0 ? 'fa fa-star checked' : 'fa fa-star'}"></i>`
    rating -= 1;
    let starRating3 = `<i class = "fa fa-star ${rating > 0 ? 'fa fa-star checked' : 'fa fa-star'}"></i>`
    rating -= 1;
    let starRating4 = `<i class = "fa fa-star ${rating > 0 ? 'fa fa-star checked' : 'fa fa-star'}"></i>`
    rating -= 1;
    let starRating5 = `<i class = "fa fa-star ${rating > 0 ? 'fa fa-star checked' : 'fa fa-star'}"></i>`
    rating -= 1;

    if (item.expanded) {
        descItem = `<form action = "${item.url}">
        <button class = "visit">Visit Site</button></br>` + "  " + item.description +
            `</br><button class = "delete-item"  data-item-id = "${item.id}">Delete Bookmark</button>
            </form>`
    }

    itemTitle = `<span tabindex='0' class="bookmark-item" data-item-id="${item.id}">${item.title}
        ${starRating1}
        ${starRating2}
        ${starRating3}
        ${starRating4}
        ${starRating5}
    </span>
    <div class ="discriptor">
        ${descItem}
    </div>`;
    if (store.filter > 0 && item.rating < store.filter) {
        itemTitle = '';
    }
    return `
     ${itemTitle}
</div>  
</div>`
}


const startTemplate = function () {
    return `
<form id="js-bookmark-form">
    <button type="submit" id = "submit">New</button>
    <select name="rating" id="rating">
                    <option value="">Filter By</option>
                    <option value="1">(1 Star) &#9733;</option>
                    <option value="2">(2 Stars) &#9733; &#9733;</option>
                    <option value="3">(3 Stars) &#9733; &#9733; &#9733;</option>
                    <option value="4">(4 Stars) &#9733; &#9733; &#9733; &#9733;</option>
                    <option value="5">(5 Stars) &#9733; &#9733; &#9733; &#9733; &#9733;</option> 
                </select>
</form>
<div class="boxed"></div>`
}

const newItemTemplate = function () {
    return `<div class="container2">
    <h1>Add New BookMark</h1>
    <form id="js-bookmark-submit-form">
        <label for = "bookmark-url" ></label>
        <input id = "bookmark-url" type = "text" name = "bookmark-url" placeholder = "https://url here" required>
        <label for = "bookmark-title" ></label>
        <div></div>
        <input  id = "bookmark-title" type = "text" name = "bookmark-title" placeholder = "Title Here" required>
        <div></div>
        <h2>Rate This Item</h2>
        <label for = "1-star">1</label>
        <input type="radio" id = "1-star" name="rating" value="1">
        <label for = "2-star">2</label>
        <input type="radio" id = "2-star" name="rating" value="2">
        <label for = "3-star">3</label>
        <input type="radio" id = "3-star" name="rating" value="3">
        <label for = "4-star">4</label>
        <input type="radio" id = "4-star" name="rating" value="4">
        <label for = "5-star">5</label>
        <input type="radio" id = "5-star" name="rating" value="5">
        
        <div></div>
    
        <textarea required id = "description" name = "description" placeholder="URL Description Here..."></textarea>
    </br>
        <button type="cancel" id ="cancelBtn">Cancel</button>
        <button type="cancel" id ="createBtn">Create</button>
        </br>
        <div class = "error-container"</div>
    </form>
</div>`
}


const render = function () {
    renderError();
    let page = '';
    let list = [...store.bookmarks];
    let bookmarkListItemsString = generateBookmarkItemsString(list);
    if (store.state == 0) {
        page = startTemplate();
        $("main").html(page);
        $('.boxed').html(bookmarkListItemsString);
    } else if (store.state == 1) {
        page = newItemTemplate();
        $("main").html(page);
        $('.boxed').html(bookmarkListItemsString);
    }
    bindEventListeners();
}
const bindEventListeners = function () {
    handleItemClicked();
    handleDropDown();
    newItemSubmit();
    createNewItem();
    cancelItemSubmit();
    deleteItem();
    handleCloseError();
};

export default {
    render,
    bindEventListeners
}