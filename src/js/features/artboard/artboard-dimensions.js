app.artboard.dimensions = {

    init: function () {
        this.firstLoad();
    },

    firstLoad: function () {
        app.artboard.dimensions.update(artboard)
    },

    // On resize =>
    update: function ($el, width, height) {

        if ( width || height ) {
            var height_container = $el.closest(artboard).find('.artboard__width');
                var width_container = $el.closest(artboard).find('.artboard__height');
    
                if (typeof width !== undefined) {
                    width = $el.closest(artboard).width();
                    width_container.html(width + "px");
                    console.log(width);
                }
    
                if (typeof height !== undefined) {
                    height = $el.closest(artboard).height();
                    height_container.html(height + "px");
                    console.log(height);
                }
        } else {
            $.each($el, function () {
                var height_container = $(this).closest(artboard).find('.artboard__width');
                var width_container = $(this).closest(artboard).find('.artboard__height');
    
                if (typeof width !== undefined) {
                    width = $(this).closest(artboard).width();
                    width_container.html(width + "px");
                    console.log(width);
                }
    
                if (typeof height !== undefined) {
                    height = $(this).closest(artboard).height();
                    height_container.html(height + "px");
                    console.log(height);
                }
    
                console.log($(this));
    
            });
        }

    }

}