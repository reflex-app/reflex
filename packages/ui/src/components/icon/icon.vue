<template lang="pug">
component.w-icon(
  :is="tag || 'i'"
  :class="classes"
  v-bind="$attrs"
  role="icon"
  aria-hidden="true"
  :style="styles")
  svg(class="feather" viewBox="0 0 24 24" :class="classes"  :style="styles")
    use(
      :xlink:href="require('@/assets/icons/featherSprite.svg')+`#${icon}`"
      )
</template>

<script lang="ts">
// {/* import config from '../utils/config' */}
import { ref, computed, defineAsyncComponent, toRefs } from 'vue'

export default {
  name: 'rfx-icon',
  props: {
    tag: { type: String, default: 'i' },
    /**
     * The name of the icon to use.
     * See: https://feathericons.com/
     */
    icon: { type: String, required: true },
    /**
     * The size of the icon
     */
    size: {
      type: String,
      default: 'sm',
      validator: function (value) {
        return ['xs', 'sm', 'md', 'lg'].includes(value)
      },
    },
    color: { type: String },
    bgColor: { type: String },
    flipX: { type: Boolean },
    flipY: { type: Boolean },
  },
  emits: [],
  setup(props, ctx) {
    const classes = computed(() => {
      return {
        [props.icon]: true,
        [props.color]: props.color,
        [`${props.bgColor}--bg`]: props.bgColor,
        [`size--${props.size}`]: props.size,
        // 'w-icon--spin': props.spin,
        // 'w-icon--rotate45': props.rotate45,
        // 'w-icon--rotate90': props.rotate90,
        // 'w-icon--rotate135': props.rotate135,
        // 'w-icon--rotate180': props.rotate180,
        // 'w-icon--rotate-45': props.rotate45a,
        // 'w-icon--rotate-90': props.rotate90a,
        // 'w-icon--rotate-135': props.rotate135a,
        'w-icon--flip-x': props.flipX,
        'w-icon--flip-y': props.flipY,
      }
    })

    const styles = computed(() => {
      return ''
    })

    return {
      // props,
      classes,
      styles,
    }
  },
}
</script>

<style lang="scss" scoped>
$base-font-size: 16px;

svg.feather {
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;

  &.size--xs {
    font-size: round(0.85 * $base-font-size);
    height: round(0.85 * $base-font-size);
    width: round(0.85 * $base-font-size);
  }
  &.size--sm {
    font-size: round(1.15 * $base-font-size);
    height: round(1.15 * $base-font-size);
    width: round(1.15 * $base-font-size);
  }
  &.size--md {
    font-size: round(1.4 * $base-font-size);
    height: round(1.4 * $base-font-size);
    width: round(1.4 * $base-font-size);
  }
  &.size--lg {
    font-size: round(1.7 * $base-font-size);
    height: round(1.7 * $base-font-size);
    width: round(1.7 * $base-font-size);
  }
  &.size--xl {
    font-size: 2 * $base-font-size;
    height: round(2 * $base-font-size);
    width: round(2 * $base-font-size);
  }
}

.w-icon {
  // position: relative;
  // display: inline-flex;
  // border-radius: 100%;
  // align-items: center;
  // justify-content: center;
  // vertical-align: middle;
  // user-select: none;
  // line-height: 1;
  // font-size: 1.2em;
  // width: 1em;
  // height: 1em;

  // &.size--xs {
  //   font-size: round(0.85 * $base-font-size);
  // }
  // &.size--sm {
  //   font-size: round(1.15 * $base-font-size);
  // }
  // &.size--md {
  //   font-size: round(1.4 * $base-font-size);
  // }
  // &.size--lg {
  //   font-size: round(1.7 * $base-font-size);
  // }
  // &.size--xl {
  //   font-size: 2 * $base-font-size;
  // }
  // In w-button and w-alert.
  // .w-button &, .w-alert & {font-size: round(1.4 * $base-font-size);}
  // Always an even number to vertical align well in button.
  .w-button.size--xs & {
    font-size: round(0.95 * $base-font-size / 2) * 2;
  }
  .w-alert.size--xs & {
    font-size: $base-font-size;
  }
  .w-button.size--sm &,
  .w-alert.size--sm & {
    font-size: round(1.15 * $base-font-size);
  }
  // .w-button.size--md &, .w-alert.size--md & {font-size: round(1.4 * $base-font-size);}
  .w-button.size--lg &,
  .w-alert.size--lg & {
    font-size: round(1.7 * $base-font-size);
  }
  .w-button.size--xl &,
  .w-alert.size--xl & {
    font-size: 2 * $base-font-size;
  }
  &--spin:before {
    animation: w-icon--spin 2s infinite linear;
  }
  &--rotate45:before {
    transform: rotate(45deg);
  }
  &--rotate90:before {
    transform: rotate(90deg);
  }
  &--rotate135:before {
    transform: rotate(135deg);
  }
  &--rotate180:before {
    transform: rotate(180deg);
  }
  &--rotate-45:before {
    transform: rotate(-45deg);
  }
  &--rotate-90:before {
    transform: rotate(-90deg);
  }
  &--rotate-135:before {
    transform: rotate(-135deg);
  }
  &--flip-x:before {
    transform: scaleX(-1);
  }
  &--flip-y:before {
    transform: scaleY(-1);
  }
}
@keyframes w-icon--spin {
  0% {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
