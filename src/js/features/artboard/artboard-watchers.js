app.artboard.watchers = {
    init: function() {
        $(".button-new-artboard").on('click', function(e) {
            // function
            app.artboard.add("before", e);
        });
    },
}