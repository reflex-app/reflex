// This script manages the state involved with the synchronization
// The core logic of setting DOM effects is within "inject.js"

import { reactive, watchEffect } from 'vue'

export const state = reactive({
  publisher: '', // Will be an ID of the artboard that is currently the source of events
})

export function setPublisher(id) {
  state.publisher = id
}
