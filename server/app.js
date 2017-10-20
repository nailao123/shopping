var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
/*商品routes*/
var goods =require('./routes/goods');

var index = require('./routes/index');
var users = require('./routes/users');
/*使用ejs*/
/*第一步*/
var ejs=require('ejs');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
/*第二步*/
app.engine('.html',ejs.__express);
/*第三步*/
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*在没有进入路游之前进行全局过滤拦截*/

/*首先需要回去cookies中存储的userid 判断用户是否登录*/
app.use(function (req,res,next) {
  if(req.cookies.userId){
    next();
  }else{
    console.log(` path:${req.path},originalUrl:${req.originalUrl}`);
    if(req.originalUrl=='/users/login' || req.originalUrl=='/users/logout' || req.path == "/goods/list"){
      next();
    }else{
      res.json({
        status:'10001',
        msg:'当前未登录',
        result:''
      });
    }
  }
});







app.use('/', index);
app.use('/users', users);

app.use('/goods', goods);

// catch 404 and forward to error handler

app.use(function(req, res, next) {  //通过中间件来捕获404错误
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) { //捕获error 500错误
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
