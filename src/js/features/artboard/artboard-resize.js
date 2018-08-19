app.artboard.resize = {

    init: function () {
        // app.artboard.resize.firstLoad();
    },

    firstLoad: function () {},

    trigger: function (e) {
        if (app.events.isOnArtboard === true) {
            // Allow click events by disabling panzoom
            artboards.panzoom("disable");
            console.log("Panzoom Disabled?:" + artboards.panzoom("isDisabled"));

            // Allow resizing
            resizable();
        } else {
            // Disable click events, return to panzoom
            artboards.panzoom("enable");
            console.log("Panzoom Disabled?:" + artboards.panzoom("isDisabled"));
        }

        function resizable() {
            console.log('hit resizable');

            $el = $(".handle__bottom");
            artboard = $(".artboard");
            console.log(artboard);
            

            artboard.resizable({
                handleSelector: "> .handle__bottom",
                resizeWidthFrom: 'right',
                onDrag: function (e, $el, newWidth, newHeight) {
                    // Update dimensions
                    var parent_artboard = $el.closest(artboard);
                    console.log(parent_artboard);

                    // Disable pointer events on other elements
                    artboardInnerFrame.css("pointer-events", "none");
                    artboards.css("pointer-events", "none");
                    // Accept all events from parent
                    $el.css("pointer-events", "all");
                    $el.css("cursor", "nwse-resize");
                    // Override all other elements
                    $('body').css("cursor", "nwse-resize");

                    // Update the artboard's dimensions in the UI
                    app.artboard.dimensions.update(parent_artboard, newWidth, newHeight);
                },
                onDragEnd: function (e) {
                    // Disable pointer events on other elements
                    artboardInnerFrame.css("pointer-events", "");
                    artboards.css("pointer-events", "auto");
                    // Accept all events from parent
                    $el.css("pointer-events", "");
                    $el.css("cursor", "");
                    // Override all other elements
                    $('body').css("cursor", "");
                }
            });
        }
    }

}