let path = require("path")
let fs = require("fs")
module.exports = (option, app) => {
    return async (ctx, next) => {
        //1. 获取 header 头token
        let token = ctx.header.authorization || ctx.request.body.authorization || ctx.query.authorization;
        if (!token) {
            // if(ctx.request.url.split("?")[0] == "/") {
            //     if(ctx.request.url.split("?")[1]) {
            //         ctx.redirect('/')
            //     }
            //     ctx.response.type = 'html';
            //     ctx.body = fs.readFileSync(path.resolve(__dirname, '../public/index.html'));
            //     return
            // }else {
                ctx.throw(403, '您没有权限访问该接口!');
            // }
        }
        let from = token.slice(0,2) // 截取是哪里来的请求
        //2. 根据token解密，换取用户信息
        let user = {};
        try {
            user = ctx.checkToken(token.slice(3));
        } catch (error) {
            let fail = error.name === 'TokenExpiredError' ? 'token 已过期! 请重新获取令牌' : 'Token 令牌不合法!';
            ctx.throw(403, fail);
        }
        //3. 判断当前用户是否登录
        let t;
        if(from == "wx") {
            t = await ctx.service.cache.get('wxUser_' + user.id);
        }else {
            t = await ctx.service.cache.get('htUser_' + user.id);
        }
        if (!t || t !== token) {
            
            if(from == "wx") {
                await ctx.service.cache.remove('wxUser_' + user.id);
            }else {
                await ctx.service.cache.remove('htUser_' + user.id);
            }

            ctx.throw(403, 'Token 令牌不合法!');
        }
        //4. 获取当前用户，验证当前用户是否被禁用
        user = await app.model.User.findByPk(user.id);
        if (!user || user.status == 0) {
            ctx.throw(403, '用户不存在或已被禁用');
        }
        // 5. 把 user 信息挂载到全局ctx上
        ctx.authUser = user;
        await next();
    }
}