screens.toolbar = {

    init: function () {
        this.firstLoad();
    },

    firstLoad: function () {
        // Bind the "Enter" key => load URL in iFrame
        $("#toolbar__url").on('keypress', function (e) {
            if (e.which == 13) {
                e.preventDefault();
                screens.toolbar.updateURL();
            }
        });
    },

    updateURL: function () {
        var url_val = $("#toolbar__url").val();
        var iframe = $("iframe");

        // Update iframe src
        iframe.attr("src", url_val);

        // Add loader
        screens.toolbar.isLoading(true, url_val);

        // Once they're loaded
        iframe.on("load", function () {
            screens.toolbar.isLoading(false, url_val);
            // Unregister the load event of any previous iFrames
            $(this).off("load");
        });
    },

    isLoading: function (condition, url) {
        var loading_el = $(".artboard__loader");

        if (condition === true) {
            console.log('Loading: ' + url);
            loading_el.addClass('is-loading');
        } else if (condition === false) {
            console.log('Finished Loading: ' + url);
            loading_el.removeClass('is-loading');
        } else {
            // No action
        }
    }

}