const router = require('koa-router')();
const {user} = require('../mock.js');

router.prefix('/login')
router.post('/open', function (ctx) {
    const body = ctx.request.body;
    const {username, password, redirect}  = body;
    let isSystemUser = false;
    console.log(username, password)
    if (user.name === username && user.password == password) {
        isSystemUser = true
    }
    if (isSystemUser) {
        ctx.body = {
            login: 'success',
            redirect: ''
        }
        // ctx.body = 'hello';
    } else {
        ctx.response.status = 401;
        ctx.body = 'no authorize'
    }
})
router.get('/test', function(ctx) {
    ctx.body = 'hello';
})

module.exports = router;