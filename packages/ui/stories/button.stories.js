import myButton from './Button.vue'

export default {
  title: 'Components/Button',
  component: myButton,
  argTypes: {},
}

const Template = () => ({
  components: { myButton },
  template: '<my-button />',
})

export const Primary = Template.bind({})
