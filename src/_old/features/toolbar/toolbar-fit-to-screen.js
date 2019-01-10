import { updateScale } from '../canvas/canvas-size'

export function fitToScreen (canvas) {
  // Fit contents to screen width/height
  $('#canvas-controls__fit-to-screen').on('click', function () {
    // canvasMinSize.update();
    canvas.panzoom('setTransform', 'scale(' + Math.min(canvasMinSize.x, canvasMinSize.y) + ')')
    updateScale('fromCanvas')

    // if (app.environment == "dev") {
    //     console.log(app.minScaleX, app.minScaleY, "scale:", canvasMinSize.x, canvasMinSize.y);
    // }
  })
}
