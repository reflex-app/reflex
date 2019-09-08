<template>
  <webview id="devtools"></webview>
</template>

<script>
export default {
  mounted() {
    this.$nextTick(() => {
      const browserView = document.querySelector("webview.frame");
      const devtoolsView = this.$el;

      browserView.addEventListener("dom-ready", () => {
        const browser = browserView.getWebContents();
        browser.openDevTools();

        // Blocked by: https://github.com/electron/electron/issues/14095
        // browser.setDevToolsWebContents(devtoolsView.getWebContents());
        // browser.openDevTools({mode: right});
      });
    });
  }
};
</script>

<style lang="scss" scoped>
webview#devtools {
  height: 30%;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
</style>