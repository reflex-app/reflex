<template>
  <webview ref="frame" class="frame" />
</template>

<script>
import store from "@/store";
export default {
  props: ["preventInteractions"],
  computed: {
    url() {
      return store.state.history.currentPage.url; // Bind to our Vuex Store's URL value
    }
  },
  mounted() {
    const vm = this;

    // Once the WebView is rendered
    this.$nextTick(() => {
      // Permament events
      const frame = vm.$refs.frame;
      frame.addEventListener("will-navigate", this.willNavigate); // NOTE This listener is not removed upon loading! Needs to be removed if component is destroyed

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
  beforeDestroy() {
    // Remove navigation event
    const frame = this.$refs.frame;
    frame.removeEventListener("will-navigate", this.willNavigate);
  },
  watch: {
    url: {
      // When the URL is changed, load the new site
      handler: function() {
        this.loadSite();
      }
    },
    preventInteractions: function(value) {
      // Toggle frame pointer-events based on the isSelected artboard state
      const element = this.$refs.frame;
      if (value == false) {
        element.style.pointerEvents = "none";
      } else if (value == true) {
        element.style.pointerEvents = "auto";
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
      const vm = this;
      const frame = this.$refs.frame;

      // When loading of webview starts
      function loadstart() {
        vm.$emit("loadstart"); // Show loading spinner

        // Change the title to Loading...
        // TODO Add a VueX action for this?
        store.commit("changeSiteData", {
          title: "Loading..."
        });
      }

      // Initialize the event listeners
      addListeners();

      // Set the URL, start loading
      frame.setAttribute("src", this.url);

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
        store.commit("changeSiteData", {
          title: title,
          favicon: favicon
        });

        window.removeEventListener("message", receiveHandshake);
      }

      // Loading has finished
      function loadstop() {
        vm.$emit("loadend"); // Hide loading spinner

        // Update History
        // TODO Put this in a more obvious place
        store.commit("updateHistory", frame.getWebContents().history); // Array with URLs

        // Remove the event listeners related to site loading
        removeListeners();
      }

      function loadabort() {
        // @TODO: Update with Electron API
        new Notification("Aborted", {
          body: "The site stopped loading for some reason."
        });
      }

      // Bind events
      function addListeners() {
        frame.addEventListener("did-start-loading", loadstart); // loadstart
        frame.addEventListener("dom-ready", contentloaded); // contentload
        frame.addEventListener("did-stop-loading", loadstop); // loadstop
        frame.addEventListener("loadabort", loadabort); // loadabort
        window.addEventListener("message", receiveHandshake, false); // Listen for response
      }

      // Remove all event listeners
      function removeListeners() {
        frame.removeEventListener("did-start-loading", loadstart);
        frame.removeEventListener("dom-ready", contentloaded);
        frame.removeEventListener("did-stop-loading", loadstop);
        frame.removeEventListener("loadabort", loadabort);
      }
    },
    willNavigate(event) {
      // Handle user clicking on a link inside of the webview
      // TODO This should add a new page to the History
      // TODO Add to VueX Action
      store.commit("changeSiteData", {
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
  pointer-events: none;
}
</style>