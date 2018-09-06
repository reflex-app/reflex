// Usage:
// app.artboard.add(before||after, $el, width, height)
app.artboard.add = function (placement, event, width, height) {

    // "new" or "additional"
    // Helps switch between .prepend/.append, and .before/.after
    var newOrAdditional;

    if (event) {
        // Find element's parent artbaord container
        var this_artboard = $(event.target).parent(artboard);
        newOrAdditional = "additional";
        // console.log(event, $(event.target));
        // console.log(this_artboard);
    } else {
        var this_artboard = $(artboards);
        newOrAdditional = "new"
    }

    // If a width or height is set, pass it
    // into the artboard size
    function returnWidthHeight() {
        console.log(width, height);

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

                console.log("Created artboard with width: " + width + "px and height: " + height + "px");

                var obj = {width: width, height: height};
                return obj;
            }
        }

    }

    if (placement) {
        if (placement == "before") {

            if (newOrAdditional == "new") {
                this_artboard.prepend(Hbs.templates.artboard(returnWidthHeight()));
            } else if (newOrAdditional == "additional") {
                this_artboard.before(Hbs.templates.artboard(returnWidthHeight()));
            }

            console.log(returnWidthHeight());
            console.log('Added artboard before', this_artboard);
        } else if (placement == "after") {

            if (newOrAdditional == "new") {
                this_artboard.append(Hbs.templates.artboard(returnWidthHeight()));
            } else if (newOrAdditional == "additional") {
                this_artboard.after(Hbs.templates.artboard(returnWidthHeight()));
            }

            console.log(returnWidthHeight());
            console.log('Added artboard after');
        }

        // Update the dimensions all artboards
        artboard = $(".artboard");
        app.artboard.dimensions.update(artboard);

        // Add the + button before all items
        app.artboard.createFirstNewButton();

    } else {
        console.log("Please pass in the `placement` (before or after) and the event.");
    }
}