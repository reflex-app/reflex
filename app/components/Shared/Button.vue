<template>
  <div class="button" :class="containerStyles">
    <div ref="iconRef">
      <Icon
        v-if="icon"
        :name="icon"
        :color="iconColor"
        class="button__icon"
        @mounted="onIconMounted"
      />
    </div>

    <span class="button__text">
      <slot />
    </span>
  </div>
</template>

<script lang="ts" setup>
import Icon from './Icon.vue'

const iconRef = ref<HTMLDivElement | null>(null)
const slots = useSlots()

const props = defineProps({
  role: {
    type: String,
    default: 'secondary',
  },
  icon: {
    type: String,
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  tight: {
    type: Boolean,
    default: false,
  },
  isPressed: {
    type: Boolean,
    default: false,
  },
})

const containerStyles = computed(() => {
  // Returns a class name based on
  // some logic w/ props
  const classNames = []

  // Set primary/secondary
  switch (props.role) {
    case 'primary':
      classNames.push('button--primary')
      break
    case 'secondary':
      classNames.push('button--secondary')
      break
    case 'ghost':
      classNames.push('button--ghost')
      break
    case 'danger':
      classNames.push('button--danger')
      break
  }

  // Check for button content + icon
  const slotHasContent = !!slots.default

  if (slotHasContent && props.icon) {
    classNames.push('button--with-icon')
  }

  // If isPressed
  if (props.isPressed) {
    classNames.push('button--is-pressed')
  }

  // If tight
  if (props.tight) {
    classNames.push('button--tight')
  }

  // If rounded
  if (props.rounded) {
    classNames.push('button--rounded')
  }

  return classNames
})

const iconColor = computed(() => {
  if (!props.icon) return false

  switch (props.role) {
    // Dark BG
    case 'primary':
      return 'light'

    // Light BG
    case 'secondary':
    case 'ghost':
      return 'dark'

    default:
      return false
  }
})

const onIconMounted = () => {
  if (!iconRef.value) return
  console.log('test', iconRef.value)

  const svgs = iconRef.value.querySelectorAll('svg')
  let classToAdd = ''

  svgs.forEach((svg: Element) => {
    let hasFill = false
    let hasStroke = false

    svg.querySelectorAll('g, path').forEach((g: Element) => {
      let fill = g.getAttribute('fill')
      let stroke = g.getAttribute('stroke')

      if (fill && fill !== 'none') {
        hasFill = true
        g.classList.add('icon-target--fill')
      }
      if (stroke && stroke !== 'none') {
        hasStroke = true
        g.classList.add('icon-target--stroke')
      }
    })

    if (hasFill && hasStroke) {
      classToAdd = 'has-fill-and-stroke'
    } else if (hasFill) {
      classToAdd = 'has-fill'
    } else if (hasStroke) {
      classToAdd = 'has-stroke'
    } else {
      classToAdd = 'has-no-fill-or-stroke'
    }

    svg.classList.add(classToAdd)
  })
}
</script>

<style lang="scss" scoped>
@import '@/scss/_variables.scss';

.button {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: #ffffff;
  border: 1px solid transparent;
  border-radius: 4px;
  user-select: none;
  cursor: pointer;
  line-height: 1;
  // box-shadow: 0 1px 2px 0px rgba(#6a6a6a, 0.2);
  // transition: all 75ms ease-in-out;

  // &:hover {
  //   background: #f5f5f5;
  // }

  // &:active {
  //   color: darken(#6f6f6f, 40%);
  //   background: darken(white, 20%);
  // }

  &.button--primary {
    color: white;
    background: $accent-color;

    &:hover {
      cursor: pointer;
      background: $accent-color;
    }

    &:active {
      color: white;
      background: darken($accent-color, 15%);
    }
  }

  &.button--secondary {
    border-color: #b8b8b8;

    // &:hover {
    //   background: #f5f5f5;
    // }

    &:active {
      color: darken(#6f6f6f, 40%);
      background: darken(white, 20%);
    }
  }

  &.button--ghost {
    box-shadow: none;
    border-color: transparent;

    &:hover:not(.button--is-pressed) {
      background: #efefef;
    }

    &:active:not(.button--is-pressed) {
      color: darken(#6f6f6f, 40%);
      background: #cecece;
    }
  }

  &.button--danger {
    color: white;
    background: red;
    box-shadow: none;
    border-color: transparent;

    &:hover {
      background: darken(red, 5%);
    }

    &:active {
      color: white;
      background: darken(red, 15%);
    }
  }

  // MODIFIERS

  &.button--is-pressed {
    color: $accent-color;
    border-color: $accent-color;
    box-shadow: 0 0 3px rgba($accent-color, 0.5);
    background: rgba($accent-color, 0.1);
    background: $accent-color;

    .button__icon {
      // if svg has a fill, change it
      // otherwise if svg has a stroke, change that

      :deep(svg) {
        .icon-target--fill {
          fill: white;

          &:hover {
            fill: $accent-color;
          }
        }

        .icon-target--stroke {
          stroke: white;

          &:hover {
            stroke: $accent-color;
          }
        }
      }
    }
  }

  &.button--rounded {
    border-radius: 50%;
    padding: 0.5rem; // This is required so that it's a square
  }

  &.button--tight {
    padding: 0;
  }
}

.button--with-icon {
  .button__icon {
    margin-right: 0.25rem;
  }

  .button__text {
    padding-right: 0.25rem;
  }
}
</style>
