app.artboard.resize = {

    init: function () {
        this.firstLoad();
    },

    firstLoad: function () {
        artboard.on({
            mouseenter: function () {
                app.events.isOnArtboard = true;
            },
            mouseleave: function () {
                app.events.isOnArtboard = false;
            }
        });
    },

    start: function () {},
    stop: function () {}

}


    $("webview a").on('mousedown touchstart', function (e) {
        e.stopImmediatePropagation();
    });

    function artboardEvents(e) {
        if (app.events.isOnArtboard === false) {
            // Get the parent object
            var thisArtboard = $(e.target).closest(".artboard");

            // Allow click events by disabling panzoom
            artboards.panzoom("disable");
            console.log(artboards.panzoom("isDisabled"));

            // Turn on isOnArtboard
            app.events.isOnArtboard = true;

            resizable();

        } else {
            // Disable click events, return to panzoom
            app.events.isOnArtboard = false;
            artboards.panzoom("enable");
            console.log(artboards.panzoom("isDisabled"));
        }
    }

    function resizable() {
        $el = $(".handle__bottom")
        $(".artboard").resizable({
            handleSelector: "> .handle__bottom",
            resizeWidthFrom: 'right',
            onDragStart: function (e) {
                artboards.panzoom("disable");
                console.log(artboards.panzoom("isDisabled"));
                app.events.isResizingArtboard = true;
            },
            onDragEnd: function (e) {
                artboards.panzoom("enable");
            },
            resize: function (event, ui) {
                ui.size.width += ui.size.width - ui.originalSize.width;
            }
        });
    }