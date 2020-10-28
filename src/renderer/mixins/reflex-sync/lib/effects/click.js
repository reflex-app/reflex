function click(event) {
  console.log('click event')

  // event.target.{element, index}
  // Query all the DOM elements with the same tag name
  const elems = document.querySelectorAll(event.target.elementTagName)

  // See if any of the DOM elements match
  const match = elems[event.target.index]

  if (match) {
    if (document.createEvent) {
      window.setTimeout(function () {
        const evObj = document.createEvent('MouseEvents')
        evObj.initEvent('click', true, true)
        match.dispatchEvent(evObj)
      }, 0)
    } else {
      window.setTimeout(function () {
        if (document.createEventObject) {
          const evObj = document.createEventObject()
          evObj.cancelBubble = true
          match.fireEvent('on' + 'click', evObj)
        }
      }, 0)
    }
  } else {
    throw new Error('No elements found based on event')
  }
}

module.exports = click
