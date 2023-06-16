/**
 * Event bus used by `<WebView>` to communicate with the Nuxt app (renderer process)
 */
// via https://dev.to/israelortuno/event-bus-pattern-in-nuxt-3-with-full-typescript-support-1okp
import mitt from 'mitt'
import { ApplicationEvents } from '~/types/events'

export default defineNuxtPlugin((nuxtApp) => {
  // Then we just inform mitt about our event types
  const emitter = mitt<ApplicationEvents>()

  if (nuxtApp.$config.public.DEV) {
    emitter.on('*', (type, e) => console.log(type, e))
  }

  // Access as this.$bus.on('EVENT-NAME', { name: 'John Doe' })
  return {
    provide: {
      bus: {
    emit: emitter.emit, // Will emit an event
    on: emitter.on, // Will register a listener for an event
    off: emitter.off, // Will remove a listener for an event
      },
    },
  }
})
