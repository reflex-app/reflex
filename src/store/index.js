import Vue from 'vue'
import Vuex from 'vuex'

// Configure our Vuex Store
Vue.use(Vuex)

// Make Store accessible from components
const store = new Vuex.Store({
  state: {
    site: {
      url: "", // The current URL being viewed
      title: "" // The title of the page being viewed
    },
    artboards: [], // All artboards on the screen
    gui: {
      sidebar: true
    },
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

    /** Sets the Site Title (via iFrame)
     * @param  {} state
     * @param  {} val
     */
    changeSiteTitle(state, val) {
      console.log(val);
      if (val !== state.site.title) {
        state.site.title = val;
      }
    },

    /** Change the Site URL
     * @param  {} state
     * @param  {} val
     */
    changeSiteURL(state, val) {
      if (val && val !== "" && val !== state.site.url) {
        state.site.url = val; // Update the URL based on the incoming value
      }
    },

    /** Toggle the Sidebar on/off
     * @param  {} state
     * @param  {} val
     */
    toggleSidebar(state) {
      state.gui.sidebar = !state.gui.sidebar;
    },

    /**
     * Add an Artboard
     * @param  {} state
     * @param  {} artboard
     */
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

        while (flag === false) {
          let val = increment++;
          const flag = check(val); // True or False

          if (flag === true) {
            return val;
          }
        }
      };

      // Append a unique ID
      artboard.id = uniqueID();

      // Add to the array
      state.artboards.push(artboard);
    },

    /**
     * Remove an Artboard
     * @param  {} state
     * @param  {} id
     */
    removeArtboard(state, id) {
      let index = state.artboards.findIndex(obj => obj.id == id);
      Vue.delete(state.artboards, index);
    },

    /** Modify an Artboard by Index
     * @param  {} state
     * @param  {Object} artboard {id}
     */
    updateArtboardAtIndex(state, artboard) {
      // 1. Get the artboard.id
      let id = artboard.id;
      let index = state.artboards.findIndex(obj => obj.id == id);

      // 2. Change just that artboard's content
      Vue.set(state.artboards, index, artboard);
    },

    /** Resize an Artboard
     * @param  {} state
     * @param  {Object} payload {id, height, width}
     */
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
});

export default store;