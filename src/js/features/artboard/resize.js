(function () {

    var artboard = $(".artboard");
    var artboards = $("#artboards");
    var resize_handle__right = $(".handle__right");
    var resize_handle__bottom = $(".handle__bottom");

    var isOnArtboard = false;

    artboard.on({
        mouseenter: artboardEvents,
        mouseleave: artboardEvents
    });

    function artboardEvents(e) {
        if (isOnArtboard === false) {

            // Allow click events
            console.log('active');

            isOnArtboard = true;
            artboards.panzoom("disable");
            console.log( artboards.panzoom("isDisabled") );

            e.stopImmediatePropagation();

            $(e.target).on('hover', function() {
                e.stopImmediatePropagation();
            });

        } else {
            // Disable click events, return to panzoom
            isOnArtboard = false;
            artboards.panzoom("enable");

            console.log( artboards.panzoom("isDisabled") );
            console.log('inactive');
        }
    }

})();