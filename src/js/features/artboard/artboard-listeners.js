const $ = require('jquery');
import {
    app
} from "../../index";

import * as artboardAdd from "../artboard/artboard-add";

export function init() {
    let canvas = app.canvas.$canvas; // TODO: Refactor somewhere more common

    // Listen for clicks on New artboard button
    canvas.on('click', '.button-artboard-before, .button-artboard-after', function (e) {
        var $target = $(e.target);

        // Add a new artboard before or after
        if ($target.is("div.button-artboard-before")) {
            artboardAdd.add("before", 400, 400, e);
        } else if ($target.is("div.button-artboard-after")) {
            artboardAdd.add("after", 400, 400, e);
        }

        // TODO: Attach toolbar function
        // Update the URL in all frames
        // app.toolbar.updateURL();
    });

    // Listen for mouse hover
    // TODO: Tidy up this logic
    canvas.on({
        mouseenter: function (e) {
            app.events.isOnArtboard = true;
            app.canvas.$canvas.panzoom("disable");
        },
        mouseleave: function (e) {
            app.events.isOnArtboard = false;
            app.canvas.$canvas.panzoom("enable");
        }
    }, '.artboard');

    // Let links be clickable
    canvas.find('a').on('mousedown touchstart', function (e) {
        e.stopImmediatePropagation();
    });
}

// app.artboard.watchers = {
//     init: function () {
//         canvas.on('click', '.button-artboard-before, .button-artboard-after', function (e) {
//             var $target = $(e.target);

//             // Add a new artboard before or after
//             if ($target.is("div.button-artboard-before")) {
//                 app.artboard.add("before", e);
//             } else if ($target.is("div.button-artboard-after")) {
//                 app.artboard.add("after", e);
//             }

//             // Update the URL in all frames
//             app.toolbar.updateURL();
//         });

//         // Artboard resize
//         canvas.on({
//             mouseenter: function (e) {
//                 app.events.isOnArtboard = true;
//                 app.artboard.resize.trigger(e);
//             },
//             mouseleave: function (e) {
//                 app.events.isOnArtboard = false;
//                 app.artboard.resize.trigger(e);
//             }
//         }, '.artboard');

//         // Let links be clickable
//         canvas.find('a').on('mousedown touchstart', function (e) {
//             e.stopImmediatePropagation();
//         });
//     },
// }