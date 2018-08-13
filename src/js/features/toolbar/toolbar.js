app.toolbar = {

    init: function () {
        this.firstLoad();
    },

    firstLoad: function () {
        // Bind the "Enter" key => load URL in webview
        $("#toolbar__url").on('keypress', function (e) {
            if (e.which == 13) {
                e.preventDefault();
                app.toolbar.updateURL();
            }
        });
    },

    updateURL: function () {
        var url_val = $("#toolbar__url").val();
        var webview = $("webview");

        if ( nw ) { 
            webview.each(function () {
                // Update webview src
                $(this).attr("src", url_val);
    
                // Show loading spinner
                $(this).on("loadstart", function () {
                    app.toolbar.isLoading(true, url_val)
                });
    
                // Site is loaded
                $(this).on("loadstop", function () {
                    // Hide loading spinner
                    app.toolbar.isLoading(false, url_val);
                    // Unregister the load event of any previous webviews
                    $(this).off("loadstart loadstop");
                    // Setup the event listener on the child
                    app.toolbar.handleWebviewChild($(this)[0]);
                });
            });
        } else {

        }
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

    handleWebviewChild: function ($el) {

        // Listen for events
        window.addEventListener('message', function (e) {
            console.log("Returned message:" + e.data );
        });

        // Send a message to establish connection
        try {
            $el.contentWindow.postMessage('hi', '*');
            console.log("message sent to webview");
        } catch(e) {
            console.log('message to webview failed');
        }

        // Run on trigger
        app.toolbar.injectWebviewChildScript($el);

        // a link was clicked, and a new page loaded...
        // inject the link clicking tracker again
        var all_webviews = document.querySelector('webview');
        window.addEventListener('webviewLinkClicked', app.toolbar.injectWebviewChildScript(all_webviews));
    },

    injectWebviewChildScript: function ($el) {
        console.log('Injected');

        // Inject a script into the webview to track click events and propagate it to the parent
        // Make sure to run this function again after click (re-inject)
        var injection_code = `
        window.addEventListener('message', function (e) {
            e.source.postMessage("hello there", "*");

            document.querySelector("a").onclick = function (r) {
                e.source.postMessage(r, "*");
            }
        })

        window.onbeforeunload = function () {
            parent.postMessage("hello there", "*");
            document.body.style.backgroundColor = "green";
        }`;

        // document.querySelector("a").onclick = function () {
        //     window.parent.window.parent.document.trigger('webviewLinkClicked');
        //     document.body.style.backgroundColor = "pink";
        // }

        // Inject click handler
        $el.executeScript({
            code: injection_code
        });
    }

}