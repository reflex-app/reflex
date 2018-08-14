app.artboard.resize = {

    init: function () {
        this.firstLoad();
    },

    firstLoad: function () {
        artboard.on({
            mouseenter: function (e) {
                app.events.isOnArtboard = true;
                artboardEvents(e);
            },
            mouseleave: function (e) {
                app.events.isOnArtboard = false;
                artboardEvents(e);
            }
        });

        $("webview a").on('mousedown touchstart', function (e) {
            e.stopImmediatePropagation();
        });

        function artboardEvents(e) {
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
        }

        function resizable() {
            console.log('hit resizable');
            
            $el = $(".handle__bottom")
            artboard.resizable({
                handleSelector: "> .handle__bottom",
                resizeWidthFrom: 'right',
                onDrag: function(e, $el, newWidth, newHeight) {
                    // Update dimensions
                    var parent_artboard = $el.closest( $(artboard) );
                    console.log(parent_artboard);
                    
                    app.artboard.dimensions.update(parent_artboard, newWidth, newHeight);
                },
                resize: function (event, ui) {
                    ui.size.width += ui.size.width - ui.originalSize.width;
                }
            });
        }
    }

}