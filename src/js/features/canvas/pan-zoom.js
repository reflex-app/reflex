(function () {

    // Controls
    var panzoomControls = {
        container: $('#toolbar__canvas-controls'),
        scale: $("#canvas-controls__scale"),
        reset: $("#canvas-controls__reset"),
    }

    // Configuration
    var $panzoom = $('#artboards').panzoom({
        $reset: panzoomControls.reset,
        increment: 0.1,
        maxScale: 5
    }).panzoom('zoom', true);

    // ===============================
    // Mousewheel/Trackpad Zooming
    // ===============================

    if (!$panzoom.panzoom("isDisabled")) {
        // Allow mousewheel/trackpad zooming & dragging
        $panzoom.parent().on('mousewheel.focal', function (e) {
            e.preventDefault();
            var delta = e.delta || e.originalEvent.wheelDelta;
            var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
            $panzoom.panzoom('zoom', zoomOut, {
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
    $(document).on('keypress', $(panzoomControls.scale), function (e) {
        if (e.which == 13) {
            updateScale('fromInput');
        }
    });

    // Update the zoom percentage on zoom
    $panzoom.on('panzoomzoom', function (e, panzoom, scale, opts) {
        updateScale('fromCanvas');
    });

    // Update the zoom percentage on reset
    $(panzoomControls.reset).click(function() {
        updateScale('fromCanvas')
    });

    function updateScale(arg) {
        var input_val = bindings.scale.replace(/\D/g, '') + "%";
        var panzoom_val = Math.round($panzoom.panzoom("getMatrix")[0] * 4) / 4 * 100 + "%";
        console.log(arg, input_val, panzoom_val);

        if (arg != undefined ) {
            if (arg === "fromCanvas") {
                // Default: just update the scale's value
                $(panzoomControls.scale).val(panzoom_val);
            } else if (arg === "fromInput") {
                // Update the canvas based on the input
                // Also update the canvas' value
                var new_decimal = parseFloat(input_val) / 100;
                var new_decimal_asPercent = (new_decimal * 100) + "%";
                $panzoom.panzoom("zoom", new_decimal, {
                    // silent: true
                });
                input_val = bindings.scale.replace(/\D/g, '') + "%";
            }
        }

        // if (input_val != undefined && panzoom_val != undefined && input_val == panzoom_val) {
        //     // They match, just use Panzoom's value   
        //     $(panzoomControls.scale).val(panzoom_val);
        // } else {
        //     // Need to zoom in Panzoom...
        //     var new_decimal = parseFloat(input_val) / 100;
        //     var new_decimal_asPercent = (new_decimal * 100) + "%";

        //     // Only update panzoom if different from the current decimal
        //     if ( new_decimal_asPercent != panzoom_val) {
        //         $panzoom.panzoom("zoom", new_decimal, {
        //             silent: true
        //         });

        //         panzoom_val = Math.round($panzoom.panzoom("getMatrix")[0] * 4) / 4 * 100 + "%";
        //     }

        //     console.log(input_val, panzoom_val, new_decimal, new_decimal_asPercent);
        // }

    }

})();