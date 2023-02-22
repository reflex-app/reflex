<template>
  <div>
    <button
      type="button"
      @click="toggleCollapsed($event)"
      ref="collapsibleRef"
      class="collapsible"
    >
      {{ props.title }}
    </button>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Template ref
const collapsibleRef = ref()

// Props
const props = defineProps(['title'])

function toggleCollapsed(e: Event) {
  const el = e.target as HTMLElement
  if (!el) return false

  el.classList.toggle('active')
  var content = el.nextElementSibling as HTMLElement
  if (!content) return false
  if (content.style.display === 'block') {
    content.style.display = 'none'
  } else {
    content.style.display = 'block'
  }
}
</script>

<style lang="scss" scoped>
.collapsible {
  background-color: #777;
  color: white;
  cursor: pointer;
  padding: 18px;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 1rem;

  &:hover {
    background-color: #555;
  }
}

.content {
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
  display: none;
  overflow: hidden;
}
</style>
