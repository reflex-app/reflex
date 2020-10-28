<template>
  <div
    class="icon"
    :style="{ maskImage: `url(${iconHandler}` }"
    :class="iconColorHandler"
  ></div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'dark',
    },
  },
  computed: {
    iconHandler() {
      try {
        return require(`@/assets/icons/${this.name}.svg`)
      } catch (e) {
        throw new Error(`Icon not found: ${this.name}`)
      }
    },
    iconColorHandler() {
      switch (this.color) {
        case 'dark':
          return 'icon--dark'

        case 'light':
          return 'icon--light'

        case 'accent':
          return 'icon--accent'

        default:
          throw new Error('Color not found')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/_variables';

.icon {
  display: inline-block;
  height: 24px;
  width: 24px;
  mask-repeat: no-repeat;
  mask-position: center;
  // TODO The following should be autoprefixed...
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;

  &.icon--dark {
    background: black;
  }
  &.icon--light {
    background: white;
  }
  &.icon--accent {
    background: $accent-color;
  }
}
</style>
