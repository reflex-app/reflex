/**
 * All components added here will be available globally
 */
import Vue from 'vue'

// Component files
import Button from '@/components/shared/Button.vue'
import Icon from '@/components/shared/Icon.vue'
import TextInput from '@/components/shared/TextInput.vue'

// Register as components
Vue.component('Button', Button)
Vue.component('Icon', Icon)
Vue.component('TextInput', TextInput)
