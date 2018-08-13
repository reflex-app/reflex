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

        // Update webview src
        webview.attr("src", url_val);

        // Add loader
        // app.toolbar.isLoading(true, url_val);

        // Once they're loaded
        // webview.on("load", function () {
        //     app.toolbar.isLoading(false, url_val);
        //     // Unregister the load event of any previous webviews
        //     $(this).off("load");
        // });

        webview.on("loadstart", function () {
            app.toolbar.isLoading(true, url_val)
        });
        webview.on("loadstop", function () {
            app.toolbar.isLoading(false, url_val);
            // Unregister the load event of any previous webviews
            $(this).off("loadstart loadstop");

            // Setup the event listener on the child
            app.toolbar.handleWebviewChild();
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

    handleWebviewChild: function() {
        //  // Inject click handler
        //  var webview_js = document.querySelector('webview');
        //  webview_js.executeScript({
        //     //  mainWorld: true,
        //      code: 'document.querySelector("a").onclick = function() { window.parent.document.postMessage("Hello World!"); }'
        //  });

        //  window.addEventListener('message', function(e) {
        //     var message = e.data;
        //     console.log(message);
        //   });
    }

}