import $ from 'jquery';

import store from './store';
import api from './api';

const handleItemClicked = function () {
    $('.boxed').on('click', '.bookmark-item', event => {
        const item = event.currentTarget;
        const id = getItemIdFromElement(event.currentTarget);
        console.log(item)
        console.log(id);
        store.findAndToggleExpanded(id);
        render();
    });
}
const getItemIdFromBtn = function (item) {
    return $(item)
        .closest('.delete-item')
        .data('item-id');
};
const getItemIdFromElement = function (item) {
    return $(item)
        .closest('.bookmark-item')
        .data('item-id');
};

const newItemSubmit = function () {
    $('#submit').on('click', function (event) {
        event.preventDefault();
        store.state += 1;
        render();
    })
}

const createNewItem = function () {
    $('#createBtn').on('click', function (event) {
        event.preventDefault();
        const title = $('#bookmark-title').val();
        const rating = $(`input[name = "radio"]:checked`).val();
        const url = $('#bookmark-url').val();
        const description = $('#description').val();
        const expanded = false;
        if(title != null && description != null && rating > 0 && url.includes("https://")){
        api.createItem(title, url, description, rating)
            .then(res => res.json())
            .then((newItem) => {
                store.addItem(newItem);
                store.state -= 1;
                render();
            })
        }else{
            //Self generated error
            store.setError("Title, Url (with https://) , Rating & Description Required!");
            renderError();
        }
            // .catch((error) => {
            //     store.setError(error.message);
            //     renderError();
            // });
    });
};


const deleteItem = function () {
    $('.boxed').on('click', '.delete-item', event => {
        event.preventDefault();
        const item = event.currentTarget;
        const id = getItemIdFromBtn(event.currentTarget);
        console.log(id);
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
      `;
};

const renderError = function () {
    if (store.error) {
        const el = generateError(store.error);
        $('.error-container').html(el);
    } else {
        $('.error-container').empty();
    }
};

const handleCloseError = function () {
    $('.error-container').on('click', '#cancel-error', () => {
        store.setError(null);
        renderError();
    });
};

//$('#stars').addEventListener("change", store.filter = option.value);

// $('#stars').live('change', function(e) {
//     console.log(e.target.options[e.target.selectedIndex].text);
// });

const handleDropDown = function () {
    $('#stars').on('click', function (v) {
        console.log(v.target.options[v.target.selectedIndex].text);
        v.preventDefault();
        v.stopPropagation();
        store.filter = v.currentTarget.value;
        render();
    })
}

const generateBookmarkItemsString = function (bookmarkList) {
    //Maps bookMarks 1 by 1 and calls generate bookmarks until list is complete
    const items = bookmarkList.map((item) => generateBookmarks(item));
    return items.join('');
};

const generateBookmarks = function (item) {
    console.log(item)
    //This is the actual creation of the bookmark with its star ratings and info
    let rating = item.rating;
    let descItem = "";
    let itemTitle = '';
    let starRating1 = `<i class = "fa fa-star ${rating > 0 ? 'fa fa-star checked' : 'fa fa-star'}"></i>`;
    rating -= 1;
    let starRating2 = `<i class = "fa fa-star ${rating > 0 ? 'fa fa-star checked' : 'fa fa-star'}"></i>`;
    rating -= 1;
    let starRating3 = `<i class = "fa fa-star ${rating > 0 ? 'fa fa-star checked' : 'fa fa-star'}"></i>`;
    rating -= 1;
    let starRating4 = `<i class = "fa fa-star ${rating > 0 ? 'fa fa-star checked' : 'fa fa-star'}"></i>`;
    rating -= 1;
    let starRating5 = `<i class = "fa fa-star ${rating > 0 ? 'fa fa-star checked' : 'fa fa-star'}"></i>`;
    rating -= 1;

    if (item.expanded) {
        descItem = `<form action = "${item.url}">
        <button class = "visit">Visit Site</button></br>` + "  " + item.description +
            `</br><button class = "delete-item"  data-item-id = "${item.id}">Delete Bookmark</button>
            </form>`;
    }

    itemTitle = `<span class="bookmark-item" data-item-id="${item.id}">${item.title}
        ${starRating1}
        ${starRating2}
        ${starRating3}
        ${starRating4}
        ${starRating5}
    </span>
    <div class ="discriptor">
        ${descItem}
    </div>`;
    if (store.filter > 0 && item.rating != store.filter) {
        itemTitle = '';
    }
    return `
     ${itemTitle}
</div>  
</div>`;
}


const startTemplate = function () {
    return `<div class="container">
<h1>My BookMarks</h1>
<form id="js-bookmark-form">
    <button type="submit" id = "submit">New</button>
    <select id = "stars">
        <option value="" disabled selected hidden>Filter</option>
        <option value="1">1 Star</option>
        <option value="2">2 Stars</option>
        <option value="3">3 Stars</option>
        <option value="4">4 Stars</option>
        <option value="5">5 Stars</option>
    </select>
</form>
<div class="boxed"></div>`
}

const newItemTemplate = function () {
    return `<div class="container2">
    <h1>Add New BookMark</h1>
    <form id="js-bookmark-submit-form">
        <label for = "bookmark-url" ></label>
        <input required id = "bookmark-url" type = "text" name = "bookmark-url" placeholder = "https://url here">
        <label for = "bookmark-title" ></label>
        <div></div>
        <input required id = "bookmark-title" type = "text" name = "bookmark-title" placeholder = "Title Here">
        <div></div>
        <h2>Rate This Item</h2>
        <input type="radio" id = "ratings" name="radio" value="1">
        <label for = "1 star">1</label>
        <input type="radio" id = "ratings" name="radio" value="2">
        <label for = "2 star">2</label>
        <input type="radio" id = "ratings" name="radio" value="3">
        <label for = "3 star">3</label>
        <input type="radio" id = "ratings" name="radio" value="4">
        <label for = "4 star">4</label>
        <input type="radio" id = "ratings" name="radio" value="5">
        <label for = "5 star">5</label>
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