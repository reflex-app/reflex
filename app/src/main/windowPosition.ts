import { store } from './store'

interface WindowState {
  isMaximized?: boolean
  bounds?: {
    x?: number
    y?: number
    width?: number
    height?: number
  }
}

const winVariable = 'winPosition'
let windowState: WindowState = {}

// When opening your app, try to load in your state
export function onAppLoad() {
  try {
    windowState = store.get(winVariable) || {}
  } catch (err) {
    // Of course this will not work on first launch so you need to deal with that.
    // The variable is there, but corrupt. Handle appropriately:
    console.error('Error loading window state', err)
  }
}

export function saveState(window) {
  // Set the current state window maximized
  // Maximized is not fullscreen!
  windowState.isMaximized = window.isMaximized()

  if (!windowState.isMaximized) {
    // only update bounds if the window isn’t currently maximized
    windowState.bounds = window.getBounds()
  }

  // Save the state to the store
  store.set(winVariable, windowState)
}

export function getState() {
  return windowState
}

export default {
  onAppLoad,
  saveState,
  getState,
}
