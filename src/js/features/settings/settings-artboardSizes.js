// 1. check/read localstorage
// when you open it
// 2. add/update localstorage
// when you change a size
app.settings.artboardSizes = {
    localStorageKey: "artboardSizes",
    localStorageObject: JSON.parse(localStorage.getItem(this.localStorageKey)) || [],

    init: function () {
        app.settings.artboardSizes.firstLoad();
    },

    firstLoad: function () {
        // Read localStorage
        app.settings.artboardSizes.readLocalStorage();
    },

    /**
     * Read the localStorage
     * If nothing exists, create the key with the current artboard sizes
     */
    readLocalStorage: function () {
        // Return the localStorage
        if (localStorage[this.localStorageKey] == null || !localStorage[this.localStorageKey]) {
            // Nothing is defined!
            console.log('Undefined');
            // @TODO: Deal with the empty state. Should create a localStorage key and add the current artboard sizes to it.
            app.settings.artboardSizes.createLocalStorage();
        } else {
            // It's defined!
            console.log('It exists');
            // Remove the initial frames, and load the old ones

        }
    },

    
    /**
     * Initializes the localStorage definition
     */
    createLocalStorage: function () {
        // No localStorage exists!
        // Lets setup an object with the current artboard sizes
        this.localStorageObject.push(app.artboard.dimensions.return());

        // Now create a new key and save to it
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.localStorageObject));

        // Update our local variable
        app.settings.artboardSizes.localStorageObject = JSON.parse(localStorage[this.localStorageKey]);

        // Add to LocalStorage
        console.log('Added to localstorage: ' + JSON.parse(localStorage[this.localStorageKey]));
    },

    /**
     * Updates the existing localStorage definition with the sizes of the current artboards
     */
    updateLocalStorage: function (e) {
        console.log(this.localStorageObject.length);

        // Add to existing
        if (this.localStorageObject.length >= 1 && this.localStorageObject.length !== null) {
            // localStorage key exists!

            if (e) {
                // Make sure there's only 1 saved state
                // Remove the existing item
                if (this.localStorageObject.length > 1) {
                    this.localStorageObject.shift();
                }

                // Add the latest artboards
                this.localStorageObject.push(e);
            }

            // Now update the localStorage, with only one save state
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.localStorageObject));

            // Update our local variable
            app.settings.artboardSizes.localStorageObject = JSON.parse(localStorage[this.localStorageKey]);

            // Remove the existing elements
            $(artboards).empty();

            // Now create the artboards from the last save state
            for (var i = 0, len = this.localStorageObject[0].length; i < len; ++i) {
                var instance = this.localStorageObject[0][i];
                console.log(i, instance);

                // Add new artboards
                app.artboard.add("after", null, instance.width, instance.height);
            }

        } else {
            console.log('issue');
        }

        // Add to LocalStorage
        console.log('Added to localstorage: ' + JSON.parse(localStorage[this.localStorageKey]));
    }

}