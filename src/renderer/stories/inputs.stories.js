import TextInput from '@/components/shared/TextInput'
import {
  action
} from '@storybook/addon-actions'

export default {
  title: 'Text Input'
}

export const normal = () => ({
  components: {
    TextInput
  },
  methods: {
    triggerKeyup() {
      action('keyup')()
    }
  },
  template: '<TextInput placeholder="Title" @keyup="triggerKeyup">Some text</TextInput>'
})
