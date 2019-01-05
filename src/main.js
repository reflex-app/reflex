import Vue from 'vue'
import App from './App.vue'
import store from './store/index'

// Vue Configuration
Vue.config.productionTip = false

// Create the <App> Vue instance
new Vue({
  el: "#app",
  store, // Vuex Store
  beforeCreate() {
		this.$store.commit('initLocalStorage'); // Get/Set localStorage
	},
  render: h => h(App)
})

// Subscribe to store updates
store.subscribe((mutation, state) => {
  console.log('Updated localStorage', mutation, state);

  // Ignore Panzoom mutations
  if ( mutation.type == "updatePanzoom" ) {
    return false;
  }

  // Store the state object as a JSON string
  localStorage.setItem('store', JSON.stringify(state));
});