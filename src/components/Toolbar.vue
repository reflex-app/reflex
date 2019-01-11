<template>
  <div id="toolbar">
    <div id="toolbar__url-container">
      <span v-if="title" id="toolbar__site-title">{{ title }}</span>
      <input
        v-model.lazy="url"
        placeholder="Enter a website URL (http://website.com)"
        type="text"
        id="toolbar__url"
        name="toolbar__url"
        @focus="$event.target.select()"
        autocomplete="off"
      >
      <div id="toolbar__recentURLs"></div>
    </div>
    <div
      @click="toggleSidebar()"
      v-if="artboards.length"
      v-bind:class="{'button--is-active': sidebar}"
      class="button"
    >Sizes</div>
  </div>
</template>

<script>
export default {
  name: "Toolbar",
  computed: {
    sidebar() {
      return this.$store.state.gui.sidebar;
    },
    title() {
      return this.$store.state.site.title;
    },
    url: {
      // Bind to our Vuex Store's URL value
      get() {
        return this.$store.state.site.url;
      },
      set(value) {
        this.$store.commit("changeSiteURL", value);
      }
    },
    artboards: function() {
      return this.$store.state.artboards;
    }
  },
  methods: {
    toggleSidebar() {
      const newState = !this.sidebar;
      this.$store.commit("toggleSidebar", newState);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../scss/_variables";

#toolbar {
  height: 44px;
  z-index: 1;
  padding: 0.5rem 1rem;
  color: #434343;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-bottom: $gui-border;

  & > *:not(:first-child) {
    margin-left: 16px;
  }

  #toolbar__site-title {
    font-size: 0.8rem;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: default;
    user-select: none;
  }

  #toolbar__url-container {
    position: relative;

    @media screen and (max-width: 768px) {
      flex: 1 0 auto;
    }

    input[type="text"] {
      border: none;
      box-sizing: border-box;
      padding: 0.2rem 0.5rem;
      padding-left: 0;
      background: #ffffff;
      border: 1px solid transparent;
      border-radius: 4px;
      width: 100%;
      max-width: 80vw;
      min-width: 320px;
      text-overflow: ellipsis;
      display: block;

      &:hover {
        border: 1px solid $border-color;
        background: darken($body-bg, 5%);
      }

      &:focus {
        padding: 0.5rem;
        text-overflow: none;
        text-align: left;
        outline: none;
        background: lighten($body-bg, 3%);
        border: 1px solid rgba($accent-color, 1);
      }
    }

    #toolbar__recentURLs {
      display: none;
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      width: 100%;
      background: white;
      box-shadow: 0 5px 20px rgba(#000, 0.2);
      transition: all 1s ease-in-out;
      border-radius: 4px;
      z-index: 1000;

      &.is-visible {
        display: block;
      }

      li {
        padding: 1rem;
        list-style: none;
        color: black;

        &:hover {
          cursor: pointer;
          background: rgba($accent-color, 0.1);
        }

        &.is-keyboard-selected {
          color: white;
          background: $accent-color;
        }
      }
    }
  }

  .is-active {
    border-bottom: 2px solid blue;
  }
}
</style>
