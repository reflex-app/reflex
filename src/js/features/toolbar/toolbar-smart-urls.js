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

        // Logic
        if (hasHttpPrefix && hasDot || hasLocalhost) {
            // Perfect format:
            // http[s]://example.com
        } else if (hasHttpPrefix == false && hasDot == true && hasLocalhost == false) {
            // Case: example.com
            // Check if URL starts with anything besides a letter or digit
            if (new RegExp(/^[0-9a-z]/).test(url) == false) {
                failed = true;
            } else {
                // The URL can be prepended by http:// 
                url = "http://" + url;
            }
        } else if (hasHttpPrefix == true && hasDot == false && hasLocalhost == false) {
            // no pass, there's no ".com" or similar ending
            failed = true;
        } else {
            // Empty string or unknown error
            failed = true;
        }

        // Fail cases where there's no http/http and no top-level domain
        if (hasHttpPrefix == false && hasDot == false && hasLocalhost == false) {
            failed = true;
        }

        // Add handler below
        if (failed === true) {
            // Handle errors here
            // Example: alert(url + " is not a valid URL.");
            return false;
        } else {
            return url;
        }
    }
}