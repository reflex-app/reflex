app.toolbar = {

    init: function () {
        this.firstLoad();
        app.toolbar.zoomControls.init();
        app.toolbar.recentURLs.init();
        app.toolbar.smartURL.init();
    },

    firstLoad: function () {
        // Bind the "Enter" key => load URL in artboardInnerFrame
        $("#toolbar__url").on('keypress', function (e) {
            if (e.which == 13) {
                e.preventDefault();

                // Try to turn the URL into a "smart" URL
                // This improves the UX when someone types in something like "localhost:8000"
                // it will automatically prepend "http://" for them or deal with invalid URLs
                var url = $("#toolbar__url").val();
                if (app.toolbar.smartURL.make(url) !== false) {
                    var result = app.toolbar.smartURL.make(url);
                    $("#toolbar__url").val(result);

                    // Save the URL to LocalStorage RecentURLs
                    app.toolbar.recentURLs.add(e);

                    // Now update the URL
                    app.toolbar.updateURL();
                } else {
                    // Error, not a valid 
                    alert(`${url} is not a valid URL`);
                }

            }
        });
    },

    updateURL: function () {
        var url_val = $("#toolbar__url").val();

        // Update the variable to latest DOM
        artboardInnerFrame = $("iframe");

        artboardInnerFrame.each(function () {
            // Update artboardInnerFrame src
            $(this).attr("src", url_val);

            // Show loading spinner
            app.toolbar.isLoading(true, url_val);

            // Site is loaded
            $(this).on("load", function () {
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
            if (app.environment == "dev") {
                console.log('Loading: ' + url);
            }
            loading_el.addClass('is-loading');
        } else if (condition === false) {
            if (app.environment == "dev") {
                console.log('Finished Loading: ' + url);
            }
            loading_el.removeClass('is-loading');
        }
    },

    handleartboardInnerFrameChild: function ($el) {
        // Run on trigger
        app.toolbar.injectartboardInnerFrameChildScript($el);

        // Listen for events
        window.addEventListener('message', function (e) {
            if (app.environment == "dev") {
                console.log("Returned message:" + e.data);
            }

            // Inject the script again
            app.toolbar.updateURL();
        });

        // Send a message to establish connection
        try {
            $el.contentWindow.postMessage('hi', '*');
            if (app.environment == "dev") {
                console.log("message sent to artboardInnerFrame");
            }
        } catch (e) {
            if (app.environment == "dev") {
                console.log('message to artboardInnerFrame failed');
            }
        }
    },

    injectartboardInnerFrameChildScript: function ($el) {
        // if (app.environment == "dev") {
        //     console.log('Link click script injected');
        // }

        // Inject a script into the artboardInnerFrame to track click events and propagate it to the parent
        // Make sure to run this function again after click (re-inject)
        // var injection_code = `
        // window.addEventListener('message', function (e) {
        //     document.querySelector("a").onclick = function (r) {
        //         e.source.postMessage("hello there", "*");
        //     }
        // })`;

        // $el.addContentScripts([{
        //     name: 'myRule',
        //     matches: ['*'],
        //     js: {
        //         files: ['']
        //     },
        //     run_at: 'document_start'
        // }]);

        // Inject click handler
        // $el.executeScript({
        //     code: injection_code
        // });
    }

}