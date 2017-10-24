/**
 * Created by FranklinGao on 2017/8/26.
 */

var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
var Goods= require('../models/goods');

/*连接数据库*/
mongoose.connect('mongodb://127.0.0.1:27017/db_demo');

/*监听数据库是否链接成功*/
mongoose.connection.on("connected",function () {
  console.log("MongoDB connected success");
});

/*失败*/
mongoose.connection.on("error",function () {
  console.log("MongoDB connected fail");
});

/*断开链接*/
mongoose.connection.on("disconnected",function () {
  console.log("MongoDB connected disconnected");
});


/*链接router*/
router.get("/list",function (req,res,next) {
  /*获取分页页数*/
  let page=parseInt(req.param("page"));
  /*获取每一页显示的数量*/
  let pageSize =parseInt(req.param("pageSize"));

  let priceLevel=req.param("priceLevel");
  /*目的实现分页功能*/
  let sort =req.param("sort");

  let params={};
  /*priceLevel*/

  var prictGt ='';
  var priceLte='';

    if(priceLevel !='all'){
            switch(priceLevel){
              case '0':prictGt = 0;priceLte=100;break;
              case '1':prictGt = 100;priceLte=500;break;
              case '2':prictGt = 500;priceLte=1000;break;
              case '3':prictGt = 1000;priceLte=5000;break;
            }
          params ={
                salePrice:{
                  $gt:prictGt,
                  $lte:priceLte,

                }
           }

  }




  /*每页显示数目的计算*/
  let skip =(page-1)*pageSize;

  let goodsModel =Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});



  /*  res.send('hello,goods list')*/
  /*连接数据库的代码*/
  goodsModel.exec({},function (err,doc) {

    if (err){
      res.json({
        status:'1',
        msg:err.message,

      });
    }else{

      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      });
    }

  })



});


//加入购物车


router.post("/addCart",function (req,res,next) {
  var userId = '100000077';
  console.log("userId"+userId);
  var productId = req.body.productId;
  var User = require('../models/user');

    User.findOne({userId:userId},function (err,userDoc) {

      if(err){
        res.json({
            status:"1",
            msg:err.message
        })
      }else {
          console.log("userDoc:"+userDoc);
          if(userDoc){
            let  goodsItem ='';
            userDoc.cartList.forEach(function (item) {
                if(item.productId ==productId){
                      goodsItem=item;
                      item.productNum ++;
                }
            });

            if(goodsItem){

              userDoc.save(function (err2,doc2) {

                if(err2){
                  res.json({
                    status:"1",
                    msg:err2.message
                  })
                }else {
                  res.json({
                    status:'0',
                    msg:'',
                    result:'suc'

                  })

                }


              })


            }else{
              Goods.findOne({productId:productId},function (err1,doc) {

                if(err1){
                  res.json({
                    status:"1",
                    msg:err1.message
                  })
                }else {
                  if(doc){
                    doc.productNum ='1';  //该字段为商品数量
                    doc.checked ='1';   //该字段为是否选中
                    userDoc.cartList.push(doc);
                    userDoc.save(function (err2,doc2) {

                      if(err2){
                        res.json({
                          status:"1",
                          msg:err2.message
                        })
                      }else {
                        res.json({
                          status:'0',
                          msg:'',
                          result:'suc'

                        })

                      }


                    })

                  }
                }


              })

            }




          }



      }

    })


});





/*输出*/
module.exports=router;
























