// @TODO:Refactor these global variables
var $recent_url_container = $("#toolbar__recentURLs");
var recentURLs = JSON.parse(localStorage.getItem('recentURLs')) || [];

var liSelected;
var isSelecting = false;

app.toolbar.recentURLs = {

    init: function () {
        this.firstLoad();
    },

    firstLoad: function () {
        // Add the current URL
        app.toolbar.recentURLs.show();

        // Listen for clicks on the dropdown items
        // Note, these will be cached
        $(document).on('click', '.toolbar__url-li', function (e) {
            if (app.environment == "dev") {
                console.log($(e.target), $(e.target).text());
            }

            // Set the value based on the clicked target
            $("#toolbar__url").val($(e.target).text());

            // Update the URL in the iframes
            app.toolbar.updateURL();
        });

        // When clicking the search, show recent sites
        $("#toolbar__url").on('click blur', function (e) {
            if (e.type == "click") {
                $recent_url_container.addClass('is-visible');
            } else if (e.type == "blur") {
                setTimeout(() => {
                    isSelecting = false;
                    $recent_url_container.removeClass('is-visible');
                }, 100);
            }
        });

        // Keyboard select recent URLs
        // $("#toolbar__url").on('keydown', function (e) {
        //     app.toolbar.recentURLs.keyboardSelect(e);
        // });
    },

    show: function (e) {
        if (localStorage["recentURLs"] !== undefined) {
            var urls_to_object = JSON.parse(localStorage.getItem('recentURLs'));
            $recent_url_container.html(Hbs.templates.recentURLs(urls_to_object.reverse()));
        }
    },

    add: function (e) {
        var inputURL;

        // Return the value from the input
        if (e == undefined) {
            inputURL = $("#toolbar__url").val();
        } else {
            inputURL = $(e.target).val();
        }

        // Debug the input
        // if (app.environment == "dev") { console.log(inputURL); }

        // Add to existing
        if (recentURLs.length >= 1) {
            recentURLs.push(inputURL);

            // Make sure there's only 7 recent items
            // Remove the oldest items
            if (recentURLs.length > 7) {
                recentURLs.shift();
            }

            localStorage.setItem('recentURLs', JSON.stringify(recentURLs));

            // Output to Handlebars
            app.toolbar.recentURLs.show();

        } else if (recentURLs.length < 1 || recentURLs == null) {
            recentURLs.push(inputURL);
            localStorage.setItem('recentURLs', JSON.stringify(recentURLs));

            // Output to Handlebars
            app.toolbar.recentURLs.show();
        }

        // Add to LocalStorage
        if (app.environment == "dev") {
            console.log('localStorage: Updated recent URLs: ' + JSON.parse(localStorage.getItem('recentURLs')));
        }
    },

    keyboardSelect: function (e) {
        // var li = $recent_url_container.find('li');

        // if (e.which === 40) {
        //     isSelecting = true;
        //     if (liSelected) {
        //         liSelected.removeClass('is-keyboard-selected');
        //         next = liSelected.next();
        //         if (next.length > 0) {
        //             liSelected = next.addClass('is-keyboard-selected');
        //         } else {
        //             liSelected = li.eq(0).addClass('is-keyboard-selected');
        //         }
        //     } else {
        //         liSelected = li.eq(0).addClass('is-keyboard-selected');
        //     }
        // } else if (e.which === 38) {
        //     isSelecting = true;
        //     if (liSelected) {
        //         liSelected.removeClass('is-keyboard-selected');
        //         next = liSelected.prev();
        //         if (next.length > 0) {
        //             liSelected = next.addClass('is-keyboard-selected');
        //         } else {
        //             liSelected = li.last().addClass('is-keyboard-selected');
        //         }
        //     } else {
        //         liSelected = li.last().addClass('is-keyboard-selected');
        //     }
        // } else {
        //     isSelecting = false;
        // }

        // // Check if enter
        // if (e.which === 13 && isSelecting == true) {
        //     $("#toolbar__url").val( $(e.target).text() );
        //     app.toolbar.updateURL();
        //     console.log('cool beans');
        // }

    }

}