<template>
  <div id="sync-panel">
    <div
      v-if="notBrowserSyncURL"
      class="panel-section"
    >
      <div>Synchronize scrolls, clicks, and form inputs across your screens.</div>
      <div
        class="button"
        @click="syncSite()"
      >
        Sync this Website
      </div>
      <!-- <div class="button" @click="browserSyncGetProxy()">Visit Existing Sync URL</div> -->
    </div>
    <div
      v-else
      class="panel-section"
    >
      <p>You are currently on a synced URL. Interactions on this domain will be synchronized across screen sizes.</p>
      <p>To synchronize a new site, visit another URL and then click Sync.</p>
    </div>
  </div>
</template>

<script>
// Synchronization server
import * as electron from 'electron'
import * as sync from '../../mixins/sync.js'

const currentWindow = electron.remote.getCurrentWindow()

export default {
  name: 'SyncPanel',

  data() {
    return {
      syncServer: ''
    }
  },

  computed: {
    url() {
      // Bind to our Vuex Store's URL value
      return this.$store.state.site.url
    },
    notBrowserSyncURL() {
      // Provides simple logic for when to
      // show/hide the "Sync" button
      if (this.url !== this.syncServer) {
        return true
      } else {
        return false
      }
    }
  },

  watch: {
    url: function() {
      // When the URL changes...
      // update notBrowserSyncURL
    }
  },

  mounted() {
    const vm = this

    vm.$nextTick().then(async function() {
      // Start our synchronization server
      const setup = await sync.startServer()
      console.log('setup', setup)

      // Fill in syncServer URL
      vm.syncServer = setup.proxy
      console.log('sync server', vm.syncServer)
    })
  },

  methods: {
    async syncSite() {
      // Avoid cyclical server
      function compareHosts(url1, url2) {
        function returnHost(url) {
          var pathArray = url.split('/')
          var protocol = pathArray[0]
          var host = pathArray[2]
          return host
        }

        const host1 = returnHost(url1)
        const host2 = returnHost(url2)

        console.log(host1, host2)

        if (host1 === host2) {
          return true
        } else {
          return false
        }
      }

      // Changes the BrowserSync proxy URL
      if (compareHosts(this.url, this.syncServer) === false) {
        // Trigger the NodeJS change
        // Send request to change the URL being proxied
        await sync.changeURL(this.url)

        // Update the global URL
        this.$store.commit('changeSiteData', {
          url: this.syncServer
        })

        console.log(this.$store.state.site.url)
      } else {
        console.log('Contains sync server', this.url, this.syncServer)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../scss/_variables";

#sync-panel {
  .button {
    margin-top: 1rem;
  }
}
</style>
