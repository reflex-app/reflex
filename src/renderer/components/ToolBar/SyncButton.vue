<template>
  <div
    v-if="canSyncURL"
    id="sync-button"
    :class="{ 'is-active' : isOnSyncURL }"
    @click="syncSite()"
  >
    <Icon name="sync"/>
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
      return this.$store.state.history.currentPage.url;
    },
    canSyncURL() {
      // Not available when on http
      if (this.url.includes("http://")) {
        return false;
      } else {
        return true;
      }
    },
    isOnSyncURL() {
      // Show "active" state of button
      // when on the synced URL
      let siteHost = this.returnHost(this.url);
      let syncServerHost = this.returnHost(this.syncServer);

      if (syncServerHost && syncServerHost.includes(siteHost)) {
        return true;
      } else {
        return false;
      }
    }
  },

  mounted() {
    const vm = this;

    vm.$nextTick().then(async function() {
      // Start our synchronization server
      const setup = await sync.startServer();

      // Fill in syncServer URL
      vm.syncServer = setup.proxy;
    });
  },

  methods: {
    async syncSite() {
      // Avoid cyclical server
      function compareHosts(url1, url2) {
        const host1 = this.returnHost(url1);
        const host2 = this.returnHost(url2);

        console.log(host1, host2);

        if (host1 === host2) {
          return true;
        } else {
          return false;
        }
      }

      // Trigger the NodeJS change
      // Send request to change the URL being proxied
      const data = await sync.changeURL(this.url);

      // Update the global URL to the proxy URL
      // This will navigate to synced site via the proxy url
      this.$store.commit("changeSiteData", {
        url: data.proxy
      });

      // Update the sync server url locally
      this.syncServer = data.proxy;

      // console.log(this.syncServer);
      // console.log(this.$store.state.history.currentPage.url);

      // Changes the BrowserSync proxy URL
      // if (compareHosts(this.url, this.syncServer) === false) {
      //   return true;
      // } else {
      //   console.log("Contains sync server", this.url, this.syncServer);
      //   return false;
      // }
    },
    returnHost(url) {
      var pathArray = url.split("/");
      var protocol = pathArray[0];
      var host = pathArray[2];
      return host;
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
}
</style>
