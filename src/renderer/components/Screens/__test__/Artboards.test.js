import {
  shallowMount,
  createLocalVue
} from '@vue/test-utils'
// import store from '@/store'
import Vuex from 'vuex';
import Artboards from '../Artboards.vue'

let wrapper;
let store;
let actions;
let mutations;
let state;
const appName = 'Reflex'

const localVue = createLocalVue()
localVue.use(Vuex);

beforeEach(() => {
  actions = {
    someAction: jest.fn()
  };
  mutations = {
    someMutation: jest.fn()
  };
  state = {
    key: {}
  };
  store = new Vuex.Store({
    actions,
    mutations,
    state,
  });
  wrapper = shallowMount(Artboards, {
    store,
    localVue,
  });
})

afterEach(() => {
  wrapper.destroy();
});


describe('Component', () => {
  test('is a Vue instance', () => {
    expect(wrapper.isVueInstance).toBeTruthy();
  });
});


// describe('empty state', () => {
//   const wrapper = mount(ComponentWithVuex, {
//     // store,
//     localVue
//   })

//   test('should display welcome message', () => {
//     expect(wrapper.html()).toContain(`Welcome to ${appName}`)
//   })

//   test('should inform how to add screen sizes', () => {
//     expect(wrapper.html()).toContain('You can create new screens in the Screens panel on the left.')
//   })
// })
