const $ = require('jquery');
const panzoom = require('../../plugins/jquery.panzoom');

export function setEventListeners(canvas) {
    if (!canvas.panzoom("isDisabled")) {

        // Window Resize Event
        $(window).on('resize', function () {
            clearTimeout(window.resizedFinished);
            window.resizedFinished = setTimeout(function () {
                // canvasMinSize.update();
                canvas.panzoom('resetDimensions');
                // if ( app.environment == "dev" ) { console.log(app.minScaleX, app.minScaleY, canvasMinSize.x, canvasMinSize.y); }
            }, 250);
        });

        // Update the zoom percentage on zoom
        canvas.on('panzoomzoom', function (e, panzoom, scale, opts) {
            updateScale('fromCanvas', canvas);
        });
    }
}

// ===============================
// Zoom Scale Percentage
// ===============================

let canvasControls = {
    container: $('#toolbar__canvas-controls'),
    scale: $("#canvas-controls__scale"),
    orientation: $("#canvas-controls__orientation"),
}

// Updates the UI with the current scale
export function updateScale(arg, canvas) {
    var input_val = $(canvasControls.scale).val().replace(/\D/g, '') + "%";
    var panzoom_val = Math.round(canvas.panzoom("getMatrix")[0] * 4) / 4 * 100 + "%";
    // if ( app.environment == "dev" ) { console.log(arg, input_val, panzoom_val); }

    if (arg != undefined) {
        if (arg === "fromCanvas") {
            // Default: just update the scale's value
            $(canvasControls.scale).html(panzoom_val);
        } else if (arg === "fromInput") {
            // Update the canvas based on the input
            // Also update the canvas' value
            var new_decimal = parseFloat(input_val) / 100;
            var new_decimal_asPercent = (new_decimal * 100) + "%";
            canvas.panzoom("zoom", new_decimal);
            input_val = scale.replace(/\D/g, '') + "%";
        }
    }
}

//////////////////////
//////////////////////

// Returns the current canvasMinSize
let canvasMinSize = {}

// export function updateCanvasMinSize() {
//     app.minScaleX = $(window).width() / artboards.innerWidth();
//     app.minScaleY = $(window).height() / artboards.innerHeight();
//     canvasMinSize.x = $(window).width() / artboards.innerWidth();
//     canvasMinSize.y = $(window).height() / artboards.innerHeight();
// }

// canvasMinSize.x = app.minScaleX;
// canvasMinSize.y = app.minScaleY;
// canvasMinSize.update = function () {
//     app.minScaleX = $(window).width() / artboards.innerWidth();
//     app.minScaleY = $(window).height() / artboards.innerHeight();
//     canvasMinSize.x = $(window).width() / artboards.innerWidth();
//     canvasMinSize.y = $(window).height() / artboards.innerHeight();
// };