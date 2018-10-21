const $ = require('jquery');
require('../../plugins/jquery-resizable.min.js');
import {
    app
} from "../../index";

import * as artboardDimensions from "../artboard/artboard-dimensions";

// TODO: This seems to be storing it's events and outputting them each time
// the onDragEnd fires. Could cause memory leak.
export function resize(e) {
    // Restrict to one artboard at a time
    if (!app.events.isResizingArtboard && app.events.isOnArtboard) {

        // TODO: Refactor the following to global
        let $el = $(".handle__bottom");
        let artboard = $(".artboard");
        let artboards = $("#artboards");
        let artboardInnerFrame = $("iframe");

        app.canvas.$canvas.panzoom("disable");

        if (app.environment == "dev") {
            console.log("Panzoom Disabled?: " + app.canvas.$canvas.panzoom("isDisabled"));
            //     console.log(artboard); 
        }

        // Allow resizing
        artboard.resizable({
            handleSelector: "> .handle__bottom",
            resizeWidthFrom: 'right',
            touchActionNone: true,
            onDrag: function (e, $el, newWidth, newHeight) {
                app.events.isResizingArtboard = true;

                // Update dimensions
                var parent_artboard = $el.closest(artboard);

                // if ( app.environment == "dev" ) { 
                //     console.log('dragging', parent_artboard);
                // }                

                // Disable pointer events on other elements
                artboardInnerFrame.css("pointer-events", "none");
                artboards.css("pointer-events", "none");

                // Accept all events from parent
                $el.css("pointer-events", "all");
                $el.css("cursor", "nwse-resize");

                // Override all other elements
                $('body').css("cursor", "nwse-resize");

                // Update the artboard's dimensions in the UI
                artboardDimensions.updateDimensions(parent_artboard, newWidth, newHeight);
            },
            onDragEnd: function (e) {
                app.events.isResizingArtboard = false;

                // Disable pointer events on other elements
                artboardInnerFrame.css("pointer-events", "");
                artboards.css("pointer-events", "auto");

                // Accept all events from parent
                $el.css("pointer-events", "");
                $el.css("cursor", "");

                // Override all other elements
                $('body').css("cursor", "");

                // TODO: Re-enable localStorage function when ready
                // Save the latest artboard sizes to localStorage
                // app.settings.artboardSizes.updateLocalStorage();

                app.canvas.$canvas.panzoom("enable");

                if (app.environment == "dev") {
                    console.log("Panzoom Disabled?: " + app.canvas.$canvas.panzoom("isDisabled"));
                }
            }
        });
    } else {
        return false;
    }
}