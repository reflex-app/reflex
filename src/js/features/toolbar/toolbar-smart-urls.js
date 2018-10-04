app.toolbar.smartURL = {
    init: function () {},

    // Makes a smart URL
    // Returns a new URL or false if there was an issue
    make: function (url) {
        if (typeof url !== 'string') {
            throw new TypeError(`Expected \`url\` to be of type \`string\`, got \`${typeof url}\``);
        }

        let hasHttpPrefix = false;
        let hasDot = false;
        let hasLocalhost = false;
        let failed = false;

        url = url.toLowerCase();

        // Step 1: Does it have http:// or https:// ?
        // The "?" in the Regex accepts http or https
        if (new RegExp(/https?/).test(url) == true) {
            hasHttpPrefix = true;
        }

        // Step 2: Does it have .* (i.e. ".com") ?
        if (url.includes('.') == true) {
            hasDot = true;
        }

        // Step 3: Does it include "localhost"?
        if (url.includes('localhost') == true) {
            hasLocalhost = true;
        }

        // Handle localhost URLs
        if (hasLocalhost) {
            if (hasHttpPrefix) {
                // Example: http://localhost:8000
                return url;
            } else {
                url = "http://" + url;
                return url;
            }
        }
        // Handle non-localhost URLs
        if (hasHttpPrefix && hasDot) {
            // Perfect format:
            // http[s]://example.com
            return url;
        } else if (hasHttpPrefix == false && hasDot == true) {
            // Case: example.com
            // Check if URL starts with anything besides a letter or digit
            if (new RegExp(/^[0-9a-z]/).test(url) == false) {
                return false;
            } else {
                // The URL can be prepended by http:// 
                url = "http://" + url;
                return url;
            }
        } else {
            // Empty string or unknown error
            // Example: alert(url + " is not a valid URL.");
            return false;
        }
    }
}