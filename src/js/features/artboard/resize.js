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
            // Get the parent object
            var thisArtboard = $(e.target).closest(".artboard");

            // Allow click events by disabling panzoom
            artboards.panzoom("disable");
            console.log( artboards.panzoom("isDisabled") );

            // Turn on isOnArtboard
            isOnArtboard = true;

            e.stopImmediatePropagation();
            e.preventDefault();

            // thisArtboard.stopImmediatePropagation();
            artboards.panzoom("disable");
            resizable();

        } else {
            // Disable click events, return to panzoom
            isOnArtboard = false;
            artboards.panzoom("enable");
            console.log( artboards.panzoom("isDisabled") );
        }
    }

    function resizable() {
        $(".artboard").resizable({ 
            handleSelector: "> .handle__bottom",
            // the side that the width resizing is relative to
            resizeWidthFrom: 'right',
    
            onDragStart: function (e, $el, opt) {
                artboards.panzoom("disable");
                console.log( artboards.panzoom("isDisabled") );
            },
            onDragEnd: function (e, $el, opt) {
                artboards.panzoom("enable");
            }
        });
    }


})();