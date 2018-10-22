const $ = require('jquery');
require('../../plugins/jquery-resizable.min.js');

import {
    app
} from "../../index";

import * as artboardDimensions from "../artboard/artboard-dimensions";

export function init(element) {
    // TODO: Refactor the following to global
    let $el = $(".handle__bottom");
    let artboard = $(".artboard");
    let artboards = $("#artboards");
    let artboardInnerFrame = $("iframe");

    // TODO: After adding a new artboard, that artboard isn't able to resize
    // this is because the $('.artboard') is a cached DOM element

    element.resizable({
        handleSelector: "> .handle__bottom",
        resizeWidthFrom: 'right',
        touchActionNone: true,
        onDragStart: (e, $el, newWidth, newHeight) => {
            // Disable Panzoom
            app.canvas.$canvas.panzoom("disable");
            if (app.environment == "dev") {
                console.log("Panzoom Disabled?: " + app.canvas.$canvas.panzoom("isDisabled"));
            }
            
            // Update the event
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
        onDragEnd: (e) => {
            // Update the event
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

            // Re-enable
            app.canvas.$canvas.panzoom("enable");

            if (app.environment == "dev") {
                console.log("Panzoom Disabled?: " + app.canvas.$canvas.panzoom("isDisabled"));
            }
        }    
    });
}

// export function init() {
//     // TODO: Refactor the following to global
//     let $el = $(".handle__bottom");
//     let artboard = $(".artboard");
//     let artboards = $("#artboards");
//     let artboardInnerFrame = $("iframe");

//     // TODO: After adding a new artboard, that artbaord isn't able to resize
//     // this is because of how artboard is defined 

//     // Allow resizing
//     artboard.resizable({
//         handleSelector: "> .handle__bottom",
//         resizeWidthFrom: 'right',
//         touchActionNone: true,
//         onDragStart: (e, $el, newWidth, newHeight) => {
//             // Disable Panzoom
//             app.canvas.$canvas.panzoom("disable");
//             if (app.environment == "dev") {
//                 console.log("Panzoom Disabled?: " + app.canvas.$canvas.panzoom("isDisabled"));
//             }
            
//             // Update the event
//             app.events.isResizingArtboard = true;

//             // Update dimensions
//             var parent_artboard = $el.closest(artboard);

//             // if ( app.environment == "dev" ) { 
//             //     console.log('dragging', parent_artboard);
//             // }                

//             // Disable pointer events on other elements
//             artboardInnerFrame.css("pointer-events", "none");
//             artboards.css("pointer-events", "none");

//             // Accept all events from parent
//             $el.css("pointer-events", "all");
//             $el.css("cursor", "nwse-resize");

//             // Override all other elements
//             $('body').css("cursor", "nwse-resize");

//             // Update the artboard's dimensions in the UI
//             artboardDimensions.updateDimensions(parent_artboard, newWidth, newHeight);
//         },
//         onDragEnd: (e) => {
//             // Update the event
//             app.events.isResizingArtboard = false;

//             // Disable pointer events on other elements
//             artboardInnerFrame.css("pointer-events", "");
//             artboards.css("pointer-events", "auto");

//             // Accept all events from parent
//             $el.css("pointer-events", "");
//             $el.css("cursor", "");

//             // Override all other elements
//             $('body').css("cursor", "");

//             // TODO: Re-enable localStorage function when ready
//             // Save the latest artboard sizes to localStorage
//             // app.settings.artboardSizes.updateLocalStorage();

//             // Re-enable
//             app.canvas.$canvas.panzoom("enable");

//             if (app.environment == "dev") {
//                 console.log("Panzoom Disabled?: " + app.canvas.$canvas.panzoom("isDisabled"));
//             }
//         }    
//     });
// }