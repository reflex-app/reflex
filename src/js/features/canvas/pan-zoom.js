(function () {

    // Controls
    var $panzoomControls = $('#toolbar__canvas-controls');

    // Configuration
    var $panzoom = $('#artboards').panzoom({
        $zoomRange: $panzoomControls.find(".zoom-range"),
        $reset: $panzoomControls.find(".reset"),
        increment: 0.1
    }).panzoom('zoom', true);

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

})();