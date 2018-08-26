var $recent_url_container = $("#toolbar__recentURLs");
var recentURLs = JSON.parse(localStorage.getItem('recentURLs')) || [];
console.log("recentURLs: " + recentURLs);

app.toolbar.recentURLs = {

    init: function () {
        this.firstLoad();
    },

    firstLoad: function () {
        app.toolbar.recentURLs.add();

        // Add to LocalStorage on submit
        $("#toolbar__url").on('submit keypress', function (e) {
            // On enter key press
            if (e.which == 13) {
                app.toolbar.recentURLs.add(e);
            } else if ( e.type == "submit" ) {
                app.toolbar.recentURLs.add(e);
            }
        });

        // When clicking the search, show recent sites
        $("#toolbar__url").on('click blur', function (e) {
            if (e.type == "click") {
                $recent_url_container.addClass('is-visible');
            } else if (e.type == "blur") {
                $recent_url_container.removeClass('is-visible');
            }
        });
    },

    add: function (e) {
        var inputURL;

        // Return the value from the input
        if (e == undefined) {
            inputURL = $("#toolbar__url").val();
        } else {
            inputURL = $(e.target).val();
        }

        console.log(inputURL);

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
            outputHandlebars();

        } else if (recentURLs.length < 1 || recentURLs == null) {
            recentURLs.push(inputURL);
            localStorage.setItem('recentURLs', JSON.stringify(recentURLs));

            // Output to Handlebars
            outputHandlebars();
        }

        // Update HTML w/ Handlebars
        function outputHandlebars() {
            var urls_to_object = JSON.parse(localStorage.getItem('recentURLs'));
            $recent_url_container.html(Hbs.templates.recentURLs(urls_to_object.reverse()));
        }

        // Add to LocalStorage
        console.log('Added to localstorage: ' + JSON.parse(localStorage.getItem('recentURLs')));
    }

}