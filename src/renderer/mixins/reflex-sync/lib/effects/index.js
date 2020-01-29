const eventTypes = require("../eventTypes")
const scrollHandler = require("./scroll")

/**
 * 
 * @param {*} ctx DOM context
 * @param {*} event Event data
 * @param {*} args Options and details
 */
function setDOMEffect(event, args) {
    console.log('Setting DOM effect', event, args);

    // if (args.eventType === eventTypes['CLICK']) {
    //     clickHandler()
    // }

    if (args.eventType === eventTypes['SCROLL']) {
        scrollHandler(args.scrollOffset.left, args.scrollOffset.top)
    }
}

module.exports = setDOMEffect