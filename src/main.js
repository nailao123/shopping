// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import lazy from 'vue-lazyload'
import  infiniteScoll from 'vue-infinite-scroll'




Vue.config.productionTip = false

Vue.use(infiniteScoll)


Vue.use(lazy,{
  loading: "/static/loading-svg/loading-spinning-bubbles.svg"
});

/* eslint-disable no-new */
new Vue({
 el: '#app',
  router,
  template: '<App/>',
  components: { App }
})//.$mount("#app") ;
