app.toolbar = {

    init: function () {
        this.firstLoad();
    },

    firstLoad: function () {
        app.toolbar.recentURLs.init();

        // Bind the "Enter" key => load URL in artboardInnerFrame
        $("#toolbar__url").on('keypress', function (e) {
            if (e.which == 13) {
                e.preventDefault();
                app.toolbar.updateURL();
            }
        });
    },

    updateURL: function () {
        var url_val = $("#toolbar__url").val();

        // Update the variable to latest DOM
        artboardInnerFrame = $("iframe");

        artboardInnerFrame.each(function () {

            console.log($(this));

            // Update artboardInnerFrame src
            $(this).attr("src", url_val);

            // Show loading spinner
            $(this).on("loadstart", function () {
                app.toolbar.isLoading(true, url_val)
            });

            // Site is loaded
            $(this).on("loadstop", function () {
                // Hide loading spinner
                app.toolbar.isLoading(false, url_val);
                // Unregister the load event of any previous artboardInnerFrames
                $(this).off("loadstart loadstop");
                // Setup the event listener on the child
                app.toolbar.handleartboardInnerFrameChild($(this)[0]);
            });
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
    },

    handleartboardInnerFrameChild: function ($el) {
        // Run on trigger
        app.toolbar.injectartboardInnerFrameChildScript($el);

        // Listen for events
        window.addEventListener('message', function (e) {
            console.log("Returned message:" + e.data);
            // Inject the script again
            app.toolbar.updateURL();
        });

        // Send a message to establish connection
        try {
            $el.contentWindow.postMessage('hi', '*');
            console.log("message sent to artboardInnerFrame");
        } catch (e) {
            console.log('message to artboardInnerFrame failed');
        }
    },

    injectartboardInnerFrameChildScript: function ($el) {
        console.log('Link click script injected');

        // Inject a script into the artboardInnerFrame to track click events and propagate it to the parent
        // Make sure to run this function again after click (re-inject)
        var injection_code = `
        window.addEventListener('message', function (e) {
            document.querySelector("a").onclick = function (r) {
                e.source.postMessage("hello there", "*");
            }
        })`;

        // $el.addContentScripts([{
        //     name: 'myRule',
        //     matches: ['*'],
        //     js: {
        //         files: ['']
        //     },
        //     run_at: 'document_start'
        // }]);

        // Inject click handler
        $el.executeScript({
            code: injection_code
        });
    }

}