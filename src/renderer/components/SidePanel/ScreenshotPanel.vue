<template>
  <div id="screenshot-panel">
    <div
      v-for="(artboard, index) in artboards"
      v-bind:key="index"
      class="screenshot-panel__artboard"
    >
      <div class="artboard-group">
        <div class="title">{{artboard.title}}</div>
        <div class="dimensions">{{artboard.width}} x {{artboard.height}}</div>
      </div>
      <div class="button button--secondary" @click="capture(index, artboard.title)">Capture</div>
    </div>
    <div class="button button--primary" @click="captureAll()">Capture All</div>
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

      async function saveScreenshot(screenshot) {
        if (!screenshotPath) {
          // Case: no path set yet (single screenshot save)
          // Prompt location to save screenshot
          dialog.showOpenDialog(
            { properties: ["openFile", "openDirectory", "createDirectory"] },
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
          title = `_${title}_`;
        } else {
          title = "";
        }

        fs.writeFile(
          path.join(filePath, `reflex${title}${timestamp}.png`),
          screenshot,
          err => {
            if (err) throw err;
            popNotification();
          }
        );

        function popNotification() {
          // Alert the user that the screenshot was saved
          let notification = new Notification("Screenshot saved", {
            body: filePath
          });
        }
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
        { properties: ["openFile", "openDirectory", "createDirectory"] },
        async function(filePaths) {
          try {
            // Capture each
            for (let i = 0; i < vm.artboards.length; i++) {
              await vm.capture(
                i,
                `${vm.artboards[i].title}_${i}`,
                filePaths[0]
              );
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

#screenshot-panel {
  box-sizing: border-box;

  .screenshot-panel__artboard {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1 0 auto;
    background: #ffffff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-bottom: 1px solid $border-color;
    padding: 0.5rem 1rem;
    user-select: none;

    .dimensions {
      color: gray;
    }
  }

  .button.button--primary {
    margin: 1rem 1rem;
    width: auto;
    border-radius: 4px;
  }
}
</style>