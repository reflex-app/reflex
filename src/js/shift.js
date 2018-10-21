// Create the main Shift class object
// This is the main hub of information about the app
export default class Shift {
    constructor() {
        this.artboards = ""; // keep track of all the artboards

        this.environment = this.checkEnvironment();
        this.platform;

        // Artboards
        // this.artboards = $("#artboards");
        // this.artboard = $(".artboard");
        // this.artboardInnerFrame = $("iframe");

        // Set initial scale
        // this.minScaleX = $(window).width() / artboards.innerWidth();
        // this.minScaleY = $(window).height() / artboards.innerHeight();
    }

    checkEnvironment() {
        // Check if this a dev or production environment
        let currentURL = new URL(window.location.href);
        if (currentURL.hostname.includes("localhost")) {
            console.log("Environment: development");
            return "dev";
        } else {
            console.log("Environment: production");
            return "production";
        }
    }
}