import Vue from 'vue'
import Vuex from 'vuex'

// Configure our Vuex Store
Vue.use(Vuex)

// Make Store accessible from components
export default new Vuex.Store({
  state: {
    url: "", // The current URL being viewed
    artboards: [], // All artboards on the screen
    panzoom: {} // Holds Panzoom class info
  },
  mutations: {
    initLocalStorage(state) {
			// Check if the ID exists
			if(localStorage.getItem('store')) {
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
    updatePanzoom(state, val) {
      state.panzoom = val;
    },
    addArtboard(state, artboard) {
      // console.log(artboard);
      console.log(artboard);
      state.artboards.push(artboard);
    },
    removeArtboard(state, id) {
      state.artboards.splice(id, 1);
    }
  }
})