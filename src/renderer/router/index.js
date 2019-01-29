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
      path: '*',
      redirect: '/'
    }
  ]
})
