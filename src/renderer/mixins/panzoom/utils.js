function eventListener(method, elements, events, fn, options = {}) {
  // Normalize array
  if (elements instanceof HTMLCollection || elements instanceof NodeList) {
    elements = Array.from(elements)
  } else if (!Array.isArray(elements)) {
    elements = [elements]
  }

  if (!Array.isArray(events)) events = [events]

  for (const element of elements) {
    for (const event of events) {
      element[method](event, fn, {
        capture: false,
        ...options
      })
    }
  }

  return Array.prototype.slice.call(arguments, 1)
}

/**
 * Add event(s) to element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const on = eventListener.bind(null, 'addEventListener')

/**
 * Remove event(s) from element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const off = eventListener.bind(null, 'removeEventListener')

/**
 * Nicer event
 * @param {*} evt
 */
// export function simplifyEvent(evt) {
//   const tap = (evt.touches && evt.touches[0] || evt)
//   return {
//     tap,
//     x: tap.clientX,
//     y: tap.clientY,
//     target: tap.target
//   }
// }
