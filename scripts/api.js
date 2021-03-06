// eslint-disable-next-line no-unused-vars
'use strict';
const api = (function () {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/miriam/bookmarks';

  const getItems = function (callback) {
    $.getJSON(
      BASE_URL,
      (response) => {
        callback(response);
      });
  };

  const createItem = function (bookmark, callback) {
    const newBookmark = JSON.stringify(bookmark);
    $.ajax({
      url: BASE_URL,
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: newBookmark,
      success: callback
    });
  };

  const editItem = function (id, newBookmarkData, callback) {
    delete newBookmarkData.id
    $.ajax({
      url: BASE_URL + '/' + id,
      method: 'PATCH',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(newBookmarkData),
      success: callback
    });
  };  

  const deleteItem = function (id, callback) {
    console.log('bin deleteItem id =', id);
    // const newBookmark = JSON.stringify(bookmark);
    // console.log("after stringify", newBookmark);
    $.ajax({
      url: BASE_URL + '/' + id,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: callback
    });

  };

  return {
    getItems,
    createItem,
    deleteItem,
    editItem
  };
}());
