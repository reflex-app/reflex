app.artboard.add = function (placement, event) {
    // Usage:
    // app.artboard.add(before||after, $el)

    // Find element's parent artbaord container
    var this_artboard = $(event.target).parent(artboard);
    console.log(event, $(event.target));
    console.log(this_artboard);

    if (placement && event) {
        // if before
        if (placement == "before") {
            this_artboard.before(Hbs.templates.artboard());
            console.log('Added artboard before', this_artboard);
        }
        // if after
        if (placement == "after") {
            this_artboard.after(Hbs.templates.artboard());
            console.log('Added artboard after');
        }
    } else {
        console.log("Please pass in the `placement` (before or after) and the event.");
    }

}