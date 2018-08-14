app.artboard.dimensions = {

    init: function () {
        this.firstLoad();
    },

    firstLoad: function () {
        console.log('hi');
    },

    // On resize =>
    updateDimensions: function(element) {
        var height = $(element).height();
        var width = $(element).width();
        return {
            h: height,
            w: width 
        };
    }

}