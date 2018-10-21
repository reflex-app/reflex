const $ = require('jquery');

import { artboardSizes } from "../settings/settings-artboardSizes";

export class Settings {
    constructor(app) {
        // TODO: Add the rest of the artboard functionality (i.e. artboard.add())
        // Retrieve localStorage
        // artboardSizes(this);

        if (app.platform == "native") {
            this.createMacSettingsMenu();
        }
    }

    // Create Mac Menu
    createMacSettingsMenu() {
        // Make the NW window object accessible
        let win = nw.Window.get();

        // Create menu container
        var Menu = new nw.Menu({
            type: 'menubar'
        });

        //initialize default mac menu
        Menu.createMacBuiltin(nw.App.manifest.name);

        // Get the root menu from the default mac menu
        var rootMenu = Menu.items[0].submenu;

        // Append new item to root menu
        rootMenu.insert(
            new nw.MenuItem({
                label: 'Preferences',
                click: function () {
                    var $el = $("#settings");
                    var settingsClass = "is-visible";

                    function clickOutside(event) {
                        if (!$(event.target).closest('.settings__inner').length && !$(event.target).is('.settings__inner')) {
                            toggleSettings();
                        }
                    }

                    function toggleSettings() {
                        if ($el.hasClass(settingsClass)) {
                            $el.removeClass(settingsClass);
                            // Unbind
                            $("body").off('click', clickOutside);
                        } else {
                            $el.addClass(settingsClass);
                            // Bind 
                            $("body").on('click', clickOutside);
                        }
                    }

                    // Initialize
                    toggleSettings();
                }
            }), 1 // <-- 0-index where you want to insert
        );

        // Append Menu to Window
        win.menu = Menu;
    }

}

// app.settings = {
//     init: function () {
//         // Start the artboard sizes
//         app.settings.artboardSizes.init();
//     },