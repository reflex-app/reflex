<template>
  <div id="main-view">
    <SidePanel />
    <Screenshots />
    <Panzoom>
      <Artboards />
    </Panzoom>
  </div>
</template>

<script>
import Artboards from "@/components/Screens/Artboards";
import SidePanel from "@/components/SidePanel";
import Screenshots from "@/components/Screenshot";
import Panzoom from "@/components/Panzoom";

export default {
  name: "MainView",
  components: {
    Artboards,
    SidePanel,
    Screenshots,
    Panzoom
  }
};
</script>

<style lang="scss">
// Make global styles available
@import "@/scss/_global";
</style>

<style lang="scss" scoped>
#main-view {
  height: 100%;
  width: 100%;
}
</style>
