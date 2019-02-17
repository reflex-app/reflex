<template>
  <div>
    <button @click="capture">Capture</button>
  </div>
</template>

<script>
const { dialog } = require("electron").remote;
const window = require("electron").remote.BrowserWindow;
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
      // const webview = document.querySelector("webview").contentWindow;
      const webview = window.getFocusedWindow();
      console.log(webview);

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

      // Run
      // ([dimensions], callback)
      const rect = {
        x: 0,
        y: 0,
        width: 500,
        height: 500
      };

      webview.capturePage(image => {
        const PNG = image.toPNG();
        saveScreenshot(PNG);
        console.log(PNG);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/_variables";
</style>