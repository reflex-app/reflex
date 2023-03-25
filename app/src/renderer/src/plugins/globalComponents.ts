/**
 * All components added here will be available globally
 */
// Component files
import Button from '@/components/Shared/Button.vue'
import Icon from '@/components/Shared/Icon.vue'
import TextInput from '@/components/Shared/TextInput.vue'

export default defineNuxtPlugin((nuxtApp) => {
  // Add global components
  nuxtApp.vueApp.component('Button', Button)
  nuxtApp.vueApp.component('Icon', Icon)
  nuxtApp.vueApp.component('TextInput', TextInput)
})
