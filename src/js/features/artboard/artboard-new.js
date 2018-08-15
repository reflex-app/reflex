app.artboard.add = function (placement, event) {
    // Usage:
    // app.artboard.add(before||after, $el)

    // Find element's parent artbaord container
    var this_artboard = $(event.target).closest(artboard);
    console.log(this_artboard);

    if (placement && event) {
        // if before
        if (placement == "before") {
            this_artboard.before(Hbs.templates.artboard());
        }
        // if after
        if (placement == "after") {
            this_artboard.after(Hbs.templates.artboard());
        }
    } else {
        console.log("Please pass in the `placement` (before or after) and the event.");
    }

}