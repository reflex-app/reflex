// Updates the canvasMinSize
function update_canvasMinSize() {
    app.minScaleX = $(window).width() / artboards.innerWidth();
    app.minScaleY = $(window).height() / artboards.innerHeight();
}

// Returns the current canvasMinSize
var get_canvasMinSize = function () {
    return {
        x: app.minScaleX,
        y: app.minScaleY
    }
}();

// Window Resize Event
$(window).on('resize', function () {
    update_canvasMinSize();
    console.log(app.minScaleX, app.minScaleY, get_canvasMinSize);
});

// Fit contents to screen width/height
$("#canvas-controls__fit-to-screen").on('click', function () {
    canvas.panzoom("setTransform", 'scale(' + Math.min(get_canvasMinSize.x, get_canvasMinSize.y) + ')');
    updateScale("fromCanvas")
    console.log(app.minScaleX, app.minScaleY, "scale:", get_canvasMinSize, ";");
});

// (function () {

    // ===============================
    // Mousewheel/Trackpad Zooming
    // ===============================

    if (!canvas.panzoom("isDisabled")) {
        // Allow mousewheel/trackpad zooming & dragging
        canvas.parent().on('mousewheel.focal', function (e) {
            e.preventDefault();
            var delta = e.delta || e.originalEvent.wheelDelta;
            var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
            canvas.panzoom('zoom', zoomOut, {
                animate: false,
                focal: e
            });
        });
    }

    // ===============================
    // Zoom Scale Percentage
    // ===============================

    // Update zoom percentage on load
    // TODO: attach to init


    // Create data-binding objects
    var data = {
        scale: '100%'
    }
    var bindings = $.bindings(data);

    updateScale('fromCanvas');

    // Watch the input for changes
    $(canvasControls.scale).on('keypress', function (e) {
        if (e.which == 13) {
            updateScale('fromInput');
        }
    });

    // Update the zoom percentage on zoom
    canvas.on('panzoomzoom', function (e, panzoom, scale, opts) {
        updateScale('fromCanvas');
    });

    function updateScale(arg) {
        var input_val = bindings.scale.replace(/\D/g, '') + "%";
        var panzoom_val = Math.round(canvas.panzoom("getMatrix")[0] * 4) / 4 * 100 + "%";
        console.log(arg, input_val, panzoom_val);

        if (arg != undefined) {
            if (arg === "fromCanvas") {
                // Default: just update the scale's value
                $(canvasControls.scale).val(panzoom_val);
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

// })();