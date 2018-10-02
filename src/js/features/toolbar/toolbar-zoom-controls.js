// Provides UI controls to zoom in/out of the canvas
app.toolbar.zoomControls = {
    init: function () {
        $("#canvas-controls__zoomIn").on('click', this.zoomIn);
        $("#canvas-controls__zoomOut").on('click', this.zoomOut);
    },

    zoomIn: function () {
        canvas.panzoom("zoom");
    },

    zoomOut: function () {
        canvas.panzoom("zoom", true);
    }
}