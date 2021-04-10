/**
 * Event emitter
 * This allows us to expose the download progress
 * See: lib/install/browserFetcher.js
 */
import { EventEmitter } from 'events'
export const downloadEmitter = new EventEmitter()

/**
 * Here's an example
 */

// Listen to progress events
downloadEmitter.on('progress', ({ current, total, name }) => {
  const msg = `Downloading ${name} - ${current}/${total}`
  console.log(msg)
})

downloadEmitter.on('done', () => {
  // Function here
})
