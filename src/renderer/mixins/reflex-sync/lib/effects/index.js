const eventTypes = require("../eventTypes")

/**
 * 
 * @param {*} ctx DOM context
 * @param {*} event Event data
 * @param {*} args Options and details
 */
function setDOMEffect(event, args) {
    console.log('setting DOM effect', event, args);

    if (args.eventType === eventTypes['SCROLL']) {
        // console.log('reached handler!');
        // console.log(document);
        // const targetEl = window.scrollY
        // targetEl.scrollTop = args.scrollOffset.top
        // console.log(targetEl);
        window.scrollTo(0, args.scrollOffset.top)
        

        // Set the Webview's scroll position, based on the incoming amount
        // const targetElement = ctx.querySelector('body')
        // console.log(ctx);

        // targetElement.scrollTop = args.scrollOffset.top
        // targetElement.scrollLeft = args.scrollOffset.left

        // console.log(targetElement.scrollTop);
        // console.log(targetElement.scrollLeft);
    }
}

module.exports = setDOMEffect