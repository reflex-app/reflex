import { shallowMount } from '@vue/test-utils'
import Artboards from '../src/components/Artboards'

describe('Artboards', () => {
  const wrapper = shallowMount(Artboards)
  const vm = wrapper.vm

  it('Should be a Vue component', function() {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('Initially shows a welcome message', () => {
    expect(wrapper.html()).toContain('Welcome to Shift')
  })

  it('Has an empty Artboards array', () => {
    expect(vm.artboards).toEqual([])
  })

  it('add() - Can store new Artboards', () => {
    vm.add();
    expect(vm.artboards.length == 1).toBe(true)
    vm.add();
    expect(vm.artboards.length == 2).toBe(true)
  })
  
  it('remove() - Can remove Artboards', () => {
    vm.remove(2)
    expect(vm.artboards.length == 1).toBe(true)
  })
})
