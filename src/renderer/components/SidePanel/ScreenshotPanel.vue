<template>
  <div>
    <button @click="capture">Capture</button>
  </div>
</template>

<script>
const { dialog } = require("electron").remote;
const path = require("path");
const fs = require("fs");

export default {
  name: "ScreenshotPanel",

  computed: {
    // Bind to our Vuex Store's URL value
    artboards() {
      return this.$store.state.artboards;
    }
  },

  methods: {
    capture() {
      const webview = document.querySelector("webview");
      console.log("webview: ", webview);
      console.log("window:", window);

      function saveScreenshot(screenshot) {
        // Prompt location to save screenshot
        dialog.showOpenDialog(
          { properties: ["openFile", "openDirectory"] },
          function(filePaths) {
            try {
              // Save the screenshot to the selected file path
              fs.writeFileSync(
                path.join(filePaths[0], "example.png"),
                screenshot
              );

              // Alert the user that the screenshot was saved
              let notification = new Notification("Screenshot saved", {
                body: filePaths[0]
              });
            } catch (e) {
              // Nothing selected
              console.log("No file/directory selected.");
            }
          }
        );
      }

      // Capture the <webview>
      webview.getWebContents().capturePage(image => {
        const PNG = image.toPNG();
        saveScreenshot(PNG);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/_variables";
</style>