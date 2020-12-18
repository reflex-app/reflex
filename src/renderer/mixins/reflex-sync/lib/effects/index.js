const eventTypes = require('../eventTypes')
const scrollHandler = require('./scroll')
const clickHandler = require('./click')

/**
 *
 * @param {*} ctx DOM context
 * @param {*} event Event data
 * @param {*} args Options and details
 */
function setDOMEffect(event, args) {
  console.log('Setting DOM effect', event, args)

  if (args.event.type === eventTypes.CLICK) {
    clickHandler(args.event)
  }

  if (args.event.type === eventTypes.SCROLL) {
    console.log(args.origin)
    scrollHandler(
      args.origin,
      args.origin.scrollOffset.x,
      args.origin.scrollOffset.y
    )
  }
}

module.exports = setDOMEffect
