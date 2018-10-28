// TODO: Move this file somewhere better

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
  },
  updateSize: function (artboard) {
    let artboards = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    for (var i = 0; i < artboards.length; i++) {
      if (artboard.id === artboards[i].id) { //look for match by id
        artboards[i].height = artboard.height; // updated object
        artboards[i].width = artboard.width; // updated object
        break; //exit loop, object has been updated
      }
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(artboards)); //put the object back
  }
}