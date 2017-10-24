import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from './../views/GoogsList.vue'
import Cart from './../views/Cart.vue'
import Address from './../views/Address.vue'
Vue.use(Router)

/*添加路游*/
export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/Cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    },


  ]
})
