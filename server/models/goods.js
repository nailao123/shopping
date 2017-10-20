/**
 * Created by FranklinGao on 2017/8/26.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var productSchema= new Schema({
  "productId":{type:String},
  "productName":String,
  "salePrice":Number,
  "productImage":String,
  "productImage":String,
  "checked" :String,
  "productNum" :String,
});

module.exports=mongoose.model('Goods',productSchema);















