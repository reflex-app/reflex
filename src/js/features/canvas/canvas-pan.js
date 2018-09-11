// var outerCanvas = $("main").panzoom({
//     maxScale: 1,
//     minScale: 1,
//     startTransform: 'scale(' + Math.min(app.minScaleX, app.minScaleY) + ')'
// }).panzoom('zoom', true);

// via 
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

var outerCanvas = $("#canvas");

outerCanvas.wheel(function (e) {
    console.log('event: wheel', e);

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
        var zoomOut = wheel.delta ? wheel.delta < 0 : wheel.deltaY > 0;
        canvas.panzoom('zoom', zoomOut, {
            animate: false,
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


// // via: https://medium.com/@auchenberg/detecting-multi-touch-trackpad-gestures-in-javascript-a2505babb10e

// var artboards;
// var rotation = 0;
// var gestureStartRotation = 0;
// var gestureStartScale = 0;
// var scale = 1;
// var posX = 0;
// var posY = 0;
// var startX;
// var startY;

// var render = () => {

//   window.requestAnimationFrame(() => {
//     var val = `translate3D(${posX}px, ${posY}px, 0px) rotate(${rotation}deg) scale(${scale})`
//     artboards.style.transform = val
//   })

// }

// window.addEventListener('wheel', (e) => {
//   e.preventDefault();

//   if (e.ctrlKey) {
//     scale -= e.deltaY * 0.01;
//   } else {
//     posX -= e.deltaX * 2;
//     posY -= e.deltaY * 2;
//   }

//   render();
// });


// window.addEventListener("gesturestart", function (e) {
//   e.preventDefault();
//   startX = e.pageX - posX;
//   startY = e.pageY - posY;
//   gestureStartRotation = rotation;
//   gestureStartScale = scale;
// });

// window.addEventListener("gesturechange", function (e) {
//   e.preventDefault();

//   rotation = gestureStartRotation + e.rotation;
//   scale = gestureStartScale * e.scale;

//   posX = e.pageX - startX;
//   posY = e.pageY - startY;

//   render();

// })

// window.addEventListener("gestureend", function (e) {
//   e.preventDefault();
// });