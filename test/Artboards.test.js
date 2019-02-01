import {
  shallowMount,
  createLocalVue
} from '@vue/test-utils'

import Vuex from 'vuex'

import Artboards from '../src/components/Artboards.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

const store = new Vuex.Store({
  state: {
    artboards: [] // All artboards on the screen
  }
})

describe('Artboards', () => {
  const wrapper = shallowMount(Artboards, {
    store,
    localVue
  })
  const vm = wrapper.vm

  it('Should be a Vue component', function () {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('Initially shows a welcome message', () => {
    expect(wrapper.html()).toContain('Welcome to Shift')
  })

  it('Has an empty Artboards array', () => {
    expect(vm.artboards).toEqual([])
  })

  // it('add() - Can store new Artboards', () => {
  //   vm.add();
  //   expect(vm.artboards.length == 1).toBe(true)
  //   vm.add();
  //   expect(vm.artboards.length == 2).toBe(true)
  // })

  // it('remove() - Can remove Artboards', () => {
  //   vm.remove(2)
  //   expect(vm.artboards.length == 1).toBe(true)
  // })

  // it('resize() - Can update localStorage on resize', () => {
  //   const mock = {
  //     height: 500,
  //     width: 500,
  //     id: 0
  //   }

  //   expect(vm.artboards.length == 1).toBe(true)
  //   vm.resize(mock)
  //   console.log(vm.artboards[0].width, vm.artboards[0].height);

  //   // Expect the height and width to be updated
  //   expect(vm.artboards[0].width == 500).toBe(true)
  //   expect(vm.artboards[0].height == 500).toBe(true)
  //   expect(vm.artboards[0].id == 1).toBe(true)
  // })
})
