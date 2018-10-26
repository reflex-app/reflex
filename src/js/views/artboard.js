import Vue from '../required/vue.dev';

export default Vue.component('artboard', {
    props: ['artboard'],
    template: `
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
  });