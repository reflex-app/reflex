<template>
  <div id="toolbar">
    <div
      v-if="artboards.length"
      id="toolbar__url-container"
    >
      <!-- <div class="controls">
        <div>Back</div>
        <div>Forward</div>
      </div>-->
      <div class="bar">
        <div class="bar__left">
          <div
            v-show="!inputStateActive"
            class="sync"
          >
            <SyncButton />
          </div>
        </div>
        <div
          class="bar__right"
          :class="{ 'is-active' : inputStateActive }"
        >
          <div
            v-show="!inputStateActive"
            @click="inputStateActive=!inputStateActive"
          >
            <!-- <img v-if="favicon" :src="favicon" class="favicon" height="10" width="10"> -->
            <span
              class="title"
              :title="title"
            >
              {{ title }}
            </span>
          </div>
          <URLInput
            class="input"
            :state="inputStateActive"
            @url-changed="changeURL"
            @toggle-input="inputStateActive=!inputStateActive"
          />
        </div>
      </div>
      <!-- <button @click="browserSyncGetProxy()">BS</button> -->
    </div>
    <div id="toolbar__recentURLs" />

    <Screenshot/>

    <!-- <div class="toolbar__right">
      <div class="toolbar__button-group">
      </div>
    </div>-->
  </div>
</template>

<script>
import URLInput from './URLInput.vue'
import SyncButton from './SyncButton.vue'
import Screenshot from './Screenshot'

const debounce = require('lodash.debounce')

export default {
  name: 'ToolBar',
  components: {
    URLInput,
    SyncButton,
    Screenshot
  },
  data() {
    return {
      inputStateActive: false
    }
  },
  computed: {
    title() {
      return this.$store.state.site.title
    },
    url() {
      return this.$store.state.site.url
    },
    favicon() {
      return this.$store.state.site.favicon
    },
    artboards() {
      return this.$store.state.artboards
    }
  },
  methods: {
    changeURL: debounce(function(url) {
      // @TODO: Check if it's a valid URL

      this.$store.commit('changeSiteData', {
        url: url
      })

      // Off
      this.inputStateActive = false
    }, 100)
  }
}
</script>

<style lang="scss" scoped>
@import "~@/scss/_variables";

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

  #toolbar__url-container {
    position: relative;
    margin: 0 auto;

    @media screen and (max-width: 768px) {
      flex: 1 0 auto;
    }

    .controls {
      display: flex;
    }

    .bar {
      display: flex;
      align-items: center;
      min-width: 500px;
      border-radius: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      user-select: none;
      display: flex;
      align-items: stretch;
    }

    .bar__left {
      position: relative;
      display: block;

      .sync {
        position: relative;
        display: inline-block;
        line-height: normal;
        vertical-align: baseline;
        height: 100%;
      }
    }

    .bar__right {
      display: flex;
      flex: 1;
      width: 100%;
      background: #eeeeee;
      transition: background 0.15s ease-out;
      padding: 0.4rem 1rem;

      &:hover {
        cursor: pointer;
        background: darken(#eeeeee, 10%);
      }

      &.is-active {
        padding: 0;
      }

      .title {
        font-weight: bold;
        display: block;
        margin-right: 0.5rem;
        max-width: 24rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .favicon {
        margin-right: 0.25rem;
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

  // .toolbar__right {
  //   display: flex;

  //   .toolbar__button-group:not(:last-child) {
  //     margin-right: 24px;
  //   }
  // }
}
</style>
