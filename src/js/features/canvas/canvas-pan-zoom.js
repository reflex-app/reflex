// Returns the current canvasMinSize
var canvasMinSize = {}
canvasMinSize.x = app.minScaleX;
canvasMinSize.y = app.minScaleY;
canvasMinSize.update = function () {
    app.minScaleX = $(window).width() / artboards.innerWidth();
    app.minScaleY = $(window).height() / artboards.innerHeight();
    canvasMinSize.x = $(window).width() / artboards.innerWidth();
    canvasMinSize.y = $(window).height() / artboards.innerHeight();
};

// Window Resize Event
$(window).on('resize', function () {
    clearTimeout(window.resizedFinished);
    window.resizedFinished = setTimeout(function () {
        canvasMinSize.update();
        canvas.panzoom('resetDimensions');
        // console.log(app.minScaleX, app.minScaleY, canvasMinSize.x, canvasMinSize.y);
    }, 250);
});

// Fit contents to screen width/height
$("#canvas-controls__fit-to-screen").on('click', function () {
    canvasMinSize.update();
    canvas.panzoom("setTransform", 'scale(' + Math.min(canvasMinSize.x, canvasMinSize.y) + ')');
    updateScale("fromCanvas")
    console.log(app.minScaleX, app.minScaleY, "scale:", canvasMinSize.x, canvasMinSize.y);
});

// ===============================
// Mousewheel/Trackpad Zooming
// ===============================

if (!canvas.panzoom("isDisabled")) {
    // Update the zoom percentage on zoom
    canvas.on('panzoomzoom', function (e, panzoom, scale, opts) {
        updateScale('fromCanvas');
    });
}

// ===============================
// Zoom Scale Percentage
// ===============================

// Create data-binding objects
var data = {
    scale: '100%'
}
var bindings = $.bindings(data);

// Update zoom percentage on load
// @TODO: Add to init
updateScale('fromCanvas');

// Watch the input for changes
$(canvasControls.scale).on('keypress', function (e) {
    if (e.which == 13) {
        updateScale('fromInput');
    }
});

function updateScale(arg) {
    var input_val = bindings.scale.replace(/\D/g, '') + "%";
    var panzoom_val = Math.round(canvas.panzoom("getMatrix")[0] * 4) / 4 * 100 + "%";
    // console.log(arg, input_val, panzoom_val);

    if (arg != undefined) {
        if (arg === "fromCanvas") {
            // Default: just update the scale's value
            $(canvasControls.scale).html(panzoom_val);
        } else if (arg === "fromInput") {
            // Update the canvas based on the input
            // Also update the canvas' value
            var new_decimal = parseFloat(input_val) / 100;
            var new_decimal_asPercent = (new_decimal * 100) + "%";
            canvas.panzoom("zoom", new_decimal, {
                // silent: true
            });
            input_val = bindings.scale.replace(/\D/g, '') + "%";
        }
    } else {

    }
}