<template>
  <div class="empty-state">
    <img src="@/assets/ftu-vector.svg" class="empty-state__image" alt="Welcome graphic" />
    <span class="empty-state__title">Welcome to {{ appName }}</span>
    <p class="empty-state__body">You’re on your way to making awesome responsive sites.</p>
    <div>New to {{appName}}? Scroll down.</div>
    <section class="text-section-centered">
      <p>This is a canvas, which is great for showing lots of screens. You can pan around, and zoom in/out.</p>
      <br />
      <h4>Try panning and zooming now:</h4>
      <div class="keyboard-command">
        <strong>Pan:</strong>
        <div class="keyboard-key">Space</div>
        <span>+</span>
        <span>Left Mouse</span>
      </div>
      <div class="keyboard-command">
        <strong>Zoom:</strong>
        <div class="keyboard-key">{{systemMetaKeyName}}</div>
        <span>+</span>
        <span>Scroll</span>
      </div>
      <br />
      <p>Using a trackpad?</p>
      <p>Pinch to zoom in/out, and use two fingers to pan.</p>
    </section>
    <section class="grid-2-up">
      <div>
        <h3>Screens</h3>
        <p>You can easily see how your site will look at a specific size by using Screens.</p>
        <p>Create new Screens in the Screens panel on the left.</p>
        <p>Tip: use at least 2-3 Screens. You can also create screen sizes from common front-end libraries, like Bootstrap and Foundation using the "Add from template" dropdown.</p>
      </div>
      <!-- <div>IMAGE HERE</div> -->
    </section>
    <section class="grid-2-up">
      <div>
        <h3>Synchronizing Screens</h3>
        <p>Enable the Sync toggle to synchronize clicks, scrolling, and other events across all of your Screens.</p>
        <p>There’s no better way to see how your site will work at different sizes.</p>
        <p>NOTE: Currently only supports HTTPS websites.</p>
      </div>
      <!-- <div>IMAGE HERE</div> -->
    </section>
    <section class="grid-2-up">
      <div>
        <h3>Taking Screenshots</h3>
        <p>You can easily take responsive screenshots right from {{ appName }}.</p>
        <p>Drag to select which screens on the canvas you want, and then either save them as images, or copy to clipboard.*</p>
        <p>*Copy to clipboard only supports one Screen at a time.</p>
      </div>
      <!-- <div>IMAGE HERE</div> -->
    </section>
    <section class="text-section-centered">
      <h3>Thanks for using {{ appName }}!</h3>
      <p>{{ appName }} is a free, open-source project, maintained by the web community to make a better web experience for everyone.</p>
      <p>
        Interested in learning about making responsive websites, or letting us know how much you enjoy using {{ appName }}? We’re
        <a
          href="https://twitter.com/reflex_app"
        >@reflex_app</a> on Twitter.
      </p>
      <a href="https://reflexapp.nickwittwer.com">reflexapp.nickwittwer.com</a>
    </section>
  </div>
</template>

<script>
import { remote } from "electron";
export default {
  computed: {
    appName() {
      // Return the name of the Electron app
      // From package.json (name or productName)
      // TODO this if check is required in case of tests
      if (remote) {
        return remote.app.getName();
      } else {
        const pkgJson = require("../../../../package.json");
        return pkgJson.productName;
      }
    },
    systemMetaKeyName() {
      // Show "CMD" or "CTRL" based on the user's OS
      if (process.platform === "darwin") {
        return "CMD";
      } else {
        return "CTRL";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.empty-state {
  height: 100%;
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .empty-state__image {
    margin-bottom: 2rem;
  }

  .empty-state__title {
    font-size: 1.6rem;
  }

  .empty-state__body {
    line-height: 1.5;
    max-width: 250px;
    text-align: center;
  }
}

section {
  margin-top: 20vh;
}

.keyboard-command {
  margin-bottom: 1rem;
}

.keyboard-key {
  padding: 1rem 1.5rem 0.3rem 0.5rem;
  background: white;
  border: 1px solid #b3b3b3;
  display: inline-block;
  font-size: 0.8rem;
  border-radius: 4px;
}

.grid-2-up {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.text-section-centered {
  text-align: center;
  max-width: 30rem;
}
</style>