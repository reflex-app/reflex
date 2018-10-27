const LOCAL_STORAGE_KEY = 'shift-app';

export const artboardsLocalStorage = {
  fetch: function () {
    let artboards = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
    artboards.forEach(function (artboard, index) {
      artboard.id = index
    })
    artboardsLocalStorage.uid = artboards.length
    return artboards
  },
  save: function (artboards) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(artboards))
  }
}