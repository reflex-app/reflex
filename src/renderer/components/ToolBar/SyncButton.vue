<template>
  <div id="sync-button" :class="{ 'is-active' : isOnSyncURL }" @click="syncSite()">
    <img src="@/assets/icons/sync.svg" alt>
  </div>
</template>

<script>
// Synchronization server
import * as electron from "electron";
import * as sync from "../../mixins/sync.js";

const currentWindow = electron.remote.getCurrentWindow();

export default {
  name: "SyncButton",

  data() {
    return {
      syncServer: ""
    };
  },

  computed: {
    url() {
      // Bind to our Vuex Store's URL value
      return this.$store.state.site.url;
    },
    isOnSyncURL() {
      // Provides simple logic for when to
      // show/hide the "Sync" button
      if (this.url === this.syncServer) {
        return true;
      } else {
        return false;
      }
    }
  },

  watch: {
    url: function() {
      // When the URL changes...
      // update notBrowserSyncURL
      // this.syncSite()
    }
  },

  mounted() {
    const vm = this;

    vm.$nextTick().then(async function() {
      // Start our synchronization server
      const setup = await sync.startServer();
      console.log("setup", setup);

      // Fill in syncServer URL
      vm.syncServer = setup.proxy;
      console.log("sync server", vm.syncServer);
    });
  },

  methods: {
    async syncSite() {
      // Avoid cyclical server
      function compareHosts(url1, url2) {
        function returnHost(url) {
          var pathArray = url.split("/");
          var protocol = pathArray[0];
          var host = pathArray[2];
          return host;
        }

        const host1 = returnHost(url1);
        const host2 = returnHost(url2);

        console.log(host1, host2);

        if (host1 === host2) {
          return true;
        } else {
          return false;
        }
      }

      // Changes the BrowserSync proxy URL
      if (compareHosts(this.url, this.syncServer) === false) {
        // Trigger the NodeJS change
        // Send request to change the URL being proxied
        await sync.changeURL(this.url);

        // Update the global URL
        this.$store.commit("changeSiteData", {
          url: this.syncServer
        });

        console.log(this.syncServer);
        console.log(this.$store.state.site.url);
        return true;
      } else {
        console.log("Contains sync server", this.url, this.syncServer);
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/_variables";

#sync-button {
  background: #e0e0e0;
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding: 0 0.75rem;

  &:hover {
    cursor: pointer;
  }

  &.is-active {
    background: #d1cff5;
  }

  & > div {
    line-height: normal;
    vertical-align: baseline;

    img {
      display: inline-block;
    }
  }
}
</style>
