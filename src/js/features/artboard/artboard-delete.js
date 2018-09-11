app.artboard.delete = function (event) {
    if (event) {
        if (artboard.length > 1) {
            var $el = $(event.target).closest(artboard);
            $el.remove();

            // Save the latest artboard sizes to localStorage
            app.settings.artboardSizes.updateLocalStorage();

            // Re-enable Panzoom
            artboards.panzoom("enable");
        } else {
            alert('Sorry, you must have at least one artboard.')
        }
    } else {
        console.log("No event received");
    }
}