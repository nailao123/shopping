var express = require('express');
var router = express.Router();
var User =require('./../models/user');




/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//登录接口
router.post("/login", function (req,res,next) {
  var param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  User.findOne(param, function (err,doc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message
      });
    }else{
      if(doc){
        //通过cookie将用户名存储到浏览器中
        res.cookie("userId",doc.userId,{
          path:'/', //存储的路径
          maxAge:1000*60*60  //缓存时间
        });

        res.cookie("userName",doc.userName,{
          path:'/', //存储的路径
          maxAge:1000*60*60  //缓存时间
        });
      //  req.session.user = doc;  //将缓存存储到session回话中
        res.json({
          status:'0',
          msg:'',
          result:{
            userName:doc.userName
          }
        });
      }
    }
  });
});
//登出接口
router.post("/logout", function (req,res,next) {
  res.cookie("userId","",{
    path:"/",
    maxAge:-1
  });
  res.cookie("userName","",{
    path:"/",
    maxAge:-1
  });
  res.json({
    status:"0",
    msg:'',
    result:''
  })
});
//校验拿到用户信息
/*主要是通过对缓存的处理达到目的*/
router.get( "/checkLogin",function (req,res,next) {
    if(req.cookies.userId){
      res.json({
        status:'0',
        msg:'',
        result:req.cookies.userName || ''
      });
    }else {
      res.json({
        status:'1',
        msg:'未登录',
        result:'',
      });
    }
  }
);


/*
*查询当前用户的购物车数据
* 1.需要通过cookies获取当前用户数据
*
*
*
*
* */
router.get('/cartList',function (req,res,next) {
    var userId =req.cookies.userId;

    User.findOne({userId:userId},function (err,doc) {
        if (err){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          });
        }else{
          if (doc){

            res.json({
              status:'0',
              msg:'',
              result: doc.cartList
            });
          }

      }

    });

});
/*
* 定义购物车的删除功能
*
* 1.通过session获取用户id
* 2.获取商品id  通过req获取用户前台传递过要删除的商品id
* 3.通过调用MogoDB数据库aip提供的User.update
*
* */

router.post('/cartDel',function (req,res,next) {
       var userId =req.cookies.userId;productId=req.body.productId;

       User.update({
         userId:userId
       },{
         $pull:{
           'cartList':{'productId':productId
            }
          }
       },function (err,doc) {

         if(err){
           res.json({
             status:'1',
             msg:err.message,
             result:'',
           })
         }else {
           res.json({
             status:'0',
             msg:'',
             result:'suc  ',
           })
         }

       });

});

/*
* 购物车的修改
* 1.首先通过session获取用户id
* 2.获取商品数量
*
* */

router.post('/cartEdit',function (req,res,next) {

    var userId=req.cookies.userId,
      productId=req.body.productId,
      productNum=req.body.productNum,
      checked=req.body.checked;
    User.update({"userId":userId,"cartList.productId":productId},{
      "cartList.$.productNum":productNum,
      "cartList.$.checked":checked,
      }, function (err,doc){
          if(err){
            res.json({
              status:'1',
              msg:err.message,
              result: ''
            });
          }else {
              res.json({
                status:'0',
                msg:'',
                result: 'suc'
              });
          }
        })
});

/*
*购物车的修改
*
* 1.首先需要通过缓存获得用户的id 和购物车中商品的选中状态
* 2.调用接口将数据与数据库链接
* 3.遍历用户下面的子文档进行保存
* */
router.post("/editCheckAll", function (req,res,next) {
  var userId = req.cookies.userId,
    checkAll = req.body.checkAll?'1':'0';
  User.findOne({userId:userId}, function (err,user) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(user){
        user.cartList.forEach((item)=>{
          item.checked = checkAll;
        })
        user.save(function (err1,doc) {
          if(err1){
            res.json({
              status:'1',
              msg:err1,message,
              result:''
            });
          }else{
            res.json({
              status:'0',
              msg:'',
              result:'suc'
            });
          }
        })
      }
    }
  });
});

/**
 * 定义查询用户地址接口
 * 1.根据缓存cookies中用户id进行查询
 * 2.通过User.findOne()方式查询数据库
 * 3.http://localhost:3000/users/addressList 接口自测 查看是否能查到数据
 */

router.get('/addressList',function (req,res,next) {

  var userId = req.cookies.userId;
    User.findOne({userId:userId}, function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        res.json({
          status:'0',
          msg:'',
          result:doc.addressList
        });
      }
    })
});

/**
 * 定义修改默认地址接口
 *1.首先需要获取cookies中的userid
 *
 *
 */
//设置默认地址接口
router.post("/setDefault", function (req,res,next) {
  var userId = req.cookies.userId,
    addressId = req.body.addressId;
  if(!addressId){
    res.json({
      status:'1003',
      msg:'addressId is null',
      result:''
    });
  }else{
    User.findOne({userId:userId}, function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        var addressList = doc.addressList;
        addressList.forEach((item)=>{
          if(item.addressId ==addressId){
            item.isDefault = true;
          }else{
            item.isDefault = false;
          }
        });

        doc.save(function (err1,doc1) {
          if(err){
            res.json({
              status:'1',
              msg:err.message,
              result:''
            });
          }else{
            res.json({
              status:'0',
              msg:'',
              result:''
            });
          }
        })
      }
    });
  }
});
/**
* 删除地址的接口
 *1.首先需要拿到用户id和地址id userid and addressid
 *
*/

router.post('/delAddress', function (req,res,next) {
      var userId=req.cookies.userId,addressId=req.body.addressId
    User.update({
      userId:userId
    },{
      $pull:{
        'addressList':{
          'addressId':addressId
        }
      }
    }, function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        res.json({
          status:'0',
          msg:'',
          result:''
        });
      }
    });
  });
module.exports = router;
