import Vue from 'vue'
import Vuex from 'vuex'

// Configure our Vuex Store
Vue.use(Vuex)

// Make Store accessible from components
const store = new Vuex.Store({
  state: {
    url: "", // The current URL being viewed
    artboards: [], // All artboards on the screen
    // panzoom: {} // Holds Panzoom class info
  },
  mutations: {
    initLocalStorage(state) {
      // Check if the ID exists
      if (localStorage.getItem('store')) {
        // Replace the state object with the stored item
        this.replaceState(
          Object.assign(state, JSON.parse(localStorage.getItem('store')))
        );
      }
    },
    changeURL(state, val) {
      state.url = val; // Update the URL based on the incoming value

      // eslint-disable-next-line
      console.log("New URL:", this.state.url);
    },
    // updatePanzoom(state, val) {
    //   // state.panzoom = val;
    // },
    addArtboard(state, artboard) {
      console.log("Artboard:", artboard);
      state.artboards.push(artboard);
    },
    removeArtboard(state, id) {
      console.log("Remove Artboard ID: ", id);
      state.artboards.splice(id, 1);
    },
    resizeArtboard(state, payload) {
      const artboards = state.artboards;

      for (var i = 0; i < artboards.length; i++) {
        if (payload.id === artboards[i].id) { //look for match by id
          artboards[i].height = payload.height; // updated object
          artboards[i].width = payload.width; // updated object
          break; //exit loop, object has been updated
        }
      }
    }
  }
})

// Initialize localStorage
store.commit('initLocalStorage');

// Subscribe to store updates
store.subscribe((mutation, state) => {
  // Ignore Panzoom mutations
  if (mutation.type == "updatePanzoom") {
    return false;
  }

  // Store the state object as a JSON string
  localStorage.setItem('store', JSON.stringify(state));

  // Log the changes
  // console.log('Added to localStorage:', mutation, state, );
  // console.log('Updated localStorage:', JSON.parse(localStorage.getItem('store')) );
});

export default store;