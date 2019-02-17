<template>
  <div>
    <button @click="captureAll()">Capture ALL</button>
    <div v-for="(artboard, index) in artboards" v-bind:key="index">
      <span>{{artboard.title}}</span>
      <button @click="capture(index, artboard.title)">Capture</button>
    </div>
  </div>
</template>

<script>
const { dialog } = require("electron").remote;
const path = require("path");
const fs = require("fs");
const moment = require("moment");

export default {
  name: "ScreenshotPanel",

  computed: {
    // Bind to our Vuex Store's URL value
    artboards() {
      return this.$store.state.artboards;
    }
  },

  methods: {
    async capture(id, title, screenshotPath) {
      const webview = document.querySelectorAll("webview")[id];
      console.log(id, webview);

      async function saveScreenshot(screenshot) {
        if (!screenshotPath) {
          // Case: no path set yet (single screenshot save)
          // Prompt location to save screenshot
          dialog.showOpenDialog(
            { properties: ["openFile", "openDirectory"] },
            function(filePaths) {
              try {
                makeFile(filePaths[0], screenshot);
              } catch (e) {
                // Nothing was selected
              }
            }
          );
        } else {
          // Case: already has a path (multi-save)
          makeFile(screenshotPath, screenshot);
        }
      }

      // Create the file
      function makeFile(filePath, screenshot) {
        const timestamp = moment().format("YYYY-MM-D_h-mm-ssa");

        if (title) {
          fs.writeFileSync(
            path.join(filePath, `reflex-screenshot_${title}_${timestamp}.png`),
            screenshot
          );
        } else {
          fs.writeFileSync(
            path.join(filePath, `reflex-screenshot_${timestamp}.png`),
            screenshot
          );
        }

        // Alert the user that the screenshot was saved
        let notification = new Notification("Screenshot saved", {
          body: filePath
        });
      }

      // Capture the <webview>
      webview.getWebContents().capturePage(image => {
        const PNG = image.toPNG();
        saveScreenshot(PNG);
      });
    },
    async captureAll() {
      const vm = this;

      // 1. Capture the path to save all
      dialog.showOpenDialog(
        { properties: ["openFile", "openDirectory"] },
        async function(filePaths) {
          try {
            // Capture each
            for (let i = 0; i < vm.artboards.length; i++) {
              await vm.capture(i, `${i}`, filePaths[0]);
            }
          } catch (e) {
            // Nothing was selected
          }
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/_variables";
</style>