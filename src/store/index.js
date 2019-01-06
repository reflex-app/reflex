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

    updateArtboardAtIndex(state, artboard) {
      // 1. Get the artboard.id
      let id = artboard.id;
      let index = state.artboards.findIndex(obj => obj.id == id);

      // 2. Change just that artboard's content
      Vue.set(state.artboards, index, artboard);
    },

    addArtboard(state, artboard) {
      let artboards = this.state.artboards;
      let artboardsCounter = this.state.artboards.length || 0;
      
      const uniqueID = () => {
        function check(val) {
          if (artboards.find(artboard => artboard.id === val)) {
            return false; // not unique
          } else {
            return true; // it's unique
          }
        }
        
        let increment = artboardsCounter; // 0+
        let flag = false;
        
        while(flag === false) {
          let val = increment++;
          const flag = check(val); // True or False
          
          if ( flag === true ) {
            return val;
          }
        }
      };
      
      // Append a unique ID
      artboard.id = uniqueID();
      
      // Log the newly created artboard
      // console.log("Artboard:", artboard);

      // Add to the array
      state.artboards.push(artboard);
    },

    removeArtboard(state, id) {
      // 1. Get the artboard.id
      let index = state.artboards.findIndex(obj => obj.id == id);
      
      // 2. Change just that artboard's content
      Vue.delete(state.artboards, index);

      // console.log("Remove Artboard ID: ", id, element);
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