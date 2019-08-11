<template>
  <div
    class="icon"
    :style="{ backgroundImage: `url(${iconHandler}` }"
  ></div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    iconHandler() {
      try {
        console.log(`@/assets/icons/${this.name}.svg`);
        const iconFile = require(`@/assets/icons/${this.name}.svg`);
        if (iconFile) {
          console.log(iconFile);
          
          return iconFile
        }
      } catch (e) {
        throw new Error('Icon not found')
      }

      switch (this.name) {
        case "back":
          return "arrow-left.svg";
          break;

        default:
          // No icon
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.icon {
  display: inline-block;
  // background-image: url("~@/assets/icons/arrow-left.svg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  // height: 100%;
  // width: 100%;
  height: 24px;
  width: 24px;
}
</style>