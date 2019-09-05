import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-view',
      component: require('@/views/MainView').default
    },
    {
      path: '/focus',
      name: 'focus-view',
      component: require('@/views/FocusView').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
