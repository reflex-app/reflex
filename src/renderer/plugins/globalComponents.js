/**
 * All components added here will be available globally
 */
import Vue from 'vue'

// Component files
import Button from '@/components/Shared/Button.vue'
import Icon from '@/components/Shared/Icon.vue'

// Register as components
Vue.component('Button', Button)
Vue.component('Icon', Icon)
