// import {
//   shallowMount,
//   createLocalVue
// } from '@vue/test-utils'

// import Vuex from 'vuex'

// // import interactions from '@/store/modules/interactions'

// import artboards from '@/components/Artboards.vue'

// describe('artboards', () => {
//   const localVue = createLocalVue()
//   localVue.use(Vuex)

//   // const store = new Vuex.Store({
//   //   modules: {
//   //     interactions
//   //   },
//   //   strict: false
//   // })

//   const wrapper = shallowMount(artboards, {
//     localVue
//   })

//   test('initially shows a welcome message', () => {
//     expect(wrapper.html()).toContain('Welcome to Shift')
//   })
// })

// import {
//   getters
// } from '../somepath/modules/auth'
import {
  shallowMount,
  createLocalVue
} from '@vue/test-utils'
import Vuex from 'vuex'
import ComponentWithVuex from '@/components/Artboards.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

const store = new Vuex.Store({
  getters: {
    isInteracting: false
  }
})

describe('App', () => {
  it('should have beforeMount hook', () => {
    const wrapper = shallowMount(ComponentWithVuex, {
      store,
      localVue
    })
    wrapper.setComputed({
      tokenExpired: true
    })
  })
})
