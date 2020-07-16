'use strict';

const Service = require('egg').Service;

class UserService extends Service {
    async wxLogin(code) { // 
        let { ctx, app } = this

        let info = await ctx.getOpenId(code)
        // return info
        // 验证用户是否已经存在
        let userFind = await app.model.User.findOne({
            where: {
                wx_mini_openid: info.openid,
                is_delete: 0,
            },
            attributes: ["id", 'role', "username", "avatar_url", "gender", "area"],
        })
        let user_info = ctx.request.body.info || ""
        let { rawData = "{}" } = user_info
        let parseData = JSON.parse(rawData);
        let { nickName: username = "", avatarUrl: avatar_url = "", gender = 0 } = parseData;
        let area = Object.keys(parseData).length ? [parseData.province, parseData.city].join("-") : "";
        if (userFind) {
            if (user_info) {
                userFind = await userFind.update(
                    {
                        username: encodeURIComponent(username),
                        avatar_url,
                        area,
                        gender
                    }
                );
            }
            let pureUser = JSON.parse(JSON.stringify(userFind))
            let token = ctx.getToken(pureUser);
            pureUser.token = token;
            return pureUser
        } else {

            let userCreate = await app.model.User.create(
                {
                    username: "游客 " + ctx.genID(8),
                    wx_mini_openid: info.openid,
                    avatar_url,
                    area,
                    gender,

                }
            )
            if (userCreate) {
                let {id, username, avatar_url, gender, role, area } = userCreate
                let param = { id, username, avatar_url, gender, role, area }
                let token = ctx.getToken(param);
                param.token = token;
                return param
            }else {
                ctx.throw(200,"用户创建失败")
            }
        }
    }

    async Login() {
        let { ctx, app } = this
        let { username, password } = ctx.request.body
        
        let where = {
            is_delete: 0,
        }
        let reg = /^1\d{10}$/
        
        if(reg.test(username)) {
            where.phone = username
        }else {
            where.email = username
        }
        
        let user = await app.model.User.findOne({
            where,
            // attributes: ["id", 'role', "username", "avatar_url", "gender", "area"],
        })
        if(!user) {
            ctx.throw(200,"用户不存在")
        }else {
            // 验证密码
            await ctx.checkPassword(password, user.password);

            if(user.status == 0) {
                ctx.throw(200,"用户已被禁用")
            }else if(user.role == 2) {
                ctx.throw(200,"帐号暂未通过审核")
            }else {
                let {id, username, avatar_url, gender, role, area } = user
                let param = { id, username, avatar_url, gender, role, area }
                let token = ctx.getToken(param);
                param.token = token;
                return param
            }
        }

    }
}

module.exports = UserService;
