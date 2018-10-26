// Required scripts
import Vue from './required/vue.dev';

Vue.component('artboard', {
  props: ['artboard'],
  template: `
    <!-- TODO: Add dynamic height/width style="height: {{artboard.height}}px; width: {{artboard.width}}px" -->
    <div class="artboard">
    <div class="artboard__top">
        <div>
            W: <span class="artboard__width">{{artboard.width}}</span>
            H: <span class="artboard__height">{{artboard.height}}</span>
        </div>
        <div class="artboard__loader">
            <div class="content">
                <div class="lds-ripple">
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
        <button class="button button--small artboard__delete-button" onclick="app.artboard.delete(event)">Delete</button>
    </div>
    <div class="artboard__keypoints"></div>
    <div class="artboard__content">
        <iframe src="" nwfaketop frameborder="0"></iframe>
        {{!-- <webview partition=”trusted”></webview> --}}
        <div class="artboard__handles">
            <div class="handle__bottom"></div>
        </div>
    </div>
    <div class="button-artboard-after">+</div>
</div>
  `
})

let app = new Vue({
  el: 'main',
  data: {
    artboards: [{
        id: 1,
        height: 400,
        width: 400
      },
      {
        id: 2,
        height: 400,
        width: 400
      },
      {
        id: 3,
        height: 400,
        width: 400
      }
    ]
  }
})

// // Create artboards
// require('../js/features/artboard/artboard');
// app.artboards = new Artboard('.artboard');
// console.log(app.artboards.update());
// // app.artboards.add("before", this, 500, 800);