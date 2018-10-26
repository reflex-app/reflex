const $ = require('jquery')
const panzoom = require('../../plugins/jquery.panzoom')

export function rotate (canvas) {
  canvasControls.orientation.on('click', function () {
    artboards.toggleClass('is-vertical')
  })
}
