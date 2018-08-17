app.artboard.watchers = {
    init: function() {
        canvas.on('click', '.button-new-artboard', function(e) {
            console.log(e.target);
            // Add artboard
            app.artboard.add("after", e);
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