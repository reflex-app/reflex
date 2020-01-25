import { configure } from '@storybook/vue';

import Vue from 'vue';

// Import Vue plugins
import Vuex from 'vuex';

// Import & register global components.
import sharedComponents from '../src/renderer/plugins/globalComponents.js'

// Import global SCSS
import '../src/renderer/scss/_global.scss'

// Install Vue plugins.
Vue.use(Vuex);

configure(require.context('./stories', true, /\.stories\.js$/), module);