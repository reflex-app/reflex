import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  routes: [{
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

/* Watch the focusMode toggle, change the route */
store.watch((state) => state.gui.focusMode, (oldValue, newValue) => {
  if (newValue === true) {
    router.push({
      path: '/focus'
    })
  } else if (newValue === false) {
    router.push({
      path: '/'
    })
  }
})

export default router
