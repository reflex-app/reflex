// Controls mouse and trackpad-based scrolling and zooming events
// Inspired by: https://medium.com/@auchenberg/detecting-multi-touch-trackpad-gestures-in-javascript-a2505babb10e

// Detecting mouse wheel event
// via: https://stackoverflow.com/questions/8886281/event-wheeldelta-returns-undefined
$.fn.wheel = function (callback) {
    return this.each(function () {
        $(this).on('wheel', function (e) {
            e.delta = null;
            if (e.originalEvent) {
                if (e.originalEvent.wheelDelta) e.delta = e.originalEvent.wheelDelta / -40;
                if (e.originalEvent.deltaY) e.delta = e.originalEvent.deltaY;
                if (e.originalEvent.detail) e.delta = e.originalEvent.detail;
            }

            if (typeof callback == 'function') {
                callback.call(this, e);
            }
        });
    });
};

// Target element
var outerCanvas = $("#canvas");

// Detect mouse wheel vs. trackpad pinches
// Then either scroll or zoom
// Adds event only if Panzoom is enabled
if (!canvas.panzoom("isDisabled")) {
    outerCanvas.wheel(function (e) {
        // Prevent default zoom event
        // With trackpads, this prevents accidental pinch zooming
        e.preventDefault();

        var wheel = {
            delta: e.originalEvent.wheelDelta,
            deltaX: e.originalEvent.deltaX,
            deltaY: e.originalEvent.deltaY
        }

        // If pinch-to-zoom
        if (e.ctrlKey) {
            e.preventDefault();

            canvas.panzoom('zoom', e.originalEvent.wheelDelta < 0, {
                animate: false,
                increment: 0.06,
                focal: e
            });

        } else {
            // Otherwise, just pan the canvas
            // Touch/trackpad device
            // Pan y based on the zoom direction
            artboards.panzoom('pan', wheel.deltaX * -2, wheel.deltaY * -2, {
                relative: true,
                animate: false
            });
        }

        // Event logging
        console.log(wheel, e.ctrlKey);
    });
}