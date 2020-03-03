<template>
  <div id="mockup-container">
    <div id="mockup-inner" :style="{ width: width+'px', height: height+'px' }">
      <div id="header">
        <BrowserMockup part="header" />
      </div>
      <div id="mockup-webpage" :style="{ height: height+'px', width: width+'px' }">
        <!-- Dynamic content, i.e. a Webview -->
        <slot></slot>
      </div>
      <div id="footer">
        <BrowserMockup part="footer" />
      </div>
    </div>
  </div>
</template>

<script>
import BrowserMockup from "@/components/Mockups/browserMockup.vue";

export default {
  components: {
    BrowserMockup
  },
  props: ["width", "height"]
};
</script>

<style lang="scss" scoped>
#mockup-container {
  position: absolute;
  transform-origin: top left;
  z-index: 1;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  width: 431px;
  height: 865px;

  &:after {
    content: "";
    position: absolute; // Custom
    // background-image: url("~@/assets/devices/iphone-11-pro.png");
    background-image: url("~@/assets/devices/iphone-11-pro-vector.svg");
    background-size: 431px 865px;
    width: 431px;
    height: 865px;
    // top: -26px;
    // left: -28px;
  }
}

#header {
  position: sticky;
  top: 0;
  margin-bottom: -6px;
}

#footer {
  position: sticky;
  bottom: 0;
  bottom: -6px;
}

#mockup-inner {
  overflow: hidden;
  position: absolute;
  top: 26px;
  left: 28px;
  z-index: -1; // Behind mockup
}

#mockup-webpage {
  background: white;
}
</style>