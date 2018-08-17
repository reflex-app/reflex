app.artboard.watchers = {
    init: function () {
        canvas.on('click', '.button-artboard-before, .button-artboard-after', function (e) {
            var $target = $(e.target);

            // Add a new artboard before or after
            if ($target.is("div.button-artboard-before")) {
                app.artboard.add("before", e);
            } else if ($target.is("div.button-artboard-after")) {
            app.artboard.add("after", e);
            }

            // Update the URL in all frames
            app.toolbar.updateURL();
        });

        // Artboard 
        // artboard.on({
        //     mouseenter: function (e) {
        //         app.events.isOnArtboard = true;
        //         artboardEvents(e);
        //     },
        //     mouseleave: function (e) {
        //         app.events.isOnArtboard = false;
        //         artboardEvents(e);
        //     }
        // });

        // Let links be clickable
        canvas.find('a').on('mousedown touchstart', function (e) {
            e.stopImmediatePropagation();
        });
    },
}