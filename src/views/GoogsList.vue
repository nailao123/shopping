<template>
  <div>

    <nav-header></nav-header>

    <nav-bread>
      <span>Goods</span>
    </nav-bread>

    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a @click="sortGoods" href="javascript:void(0)" class="price">Price
          <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':!sortFlag}">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-short"></use>
          </svg>
        </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
      </div>
      <div class="accessory-result">
        <!-- filter -->
        <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
          <dl class="filter-price">
            <dt>价格:</dt>
            <dd><a href="javascript:void(0)"  @click="priceChecked=all" v-bind:class="{'cur':priceChecked=='all'}">全部</a></dd>
          <dd v-for="(price,index) in priceFilter" >
            <a href="javascript:void(0)"  @click="setPriceFilter(index)"   v-bind:class="{'cur':priceChecked==index}">{{price.startPrice}}- {{price.endPrice}}</a>
        </dd>

      </dl>
    </div>

    <!-- search result accessories list -->
    <!--   <a href="#"><img  v-lazy:src="'/static/'+item.productImage" alt=""></a> -->
    <div class="accessory-list-wrap">
      <div class="accessory-list col-4">
        <ul>
          <li v-for="item in goodsList">
            <div class="pic">
              <a href="#"><img  v-bind:src="'/static/'+item.productImage" v-bind:alt="item.productName"></a>

            </div>
            <div class="main">
              <div class="name">{{item.productName}}</div>
              <div class="price">￥{{item.salePrice}}</div>
              <div class="btn-area">
                <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
              </div>
            </div>
          </li>
        </ul>
        <!--滚动插件-->
        <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                <img src="./../assets/loading/loading-spinning-bubbles.svg" v-show="loading" />
        </div>


      </div>
    </div>
  </div>
</div>
</div>
<div class="md-overlay  " v-show="overLayFlag" @click="closePop"  ></div>
/*实现模态框使用*/
<modal v-bind:mdShow="mdShow" v-on:close="closeModal">
  <p slot="message">
    请先登录,否则无法加入到购物车中!
  </p>
  <div slot="btnGroup">
    <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
</div>
</modal>
<modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
  <p slot="message">
    <svg class="icon-status-ok">
      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
    </svg>
    <span>加入购物车成!</span>
  </p>
  <div slot="btnGroup">
    <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
  <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
</div>
</modal>
<nav-footer></nav-footer>
</div>
</template>


<script>
  import './../assets/css/base.css'
  import './../assets/css/product.css'
  import './../assets/css/login.css'
  import NavHeader from '@/components/Header.vue'
  import NavFooter from '@/components/NavFooter.vue'
  import NavBread from '@/components/NavBread.vue'
  import Modal from './../components/Modal'   //导入模态框 使用组件必须将他加入到conmponents中
  import axios from 'axios'
  export default{
  data(){
  return {
  goodsList:[],
  sortFlag:true,
  page:1,
  pageSize:8,
  busy:true,
  mdShowCart:false,
  mdShow:false,
  loading:false,



  priceFilter:[
{
  startPrice:'0',
  endPrice:'100'
},
{
  startPrice:'100',
  endPrice:'500'
},
{
  startPrice:'500',
  endPrice:'1000'
},
{
  startPrice:'1000',
  endPrice:'5000'
}


  ],
  priceChecked:'all',
  filterBy:false,
  overLayFlag:false,
}
},
  components:{
  NavHeader:NavHeader,
  NavFooter:NavFooter,
  NavBread:NavBread,
  Modal
},

  mounted:function(){
  this.getGoodsList();


},
  methods:{
        getGoodsList(flag){
          var param={
            page:this.page,
            pageSize:this.pageSize,
            sort:this.sortFlag?1:-1,
             priceLevel:this.priceChecked,

}
          this.loading=true;
        axios.get("/goods/list",{
          params:param
        }).then((response)=>{
                let res=response.data;
                 this.loading=false;
                if(res.status=="0"){
                  if(flag){
                            this.goodsList=this.goodsList.concat(res.result.list);
                                        if(res.result.count==0){
                                             this.busy=true;
                                          }else{
                                            this.busy=false;
                                          }
                          }else{
                             this.busy=false;
                            this.goodsList=res.result.list;

                           }
              }else{
                this.goodsList=[];
              }
              });


},
  sortGoods(){
  this.sortFlag= !this.sortFlag;
  this.page=1;
  this.getGoodsList();

},

  loadMore(){
    this.busy=true;

  setTimeout(() => {
  this.page++;
  this.getGoodsList(true);
}, 500);


},




  showFilterPop(){
  this.filterBy=true;
  this.overLayFlag=true;

},
  setPriceFilter(index){
  this.priceChecked=index;
  this.page=1;
  this.getGoodsList();
},

  closePop(){
  this.filterBy=false;
  this.overLayFlag=false;

},

  addCart(productId){
      axios.post("/goods/addCart",{
        productId:productId
      }).then((res)=>{
        var res = res.data;
          console.log("res.status");
          if(res.status==0){
           this.mdShowCart= true;
        }else{
       // alert("msg:"+res.msg);
          this.mdShow= true;
      }
    });
   },
    closeModal(){
    this.mdShow = false;
    this.mdShowCart=false;

  },


  }
}
</script>
