<template>
  <webview ref="frame" class="frame" :preload="injectScript" allowpopups />
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    allowInteractions: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  computed: {
    ...mapState({
      url: state => state.history.currentPage.url
    }),
    injectScript() {
      const appPath = require("electron").remote.app.getAppPath();
      return `file://${require("path").resolve(
        __dirname,
        "../../mixins/injectWebPageScript.js"
      )}`;
    }
  },
  mounted() {
    const vm = this;

    // Once the WebView is rendered
    this.$nextTick(() => {
      // Permament events
      const frame = vm.$refs.frame;

      // Bind event listeners
      this.bindEventListeners();

      // Load the <webview> the initial time
      this.loadSite();

      // Watch for History actions
      // TODO Better way to watch for VueX actions?
      this.unsubscribeAction = this.$store.subscribeAction((action, state) => {
        switch (action.type) {
          case "history/reload":
            this.reload();
            break;

          case "history/back":
            this.back();
            break;

          case "history/forward":
            this.forward();
            break;

          default:
            break;
        }
      });
    });
  },
  beforeDestroy() {
    // Unbind any listeners
    this.unbindEventListeners();

    // Unsubscribe from Store
    this.unsubscribeAction();
  },
  watch: {
    url: {
      // When the URL is changed, load the new site
      handler: function() {
        this.loadSite();
      }
    },
    allowInteractions: function(value) {
      // Toggle frame pointer-events
      const element = this.$refs.frame;
      if (value === true) {
        element.style.pointerEvents = "auto"; // Allow interacting with webpage
      } else if (value === false) {
        element.style.pointerEvents = "none"; // Disable interactions with webpage
      }
    }
  },
  methods: {
    bindEventListeners() {
      // Remove navigation event
      const frame = this.$refs.frame;
      frame.addEventListener("will-navigate", this.willNavigate);
    },
    unbindEventListeners() {
      // Remove navigation event
      const frame = this.$refs.frame;
      frame.removeEventListener("will-navigate", this.willNavigate);
    },
    reload() {
      // Reload the current page
      this.loadSite({
        history: false
      });
    },
    back() {
      // Load the previous page
      const frame = this.$refs.frame;

      // VueX
      const pages = this.$store.state.history.pages;
      const currentPage = this.$store.state.history.currentPage.index;
      const nextPage = this.$store.state.history.currentPage.index - 1;
      // frame.loadURL(pages[nextPage]);

      // Update the URL in the store
      this.$store.commit("history/changeSiteData", {
        url: pages[nextPage]
      });

      // TODO Improve the way new pages are loaded
      // to take into account the history state
      // i.e. something like this:
      // store.dispatch("loadNewSite", "site.com")
    },
    forward() {
      // Load the next page
      const frame = this.$refs.frame;

      // VueX
      const pages = this.$store.state.history.pages;
      const currentPage = this.$store.state.history.currentPage.index;
      const nextPage = this.$store.state.history.currentPage.index + 1;
      // frame.loadURL(pages[nextPage]);

      // Update the URL in the store
      this.$store.commit("history/historychangeSiteData", {
        url: pages[nextPage]
      });

      // TODO Improve the way new pages are loaded
      // to take into account the history state
      // i.e. something like this:
      // store.dispatch("loadNewSite", "site.com")
    },
    /**
     * Loads a site
     * By default, saves the URL to the history
     * @param {object} options Accepts a history option. When true, will save URL to history.
     */
    loadSite(options = { history: true }) {
      const vm = this;
      const frame = this.$refs.frame;

      // The frame has been destroyed
      // Remove event listeners
      if (!frame) {
        throw new Error(
          "Frame listeners still active after component destroy."
        );
        removeListeners();
        return false;
      }

      // Initialize the event listeners
      addListeners();

      // Set the URL, start loading
      frame.setAttribute("src", this.url);

      // Bind events
      function addListeners() {
        frame.addEventListener("did-start-loading", loadstart); // loadstart
        frame.addEventListener("dom-ready", contentloaded); // contentload
        frame.addEventListener("did-stop-loading", loadstop); // loadstop
        frame.addEventListener("ipc-message", receiveHandshake); // Listen for response

        // The following will trigger a removal of the IPC listener
        // frame.addEventListener("will-navigate", loadabort); // loadabort
        frame.addEventListener("loadabort", loadabort); // loadabort
      }

      // Remove all event listeners
      function removeListeners() {
        frame.removeEventListener("did-start-loading", loadstart);
        frame.removeEventListener("dom-ready", contentloaded);
        frame.removeEventListener("did-stop-loading", loadstop);
        frame.removeEventListener("ipc-message", receiveHandshake);

        // IPC-related listeners
        // frame.removeEventListener("will-navigate", loadabort);
        frame.removeEventListener("loadabort", loadabort);
      }

      // When loading of webview starts
      function loadstart() {
        vm.$emit("loadstart"); // Show loading spinner

        // Change the title to Loading...
        // TODO Add a VueX action for this?
        vm.$store.commit("history/changeSiteData", {
          title: "Loading..."
        });
      }

      // Once webview content is loaded
      // Request its data
      function contentloaded() {
        frame.send("requestData");
      }

      function receiveHandshake(event) {
        // Data is accessible as event.data.*
        // Refer to the object that's injected during contentload()
        // for all keys
        if (event.channel !== "replyData") return false;

        const returnedData = event.args[0];
        const title = returnedData.title;
        const favicon = returnedData.favicon;

        console.log(returnedData);

        // TODO Add to VueX Action
        vm.$store.commit("history/changeSiteData", {
          title: title,
          favicon: favicon
        });

        // Remove listeners once data has been received
        // TODO Allow streaming until page is changed/reloaded
        removeListeners();
      }

      // Loading has finished
      function loadstop() {
        vm.$emit("loadend"); // Hide loading spinner

        // Update History
        // TODO Put this in a more obvious place
        if (!options.history && options.history == false) {
          vm.$store.commit(
            "history/updateHistory",
            frame.getWebContents().history
          ); // Array with URLs
        }
      }

      function loadabort() {
        // @TODO: Update with Electron API
        new Notification("Aborted", {
          body: "The site stopped loading for some reason."
        });

        // Remove the event listeners related to site loading
        removeListeners();
      }
    },
    willNavigate(event) {
      // Handle user clicking on a link inside of the webview
      // TODO This should add a new page to the History
      // TODO Add to VueX Action
      this.$store.commit("history/changeSiteData", {
        url: event.url
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.frame {
  height: 100%;
  width: 100%;
  pointer-events: none; // Don't allow by default
}
</style>