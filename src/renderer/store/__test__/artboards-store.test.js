import {
  createLocalVue
} from '@vue/test-utils'
import Vuex from 'vuex'
import artboards from '@/store/modules/artboards'

// Reusable VueX setup
function setup() {
  const localVue = createLocalVue()
  localVue.use(Vuex)

  return new Vuex.Store({
    modules: {
      artboards
    },
    strict: false
  })
}

// Expect empty array to exist
test('empty state exists', () => {
  const store = setup()
  expect(store.state.artboards.list).toEqual([])
})

describe('artboards: add, remove', () => {
  const store = setup()

  test('adds an artboard to array', () => {
    const newArtboard = {
      title: 'Untitled',
      width: 375,
      height: 667
    }

    // Dispatch to VueX
    store.dispatch('addArtboard', newArtboard)

    // Check the result
    expect(store.state.artboards.list.length).toBe(1)
    expect(store.state.artboards.list).toEqual([newArtboard])
  })

  test('removes an artboard at index', () => {
    // Dispatch to VueX
    store.commit('artboards/removeArtboard', 0)

    // Check the result
    expect(store.state.artboards.list.length).toBe(0)
    expect(store.state.artboards.list).toEqual([])
  })
})
