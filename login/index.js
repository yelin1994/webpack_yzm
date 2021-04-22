const koa = require('koa');
const app = new koa();
var bodyParser = require('koa-bodyparser');
const loginRouter = require('./router/login');

app.use(bodyParser());

app.use((ctx, next) => {
    // 允许来自所有域名请求
    ctx.set('Access-Control-Allow-Origin', '*');
    //设置所允许的HTTP请求方法
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
    // 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段.
    ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
    // Content-Type表示具体请求中的媒体类型信息
    ctx.set("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use(loginRouter.routes())
   .use(loginRouter.allowedMethods());


app.listen(8010, function() {
    console.log('server start')
});
