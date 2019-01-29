<template>
  <div id="sync-panel">
    <div class="panel-section" v-if="notBrowserSyncURL">
      <div>Synchronize scrolls, clicks, and form inputs across your screens.</div>
      <div class="button"  @click="browserSyncChangeProxy()">Sync this Website</div>
      <div class="button" @click="browserSyncGetProxy()">Visit Existing Sync URL</div>
    </div>
    <div class="panel-section" v-else>
      <p>You are currently on a synced URL. Interactions on this domain will be synchronized across screen sizes.</p>
      <p>To synchronize a new site, visit another URL and then click Sync.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SyncPanel',

  data () {
    return {}
  },

  computed: {
    url () {
      // Bind to our Vuex Store's URL value
      return this.$store.state.site.url
    },
    notBrowserSyncURL () {
      // @TODO: Rewrite NW functions into Electron

      // Provides simple logic for when to
      // show/hide the "Sync" button

      // const currentURL = this.url
      // const nw = window.nw

      // if (currentURL !== nw.global.browserSync) {
      //   return true
      // } else {
      //   return false
      // }
    },
    browserSyncURL () {
      // @TODO: Rewrite NW functions into Electron
      // const nw = window.nw
      // return nw.global.browserSync
    }
  },

  methods: {
    browserSyncGetProxy () {
      // Updates the UI URL to the BrowserSync proxy's URL
      const nw = window.nw
      this.$store.commit('changeSiteData', {
        url: nw.global.browserSync
      })
    },
    async browserSyncChangeProxy () {
      if (window.nw) {
        // Changes the BrowserSync proxy URL
        const currentURL = this.url
        const nw = window.nw

        if (currentURL !== nw.global.browserSync) {
          // Trigger the NodeJS change
          await nw.process.mainModule.exports.changeProxyURL(currentURL)

          // Update URL
          this.$store.commit('changeSiteData', {
            url: nw.global.browserSync
          })

          console.log(this.$store.state.site.url)
        } else {
          // Prevent an endless BrowserSync URL loop
          // var notification = new Notification('Notification Title', {
          //   body: 'Cannot sync the sync URL.'
          // })
        }
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