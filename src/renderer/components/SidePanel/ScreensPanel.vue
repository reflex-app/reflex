<template>
  <transition name="sidebar-transition">
    <div id="artboard-tabs">
      <!-- List of Artboards -->
      <div v-if="artboards.length" class="artboard-tabs__scroll">
        <artboardEditable data="artboards"/>
      </div>

      <!-- New Artboard -->
      <div class="artboard-tabs__button button button--primary" @click="add()">New Screen</div>

      <!-- Show a tip if there's no artboards -->
      <div v-if="!artboards.length" class="empty-state">
        <div class="empty-state__text">Click to create a new screen</div>
      </div>

      <!-- Templates -->
      <div class="panel-section">
        <span>Add from template:</span>
        <select v-model="defaultSizeSelection" @change="addDefaultSizes">
          <option disabled value>Select template...</option>
          <option value="basic">Basic</option>
          <option value="bootstrap">Bootstrap 4</option>
          <option value="foundation">Foundation 6</option>
        </select>
      </div>
    </div>
  </transition>
</template>

<script>
import artboardEditable from "@/components/SidePanel/artboardEditable";

export default {
  name: "ScreensPanel",
  components: {
    artboardEditable
  },

  data() {
    return {
      defaultSizeSelection: ""
    };
  },

  computed: {
    // Bind to our Vuex Store's URL value
    artboards: {
      get() {
        return this.$store.state.artboards;
      },
      set(value) {
        this.$store.commit("setArtboardList", value);
      }
    }
  },

  methods: {
    add() {
      this.$store.dispatch("addArtboard", {
        title: "Untitled",
        width: 375,
        height: 667
      });
    },
    addDefaultSizes() {
      if (!this.defaultSizeSelection) return false;

      let sizes; // This will contain the size data

      const defaults = {
        small: {
          title: "Small",
          width: 375,
          height: 667
        },
        medium: {
          title: "Medium",
          width: 768,
          height: 1024
        },
        large: {
          title: "Large",
          width: 1024,
          height: 720
        }
      };

      const bootstrap = {
        xsmall: {
          title: "XS",
          width: 375,
          height: 500
        },
        small: {
          title: "S",
          width: 576,
          height: 800
        },
        medium: {
          title: "M",
          width: 768,
          height: 1000
        },
        large: {
          title: "MD",
          width: 992,
          height: 1200
        },
        xlarge: {
          title: "LG",
          width: 1200,
          height: 1400
        }
      };

      const foundation = {
        small: {
          title: "Small",
          width: 400,
          height: 600
        },
        medium: {
          title: "Medium",
          width: 640,
          height: 800
        },
        large: {
          title: "Large",
          width: 1024,
          height: 1200
        }
      };

      switch (this.defaultSizeSelection) {
        case "basic":
          sizes = defaults;
          break;
        case "bootstrap":
          sizes = bootstrap;
          break;
        case "foundation":
          sizes = foundation;
          break;
      }

      this.$store.dispatch("addMultipleArtboards", {
        data: sizes
      });

      // Empty selected value
      this.defaultSizeSelection = "";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/scss/_variables";

#artboard-tabs {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;

  .artboard-tabs__scroll {
    flex-grow: 1;
    min-height: 0;
    overflow: auto;
  }

  .artboard-tabs__button {
    position: relative;
    margin: 1rem 1rem;
    box-sizing: border-box;
    border-radius: 4px;
    width: auto;
  }

  .empty-state {
    background: #535353;
    border: 1px solid #434343;
    box-shadow: 0 1px 4px 0 rgba(102, 102, 102, 0.5);
    border-radius: 4px;
    margin: 0 1rem;
    user-select: none;
    position: relative;
    animation: MoveUpDown 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;

    @keyframes MoveUpDown {
      0%,
      100% {
        bottom: 0;
      }
      50% {
        bottom: 8px;
      }
    }

    // Triangle
    &:after {
      content: "";
      position: absolute;
      top: -6px;
      left: 0.5rem;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0px 6px 6px 6px;
      // border-width: 6px 6px 0 6px;
      border-color: transparent transparent #535353 transparent;
      // border-color: #535353 transparent transparent transparent;
    }

    .empty-state__text {
      padding: 0.5rem;
      font-size: 0.8rem;
      line-height: 1.5;
      color: white;
    }
  }
}
</style>
