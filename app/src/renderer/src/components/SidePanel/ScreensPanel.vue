<template>
  <div id="artboard-tabs">
    <!-- List of Artboards -->
    <div v-if="artboardsList.length" class="artboard-tabs__scroll">
      <artboardEditable :data="artboardsList" />
    </div>

    <!-- New Artboard -->
    <div>
      <Button role="primary" icon="plus" class="artboard-tabs__button" @click="add">
        New Screen
      </Button>
    </div>

    <!-- Show a tip if there's no artboards -->
    <div v-if="!artboardsList.length" class="empty-state">
      <div class="empty-state__text">Click to create a new screen</div>
    </div>

    <!-- Templates -->
    <div class="panel-section">
      <span>Add from template:</span>
      <select v-model="data.defaultSizeSelection" ref="presetDropdown">
        <option disabled value>Select template...</option>
        <option v-for="(preset, index) in data.presets" :key="index" :value="preset.label">
          {{ preset.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import artboardEditable from '@/components/SidePanel/artboardEditable.vue'
import { useArtboardsStore } from '~/store/artboards'

const artboards = useArtboardsStore()
const artboardsList = computed(() => artboards.list)

const presetDropdown = ref<HTMLElement>()

const data = reactive({
  defaultSizeSelection: '',
  presets: [
    {
      label: 'Default',
      value: {
        small: {
          title: 'Small',
          width: 375,
          height: 667,
        },
        medium: {
          title: 'Medium',
          width: 768,
          height: 1024,
        },
        large: {
          title: 'Large',
          width: 1024,
          height: 720,
        },
      },
    },
    {
      label: 'Bootstrap 4',
      value: {
        xsmall: {
          title: 'XS',
          width: 375,
          height: 500,
        },
        small: {
          title: 'S',
          width: 576,
          height: 800,
        },
        medium: {
          title: 'M',
          width: 768,
          height: 1000,
        },
        large: {
          title: 'MD',
          width: 992,
          height: 1200,
        },
        xlarge: {
          title: 'LG',
          width: 1200,
          height: 1400,
        },
      },
    },
    {
      label: 'Foundation 4',
      value: {
        small: {
          title: 'Small',
          width: 400,
          height: 600,
        },
        medium: {
          title: 'Medium',
          width: 640,
          height: 800,
        },
        large: {
          title: 'Large',
          width: 1024,
          height: 1200,
        },
      },
    },
    {
      label: 'TailwindCSS 2',
      value: {
        small: {
          title: 'sm',
          width: 640,
          height: 480,
        },
        medium: {
          title: 'md',
          width: 768,
          height: 1024,
        },
        large: {
          title: 'lg',
          width: 1024,
          height: 768,
        },
        xlarge: {
          title: 'xl',
          width: 1280,
          height: 1024,
        },
        xxlarge: {
          title: 'xxl',
          width: 1536,
          height: 2048,
        },
      },
    },
  ],
  artboards: {
    get() {
      return computed(() => artboards.list)
    },
    set(value: {}) {
      artboards.setArtboards(value)
    },
  },
})

watch(
  () => data.defaultSizeSelection,
  (presetLabel) => {
    if (!presetLabel) return

    // Check if preset matches any from this.presets
    const match = data.presets.find((preset) => preset.label === presetLabel)
    if (!match) {
      console.error(`No preset found with label: ${presetLabel}`)
      return
    }

    artboards.addMultipleArtboards({
      data: match.value,
    })

    // Empty selected value
    data.defaultSizeSelection = ''

    // Blur the DOM element
    presetDropdown.value?.blur()
  }
)

function add() {
  artboards.addArtboard({
    title: 'Untitled',
    width: 375,
    height: 667,
  })
}
</script>

<style lang="scss" scoped>
@import '@/scss/_variables.scss';

#artboard-tabs {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .artboard-tabs__scroll {
    flex-grow: 1;
    min-height: 0;
    overflow: auto;
  }

  .artboard-tabs__button {
    position: relative;
    margin: 1rem 1rem;
  }

  .empty-state {
    background: #535353;
    border: 1px solid #434343;
    box-shadow: 0 1px 4px 0 rgba(102, 102, 102, 0.5);
    border-radius: 4px;
    margin: 0 1rem;
    user-select: none;
    position: relative;
    animation: MoveUpDown 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;

    @keyframes MoveUpDown {

      0%,
      100% {
        bottom: 0;
      }

      50% {
        bottom: 8px;
      }
    }

    // Triangle
    &:after {
      content: '';
      position: absolute;
      top: -6px;
      left: 0.5rem;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0px 6px 6px 6px;
      border-color: transparent transparent #535353 transparent;
    }

    .empty-state__text {
      padding: 0.5rem;
      font-size: 0.8rem;
      line-height: 1.5;
      color: white;
    }
  }
}
</style>
