const mutations = {
  initLocalStorage(state) {
    // Check if the ID exists
    if (localStorage.getItem('store')) {
      // Replace the state object with the stored item
      this.replaceState(
        Object.assign(this.state, JSON.parse(localStorage.getItem('store')))
      )
    } else {
      localStorage.setItem('store', JSON.stringify(this.state))
    }
  }
}

const actions = {
  initLocalStorage({commit}) {
    commit('initLocalStorage')
  }
}

export default {
  mutations,
  actions
}
