// Electron main process data store
// https://github.com/sindresorhus/electron-store
const Store = require('electron-store')

const schema = {
  bounds: {
    type: 'object',
    properties: {
      x: { type: 'number' },
      y: { type: 'number' },
      width: { type: 'number' },
      height: { type: 'number' },
    },
  },
  isMaximized: {
    type: 'boolean',
  },
}

export const store = new Store({ schema })

// interface WindowState {
//   bounds?: {
//     x: number
//     y: number
//     width: number
//     height: number
//   }
//   isMaximized?: boolean
// }

// Initialize
