<template>
  <div id="toolbar">
    <div id="toolbar__url-container">
      <div v-if="artboards.length">
        <img v-if="favicon" v-bind:src="favicon" alt="Site Icon" height="10" width="10">
        <span id="toolbar__site-title" v-bind:title="title">{{ title }}</span>
        <input
          v-model="url"
          placeholder="Enter a website URL (http://website.com)"
          type="text"
          id="toolbar__url"
          name="toolbar__url"
          @focus="$event.target.select()"
          autocomplete="off"
        >
        <!-- <button @click="browserSyncGetProxy()">BS</button> -->
      </div>
      <div id="toolbar__recentURLs"></div>
    </div>
    <!-- <div class="toolbar__right">
      <div class="toolbar__button-group">
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "Toolbar",
  computed: {
    title() {
      return this.$store.state.site.title;
    },
    url: {
      // Bind to our Vuex Store's URL value
      get() {
        return this.$store.state.site.url;
      },
      set(value) {
        this.$store.commit("changeSiteData", {
          url: value
        });
      }
    },
    favicon() {
      return this.$store.state.site.favicon;
    },
    artboards() {
      return this.$store.state.artboards;
    }
  },
  methods: {}
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

  .toolbar__right {
    display: flex;

    .toolbar__button-group:not(:last-child) {
      margin-right: 24px;
    }
  }
}
</style>
