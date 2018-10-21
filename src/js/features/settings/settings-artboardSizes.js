// @TODO: This should probably live in a `data` directory

const $ = require('jquery');

// 1. check/read localstorage
// when you open it
// 2. add/update localstorage
// when you change a size

export function artboardSizes(app) {
    let localStorageKey = "artboardSizes";
    let localStorageObject = [];

    // Initial check if there's existing data
    // If so, show it
    // If not, create some
    readLocalStorage();

    /**
     * Read the localStorage
     * If nothing exists, create the key with the current artboard sizes
     */
    function readLocalStorage() {
        // Return the localStorage
        if (localStorage[localStorageKey] == null || !localStorage[localStorageKey]) {
            // Nothing is defined!
            if (app.environment == "dev") {
                console.log('localStorage: No Artboard sizes exist');
            }
            createLocalStorage();
        } else {
            // It's defined!
            // Use the saved sizes
            if (app.environment == "dev") {
                console.log('localStorage: Artboard sizes exists');
            }
            restorePreviousFromLocalStorage();
        }
    }

    // Update our local variable
    function updateLocalStorageObject() {
        if (localStorage.getItem(localStorageKey)) {
            localStorageObject = JSON.parse(localStorage.getItem(localStorageKey));
            return localStorageObject;
        } else {
            if (app.environment == "dev") {
                console.log('No local storage exists')
            }
        }
    }

    /**
     * Initializes the localStorage definition
     */
    function createLocalStorage() {
        // No localStorage exists!
        // Lets setup an object with the current artboard sizes
        localStorageObject.push(app.artboard.dimensions.return());

        // Now create a new key and save to it
        localStorage.setItem(localStorageKey, JSON.stringify(localStorageObject));

        // Update our local variable
        updateLocalStorageObject();

        // Add to LocalStorage
        if (app.environment == "dev") {
            console.log('Added to localstorage: ', updateLocalStorageObject());
        }
    }

    /**
     * Restores the artboard sizes from the existing localStorage data
     */
    function restorePreviousFromLocalStorage() {
        // Update our local variable
        updateLocalStorageObject();

        // Remove the initial frames, and load the old ones
        $(artboards).empty();

        // Now create the artboards from the last save state
        var object = localStorageObject[0];

        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                var instance = object[key];
                app.artboard.add("after", null, instance.width, instance.height, "fromEmpty");
                // Testing
                // if ( app.environment == "dev" ) { console.log(key, instance); }
            }
        }
    }

    /**
     * Updates the existing localStorage definition with the sizes of the current artboards
     */
    function updateLocalStorage() {
        // Add to existing
        if (localStorageObject.length >= 1 && localStorageObject.length !== null) {
            // localStorage key exists!
            // Clear the existing object
            localStorageObject = [];

            // Lets setup an object with the current artboard sizes
            localStorageObject.push(app.artboard.dimensions.return());

            // Now update the localStorage, with only one save state
            localStorage.setItem(localStorageKey, JSON.stringify(localStorageObject));

            // Update our local variable
            updateLocalStorageObject();
        } else {
            // @TODO Add a UI alert for this error
            console.log('There was a problem updating localStorage.');
        }

        // Log event when localStorage has been updated
        if (app.environment == "dev") {
            console.log('Added Artboard(s) to localstorage: ', updateLocalStorageObject()[0]);
        }
    }
}