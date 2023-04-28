<template>
  <div class="download-progress-indicator" :title="readyToInstall ? 'Click to update' : 'Downloading update...'"
    v-on="readyToInstall ? { click: clickHandler } : {}">
    <svg :viewBox="`0 0 ${size} ${size}`" class="circular-chart" :class="{ 'is-complete': readyToInstall }">
      <path class="circle" :d="`M${x} ${y}
                a ${radius} ${radius} 0 0 1 0 ${diameter}
                a ${radius} ${radius} 0 0 1 0 -${diameter}`" :stroke-width="strokeWidth"
        :stroke-dasharray="`${percentage} 100`" />
    </svg>
    <div v-if="percentage === 100" class="download-complete">
      <Icon name="download" color="light" class="download-icon" />
    </div>
  </div>
</template>

<script>
export default {
  /**
   * Inspired by:
   * https://medium.com/@pppped/how-to-code-a-responsive-circular-percentage-chart-with-svg-and-css-3632f8cd7705
   */
  props: {
    strokeWidth: {
      type: Number,
      default: 3,
    },
    percentage: {
      type: Number,
      default: 30,
    },
  },

  data() {
    return {
      size: 36,
    }
  },

  computed: {
    x() {
      return this.size / 2
    },
    y() {
      return (this.size - this.diameter) / 2
    },
    pi() {
      return 3.14159
    },
    radius() {
      return 100 / (this.pi * 2)
      //      ^ magic number
    },
    diameter() {
      return this.radius * 2
    },
    readyToInstall() {
      if (this.percentage === 100) {
        return true
      }
      return false
    },
  },
  methods: {
    clickHandler() {
      this.$emit('click')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/_variables.scss';

.download-progress-indicator {
  position: relative;
}

.circular-chart {
  display: block;
  max-width: $gui-title-bar-height;
  padding: 0.5rem;
  width: 100%;

  &.is-complete .circle {
    stroke: white;
  }
}

.circle {
  position: relative;
  display: block;
  stroke: #4cc790;
  fill: none;
  stroke-linecap: round;
  transition: all 0.3s ease-in-out;
}

.download-complete {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #0fc616;
  height: 80%;
  width: 80%;
  z-index: -1;
  border-radius: 50%;
  padding: 0.5rem;

  .download-icon {
    transform: scale(0.7);
  }
}
</style>
