app.artboard = {

    init: function () {
        // Dimensions
        app.artboard.dimensions.init();
        // Resizable artboard
        app.artboard.resize.init();
        // Add artboards
        app.artboard.watchers.init();

        // Any functions that need to fire on first load
        // Defined below
        app.artboard.firstLoad();
    },

    firstLoad: function() {
        app.artboard.createFirstNewButton();
    }

}