import Vue from 'vue'
import VueRouter from 'vue-router'
import VueScrollTo from 'vue-scrollTo';

// Greenhouse's own JS API added in index.html
Grnhse.Settings.scrollOnLoad = false; // turn off default scroll behaviour

Vue.use(VueRouter);
Vue.use(VueScrollTo);

import router from './routes.js';

new Vue({
  el: '#app',
  router
});