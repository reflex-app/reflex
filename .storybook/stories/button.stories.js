// import Vue from 'vue'
// import Button from '../components/shared/Button.vue'

export default {
  title: 'Button'
}

export const primaryButton = () => '<Button role="primary">Button</Button>'

export const secondaryButton = () => '<Button role="secondary">Button</Button>'

export const withIcon = () => '<Button icon="plus">Button</Button>'

export const tight = () => '<Button :tight="true">Button</Button>'

export const rounded = () => '<Button :rounded="true">Button</Button>'

export const roundedIcon = () => '<Button :rounded="true" icon="plus"></Button>'

// export const asAComponent = () => ({
//   components: {
//     Button
//   },
//   template: '<Button :rounded="true">rounded</Button>'
// })
