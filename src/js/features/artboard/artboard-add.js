import { app } from "../../index"

export default function addArtboard(placement, event, width, height, fn) {
    // "new" or "additional"
    // Helps switch between .prepend/.append, and .before/.after
    var needsNewDOMElement = false;

    // Which artboard?
    var this_artboard;

    if (fn === "fromEmpty") {
        needsNewDOMElement = true;
        this_artboard = $(artboards);

        // if (app.environment == "dev") {
        //     console.log('Created new artboard from empty');
        // }
    }

    if (event && event !== null) {
        // Find element's parent artbaord container
        this_artboard = $(event.target).parent(artboard);
        // console.log(event, $(event.target));
        // console.log(this_artboard);
    }

    // If a width or height is set, pass it
    // into the artboard size
    function returnWidthHeight() {

        // if (app.environment == "dev") {
        //     console.log(width, height);
        // }

        if (height == undefined && width == undefined) {
            // Do nothing...
        } else {
            if (height && width == undefined) {
                height = height + "px";
                return height;
            } else if (width && height == undefined) {
                width = width + "px";
                return width;
            } else if (height && width) {
                width = width;
                height = height;

                if (app.environment == "dev") {
                    console.log("Created artboard with width: " + width + "px and height: " + height + "px");
                }

                var obj = {
                    width: width,
                    height: height
                };
                return obj;
            }
        }

    }

    if (placement) {
        if (placement == "before") {

            if (needsNewDOMElement == true) {
                this_artboard.append(Hbs.templates.artboard(returnWidthHeight()));
            } else {
                this_artboard.before(Hbs.templates.artboard(returnWidthHeight()));
            }

            // if (app.environment == "dev") {
            //     console.log(returnWidthHeight());
            //     console.log('Added artboard before', this_artboard);
            // }

        } else if (placement == "after") {

            if (needsNewDOMElement == true) {
                this_artboard.append(Hbs.templates.artboard(returnWidthHeight()));
            } else {
                this_artboard.after(Hbs.templates.artboard(returnWidthHeight()));
            }

            // if (app.environment == "dev") {
            //     console.log(returnWidthHeight());
            //     console.log('Added artboard after');
            // }

        }

        // Update the dimensions all artboards
        artboard = $(".artboard");
        app.artboard.dimensions.update(artboard);

        // Add the + button before all items
        app.artboard.createFirstNewButton();

        // Save the latest artboard sizes to localStorage
        app.settings.artboardSizes.updateLocalStorage();

    } else {
        if (app.environment == "dev") {
            console.log("Please pass in the `placement` (before or after) and the event.");
        }
    }
}

// Usage:
// app.artboard.add(before||after, $el, width, height, fn)
// app.artboard.add = function (placement, event, width, height, fn) {

//     // "new" or "additional"
//     // Helps switch between .prepend/.append, and .before/.after
//     var needsNewDOMElement = false;

//     // Which artboard?
//     var this_artboard;

//     if (fn === "fromEmpty") {
//         needsNewDOMElement = true;
//         this_artboard = $(artboards);

//         // if (app.environment == "dev") {
//         //     console.log('Created new artboard from empty');
//         // }
//     }

//     if (event && event !== null) {
//         // Find element's parent artbaord container
//         this_artboard = $(event.target).parent(artboard);
//         // console.log(event, $(event.target));
//         // console.log(this_artboard);
//     }

//     // If a width or height is set, pass it
//     // into the artboard size
//     function returnWidthHeight() {

//         // if (app.environment == "dev") {
//         //     console.log(width, height);
//         // }

//         if (height == undefined && width == undefined) {
//             // Do nothing...
//         } else {
//             if (height && width == undefined) {
//                 height = height + "px";
//                 return height;
//             } else if (width && height == undefined) {
//                 width = width + "px";
//                 return width;
//             } else if (height && width) {
//                 width = width;
//                 height = height;

//                 if (app.environment == "dev") {
//                     console.log("Created artboard with width: " + width + "px and height: " + height + "px");
//                 }

//                 var obj = {
//                     width: width,
//                     height: height
//                 };
//                 return obj;
//             }
//         }

//     }

//     if (placement) {
//         if (placement == "before") {

//             if (needsNewDOMElement == true) {
//                 this_artboard.append(Hbs.templates.artboard(returnWidthHeight()));
//             } else {
//                 this_artboard.before(Hbs.templates.artboard(returnWidthHeight()));
//             }

//             // if (app.environment == "dev") {
//             //     console.log(returnWidthHeight());
//             //     console.log('Added artboard before', this_artboard);
//             // }

//         } else if (placement == "after") {

//             if (needsNewDOMElement == true) {
//                 this_artboard.append(Hbs.templates.artboard(returnWidthHeight()));
//             } else {
//                 this_artboard.after(Hbs.templates.artboard(returnWidthHeight()));
//             }

//             // if (app.environment == "dev") {
//             //     console.log(returnWidthHeight());
//             //     console.log('Added artboard after');
//             // }

//         }

//         // Update the dimensions all artboards
//         artboard = $(".artboard");
//         app.artboard.dimensions.update(artboard);

//         // Add the + button before all items
//         app.artboard.createFirstNewButton();

//         // Save the latest artboard sizes to localStorage
//         app.settings.artboardSizes.updateLocalStorage();

//     } else {
//         if (app.environment == "dev") {
//             console.log("Please pass in the `placement` (before or after) and the event.");
//         }
//     }
// }