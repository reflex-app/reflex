<template>
  <div
    v-if="$config.public.DEV"
    class="dev-state"
    :class="hudPosition"
    @click="toggleHudPosition"
  >
    <div>
      <CollapsibleContainer title="Sites">
        <div>
          <ul>
            <li @click="goToSite('https://www.katiecooper.co/')">Classic</li>
            <li @click="goToSite('https://nextjs.org/')">Marketing</li>
            <li @click="goToSite('https://nextjs.org/docs')">Documentation</li>
            <li @click="goToSite('https://rauno.me/craft')">Performance</li>
          </ul>
        </div>
      </CollapsibleContainer>
      <CollapsibleContainer title="userInteractionState">
        <div v-for="[key, value] of Object.entries(userInteractionState)">
          {{ key }}: {{ value }}
        </div>
      </CollapsibleContainer>
      <CollapsibleContainer title="interactionsStore">
        <div v-for="[key, value] of Object.entries(interactionsStore.$state)">
          {{ key }}: {{ value }}
        </div>
        <div>currentContext: {{ interactionsStore.currentContext }}</div>
      </CollapsibleContainer>
    </div>
    <div>
      <DevListeners />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useEventHandler from '@/components/Screens/useEventHandler'
import { useInteractionStore } from '~/store/interactions'
import DevListeners from '~/components/DevListeners.vue'
import CollapsibleContainer from '~/components/CollapsibleContainer.vue'
import { useHistoryStore } from '@/store/history'

const interactionsStore = useInteractionStore()
const { state: userInteractionState } = useEventHandler() // init event handling
const historyStore = useHistoryStore()

const hudPosition = ref<'left' | 'right' | 'closed'>('right')

function toggleHudPosition() {
  // switch (hudPosition.value) {
  //   case 'left':
  //     hudPosition.value = 'right'
  //     break
  //   case 'right':
  //     hudPosition.value = 'closed'
  //     break
  //   case 'closed':
  //     hudPosition.value = 'left'
  //     break
  //   default:
  //     break
  // }

  console.log(hudPosition.value)
}

function goToSite(newUrl: string) {
  historyStore.changeSiteData({ url: newUrl })
}
</script>

<style lang="scss" scoped>
$offset: 1rem;

.dev-state {
  position: fixed;
  z-index: 200;
  color: white;
  background: rgba($color: #3d3d3d, $alpha: 0.5);
  padding: 0.5rem;
  border-radius: 4px;
  max-width: 300px;
  max-height: calc(100% - ($offset * 2));
  overflow: auto;

  &.left {
    bottom: $offset;
    left: $offset;
  }

  &.right {
    bottom: $offset;
    right: $offset;
  }

  &.closed {
    bottom: $offset;
    right: $offset;
    height: 1rem;
    width: 1rem;
    overflow: hidden;
  }
}
</style>
