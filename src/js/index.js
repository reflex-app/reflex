// Required scripts
import Vue from './required/vue.dev';
import panzoom from './plugins/panzoom.min';

// Import Views
import artboard from './views/artboard';

// Import the logic
// import add from './components/add';

const LOCAL_STORAGE_KEY = 'shift-app';
let artboardsLocalStorage = {
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

let app = new Vue({
  el: 'main',

  // Data to be made accessible throughout the app
  data: {
    artboards: artboardsLocalStorage.fetch()
  },

  // Watch localStorage for changes
  watch: {
    artboards: {
      handler: function (artboards) {
        artboardsLocalStorage.save(artboards)
      },
      deep: true
    }
  },

  methods: {
    addArtboard() {
      this.artboards.push({
        id: artboardsLocalStorage.uid++,
        width: 400, // TODO: dynamic
        height: 400 // TODO: dynamic
      })
    }
  }

})


// Create a movable canvas
var canvas = document.querySelector('#canvas')
panzoom(canvas);


// // Create artboards
// require('../js/features/artboard/artboard');
// app.artboards = new Artboard('.artboard');
// console.log(app.artboards.update());
// // app.artboards.add("before", this, 500, 800);