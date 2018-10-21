const $ = require('jquery');
const panzoom = require('../../plugins/jquery.panzoom');

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

// Window Resize Event
$(window).on('resize', function () {
    clearTimeout(window.resizedFinished);
    window.resizedFinished = setTimeout(function () {
        // canvasMinSize.update();
        canvas.panzoom('resetDimensions');
        // if ( app.environment == "dev" ) { console.log(app.minScaleX, app.minScaleY, canvasMinSize.x, canvasMinSize.y); }
    }, 250);
});


export function fitToScreen() {
    // Fit contents to screen width/height
    $("#canvas-controls__fit-to-screen").on('click', function () {
        // canvasMinSize.update();
        canvas.panzoom("setTransform", 'scale(' + Math.min(canvasMinSize.x, canvasMinSize.y) + ')');
        updateScale("fromCanvas");

        // if (app.environment == "dev") {
        //     console.log(app.minScaleX, app.minScaleY, "scale:", canvasMinSize.x, canvasMinSize.y);
        // }
    });
}

// ===============================
// Mousewheel/Trackpad Zooming
// ===============================

// if (!canvas.panzoom("isDisabled")) {
//     // Update the zoom percentage on zoom
//     canvas.on('panzoomzoom', function (e, panzoom, scale, opts) {
//         updateScale('fromCanvas');
//     });
// }

// ===============================
// Zoom Scale Percentage
// ===============================

// Updates the UI with the current scale
export function updateScale(arg) {
    var input_val = scale.replace(/\D/g, '') + "%";
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