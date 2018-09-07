// 1. check/read localstorage
// when you open it
// 2. add/update localstorage
// when you change a size
app.settings.artboardSizes = {
    localStorageKey: "artboardSizes",
    localStorageObject: [],

    init: function () {
        app.settings.artboardSizes.firstLoad();
    },

    firstLoad: function () {
        // Initial check if there's existing data
        // If so, show it
        // If not, create some
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
            app.settings.artboardSizes.createLocalStorage();
        } else {
            // It's defined!
            // Use the saved sizes
            console.log('It exists');
            app.settings.artboardSizes.restorePreviousFromLocalStorage();
        }
    },

    // Update our local variable
    updateLocalStorageObject: function () {
        if (localStorage.getItem(this.localStorageKey)) {
            this.localStorageObject = JSON.parse(localStorage.getItem(this.localStorageKey));
            return this.localStorageObject;
        } else {
            console.log('No local storage exists')
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
        app.settings.artboardSizes.updateLocalStorageObject();

        // Add to LocalStorage
        console.log('Added to localstorage: ', app.settings.artboardSizes.updateLocalStorageObject());
    },

    /**
     * Restores the artboard sizes from the existing localStorage data
     */
    restorePreviousFromLocalStorage: function () {
        // Update our local variable
        app.settings.artboardSizes.updateLocalStorageObject();

        // Remove the initial frames, and load the old ones
        $(artboards).empty();

        // Now create the artboards from the last save state
        var object = app.settings.artboardSizes.localStorageObject[0];

        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                var instance = object[key];
                app.artboard.add("after", null, instance.width, instance.height, "fromEmpty");
                console.log(key, instance);
            }
        }

        // var array = app.settings.artboardSizes.localStorageObject[0].length;
        // for (var i = 0; i < array; i++) {
        //     var instance = array[i];
        //     // Add new artboards
        //     app.artboard.add("after", null, instance.width, instance.height, "fromEmpty");
        //     console.log(i, instance);
        // }

        // Get the current artboard sizes
        // this.localStorageObject = app.artboard.dimensions.return();

        // Now update the localStorage, with only one save state
        // localStorage.setItem(this.localStorageKey, JSON.stringify(this.localStorageObject));

    },

    /**
     * Updates the existing localStorage definition with the sizes of the current artboards
     */
    updateLocalStorage: function () {
        console.log(this.localStorageObject.length);

        // Add to existing
        if (this.localStorageObject.length >= 1 && this.localStorageObject.length !== null) {
            // localStorage key exists!
            // Clear the existing object
            this.localStorageObject = [];

            // Lets setup an object with the current artboard sizes
            this.localStorageObject.push(app.artboard.dimensions.return());
            // console.log(this.localStorageObject, app.artboard.dimensions.return());

            // Now update the localStorage, with only one save state
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.localStorageObject));

            // Update our local variable
            app.settings.artboardSizes.updateLocalStorageObject();
        } else {
            console.log('issue');
        }

        // Add to LocalStorage
        console.log('Added to localstorage: ', app.settings.artboardSizes.updateLocalStorageObject());
    }

}