'use strict';

/* global store */
//<button  id="add" >Add Bookmark</button>

// eslint-disable-next-line no-unused-vars

$("#addItemButton").click(function () {
  displayItemForm();
})
$("#submitItemButton").click(function () {
  hideItemForm();

})
$("#cancelButton").click(function () {
  hideItemForm();
})

function displayItemForm() {
  $("#js-bookmark-form").removeClass("hidden");
  $("#addItemButton").addClass("hidden");
}

function hideItemForm() {
  $("#addItemButton").removeClass("hidden");
  $("#js-bookmark-form").addClass("hidden");
}


const itemList = (function () {
  function generateItemElement(item) {
    console.log('***** generateItemElement ****');
    var rating = item.rating;
    var ratingString = "";
    for (var i = 1; i <= item.rating; i++)
      ratingString += " <span>&#x2605</span>";

    for (var i = item.rating; i < 5; i++)
      ratingString += " <span>&#x2606</span>";


    return `
    <li class="bookmark-item" data-item-id="${item.id}">
    <header class="bookmark-header">
      <span class="header-text">${item.title}</span>
    <button class= "remove-bookmark-button">X</button>
    </header>
    <article class="hidden">
    <span>Visit site: </span> <a href="{item.url}" >${item.url}</a> 
      <p class="description">
        ${item.desc}
      </p>
    </article>
    <div class="rating">
      ${ratingString}
    </div>
      
    
  </li>`;
  }
  // Use a better naming convention eg. Bookmarks
  function generateItemsString(itemList) {
    const items = itemList.map((item) => generateItemElement(item));
    return items.join('');
  }

  function handleHeaderClick() {
    $('.js-bookmarks-list').on('click', '.bookmark-header', event => {
      $(event.currentTarget).next("article").toggleClass("hidden");
    });
  }

  function render() {
    // Filter item list if store prop is true by item.checked === false
    let items = store.items;

    // Filter item list if store prop `searchTerm` is not empty
    // if (store.searchTerm) {
    //   items = store.items.filter(item => item.name.includes(store.searchTerm));
    // }

    // render the shopping list in the DOM
    const listItemsString = generateItemsString(items);

    // insert that HTML into the DOM
    $('.bookmarks-list').html(listItemsString);
  }

  function handleNewItemSubmit() {
    $('#js-bookmark-form').submit(function (event) {
      event.preventDefault();
      const title = $('.js-bookmark-list-title').val();
      $('.js-bookmark-list-title').val('');

      const url = $('.js-bookmark-list-url').val();
      $('.js-bookmark-list-url').val('');

      const description = $('.js-bookmark-list-description').val();
      $('.js-bookmark-list-description').val('');


      const rating = $('input:radio[name="bookmark-rating"]:checked').val();

      let item = {};
      item.title = title;
      item.url = url;
      item.desc = description;
      item.rating = rating;

      //store.addItem(newItemName);
      api.createItem(item, (response) => {
        store.addItem(response);
        console.log("new item = ", response);
        render();
      });

    });
  }

  function getItemIdFromElement(item) {
    return $(item)
      .closest('.bookmark-item')
      .data('item-id');
  }

  // function handleItemCheckClicked() {
  //   $('.js-shopping-list').on('click', '.js-item-toggle', event => {
  //     const id = getItemIdFromElement(event.currentTarget);
  //     store.findAndToggleChecked(id);
  //     render();
  //   });
  // }

  function handleDeleteItemClicked() {
    $('.js-bookmarks-list').on('click', '.remove-bookmark-button', event => {
      // get the index of the item in store.items
      const id = getItemIdFromElement(event.currentTarget);
      // delete the item
      api.deleteItem(id, (response) => {
        console.log(response);
        store.findAndDelete(id);
        // render the updated shopping list
        render();
      });
    });
  }

  function handleEditItemSubmit() {
    $('.js-shopping-list').on('submit', '#js-edit-item', event => {
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      const itemName = $(event.currentTarget).find('.shopping-item').val();
      store.findAndUpdateName(id, itemName);
      render();
    });
  }

  function handleToggleFilterClick() {
    $('.js-filter-checked').click(() => {
      store.toggleCheckedFilter();
      render();
    });
  }

  function handleListSearch() {
    $('.js-shopping-list-search-entry').on('keyup', event => {
      const val = $(event.currentTarget).val();
      store.setSearchTerm(val);
      render();
    });
  }

  function bindEventListeners() {
    handleNewItemSubmit();
    // handleItemCheckClicked();
    handleDeleteItemClicked();
    handleEditItemSubmit();
    handleToggleFilterClick();
    handleListSearch();
    handleHeaderClick();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };

}());
