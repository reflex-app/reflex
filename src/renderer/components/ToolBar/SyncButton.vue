<template>
  <div
    v-if="canSyncURL"
    id="sync-button"
    :class="{ 'is-active': isOnSyncURL }"
    @click="syncSite()"
  >
    <Icon name="sync" />
  </div>
</template>

<script>
// Synchronization server
import { mapState } from 'vuex'
import * as sync from '../../mixins/sync'

export default {
  name: 'SyncButton',
  data() {
    return {
      syncServer: '',
    }
  },
  computed: {
    ...mapState({
      url: (state) => state.history.currentPage.url,
    }),
    canSyncURL() {
      // Not available when on http
      // if (this.url.includes("http://")) {
      //   return false;
      // } else {
      //   return true;
      // }
      return true
    },
    isOnSyncURL() {
      // Show "active" state of button
      // when on the synced URL
      const siteHost = this.returnHost(this.url)
      const syncServerHost = this.returnHost(this.syncServer)

      if (syncServerHost && syncServerHost.includes(siteHost)) {
        return true
      } else {
        return false
      }
    },
  },
  mounted() {
    const vm = this

    vm.$nextTick().then(async function () {
      // Start our synchronization server
      const setup = await sync.startServer()

      // Fill in syncServer URL
      vm.syncServer = setup.proxy
    })
  },
  methods: {
    async syncSite() {
      if (this.compareHosts(this.url, this.syncServer) === true) {
        alert(
          `You're currently viewing the synced server URL. If your screens are out of sync, visit the original URL and sync it again.`
        )
        return false
      } else {
        // Trigger the NodeJS change
        // Send request to change the URL being proxied
        const data = await sync.changeURL(this.url)

        // Update the global URL to the proxy URL
        // This will navigate to synced site via the proxy url
        this.$store.commit('history/changeSiteData', {
          url: data.proxy,
        })

        // Update the sync server url locally
        this.syncServer = data.proxy
      }
    },
    compareHosts(url1, url2) {
      const host1 = this.returnHost(url1)
      const host2 = this.returnHost(url2)

      if (host1 === host2) {
        return true
      } else {
        return false
      }
    },
    returnHost(url) {
      const pathArray = url.split('/')
      // const protocol = pathArray[0]
      const host = pathArray[2]
      return host
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/_variables';

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
