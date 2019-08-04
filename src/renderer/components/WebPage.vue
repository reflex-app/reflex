<template>
  <webview ref="frame" class="frame" />
</template>

<script>
import store from "@/store";
export default {
  props: ["preventInteractions"],
  data() {
    return {
      state: {
        isLoading: false
      }
    };
  },
  computed: {
    url() {
      return store.state.history.currentPage.url; // Bind to our Vuex Store's URL value
    }
  },
  mounted() {
    this.$nextTick(() => {
      // Load the <webview> the initial time
      this.loadSite();

      // Watch for History actions
      store.subscribeAction((action, state) => {
        console.log(action.type);
        // console.log(action.payload);

        switch (action.type) {
          case "reload":
            this.reload();
            break;

          case "back":
            this.back();
            break;

          case "forward":
            this.forward();
            break;

          default:
            break;
        }
      });
    });
  },
  watch: {
    preventInteractions: function(value) {
      // Toggle frame pointer-events based on the isSelected artboard state
      const element = this.$refs.frame;
      if (value == false) {
        element.style.pointerEvents = "none";
      } else if (value == true) {
        element.style.pointerEvents = "auto";
      }
    },
    url: {
      // When the URL is changed, do this:
      handler: function() {
        this.loadSite();
      }
    }
  },
  methods: {
    reload() {
      // Reload the current page
      // TODO This doesn't trigger the loading indicator
      const frame = this.$refs.frame;
      frame.getWebContents().reload();
    },
    back() {
      // Load the previous page
      const frame = this.$refs.frame;

      // VueX
      const pages = store.state.history.pages;
      const currentPage = store.state.history.currentPage.index;
      const nextPage = store.state.history.currentPage.index - 1;
      // frame.loadURL(pages[nextPage]);

      // Update the URL in the store
      store.commit("changeSiteData", {
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
      const pages = store.state.history.pages;
      const currentPage = store.state.history.currentPage.index;
      const nextPage = store.state.history.currentPage.index + 1;
      // frame.loadURL(pages[nextPage]);

      // Update the URL in the store
      store.commit("changeSiteData", {
        url: pages[nextPage]
      });

      // TODO Improve the way new pages are loaded
      // to take into account the history state
      // i.e. something like this:
      // store.dispatch("loadNewSite", "site.com")
    },
    loadSite() {
      const _this = this;
      const frame = _this.$refs.frame;

      // When loading of webview starts
      function loadstart() {
        _this.state.isLoading = true; // Show loading spinner

        // Change the title to Loading...
        // TODO Add a VueX action for this?
        _this.$store.commit("changeSiteData", {
          title: "Loading..."
        });
      }

      // Initialize the event listeners
      addListeners();

      // Set the URL
      frame.setAttribute("src", this.url);

      // Remove permanent listeners
      this.$once("hook:beforeDestroy", function() {
        frame.removeEventListener("will-navigate", willNavigate);
      });

      // Once webview content is loaded
      function contentloaded() {
        const execCode = `
          // Define the content from inside the page to return
          let data = {
            title: document.title,
            favicon: "https://www.google.com/s2/favicons?domain=" +
              window.location.href
          }

          // Listen for the incoming message & respond with data object
          window.addEventListener("message", () => {
            event.source.postMessage(data, '*');
          }, false);
        `;

        // Execute
        frame.executeJavaScript(execCode, function() {
          // After successfully injecting...
          // Request the data
          frame.contentWindow.postMessage("Send me your data!", "*");
        });
      }

      function receiveHandshake(event) {
        // Data is accessible as event.data.*
        // Refer to the object that's injected during contentload()
        // for all keys
        const title = event.data.title;
        const favicon = event.data.favicon;

        // TODO Add to VueX Action
        _this.$store.commit("changeSiteData", {
          title: title,
          favicon: favicon
        });

        window.removeEventListener("message", receiveHandshake);
      }

      // Loading has finished
      function loadstop() {
        _this.state.isLoading = false; // Hide loading spinner

        // Update History
        // TODO Put this in a more obvious place
        _this.$store.commit("updateHistory", frame.getWebContents().history); // Array with URLs

        removeListeners();
      }

      function loadabort() {
        // @TODO: Update with Electron API
        new Notification("Aborted", {
          body: "The site stopped loading for some reason."
        });
      }

      // Handle user clicking on a link inside of the webview
      // TODO This should add a new page to the History
      // TODO This should trigger the loading indicator
      function willNavigate(event, url) {
        console.log("loading new url", event, event.url);
      }

      // Bind events
      function addListeners() {
        // Loading events
        frame.addEventListener("did-start-loading", loadstart); // loadstart
        frame.addEventListener("dom-ready", contentloaded); // contentload
        frame.addEventListener("did-stop-loading", loadstop); // loadstop
        frame.addEventListener("loadabort", loadabort); // loadabort
        window.addEventListener("message", receiveHandshake, false); // Listen for response

        // Permament events
        frame.addEventListener("will-navigate", willNavigate); // NOTE This listener is not removed upon loading! Needs to be removed if component is destroyed
      }

      // Remove all event listeners related to loading
      function removeListeners() {
        frame.removeEventListener("did-start-loading", loadstart);
        frame.removeEventListener("dom-ready", contentloaded);
        frame.removeEventListener("did-stop-loading", loadstop);
        frame.removeEventListener("loadabort", loadabort);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.frame {
  height: 100%;
  width: 100%;
  pointer-events: none;
}
</style>