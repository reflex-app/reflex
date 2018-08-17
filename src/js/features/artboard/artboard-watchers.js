app.artboard.watchers = {
    init: function() {
        canvas.on('click', '.button-new-artboard', function(e) {
            console.log(e.target);
            // Add artboard
            app.artboard.add("after", e);
            app.toolbar.updateURL();
        });

        // Let links be clickable
        canvas.find('a').on('mousedown touchstart', function (e) {
            e.stopImmediatePropagation();
        });
    },
}