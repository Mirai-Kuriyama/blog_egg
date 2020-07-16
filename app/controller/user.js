'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async wxLogin() {
    let { ctx, service } = this
    // 参数验证
    ctx.validate({
      code: {
        type: 'string',
        required: true,
        desc: 'code'
      },
      info: {
        type: 'json',
        required: false,
        desc: '用户信息'
      },
    });
    let { code } = ctx.request.body
    let token_info = await service.user.wxLogin(code)
    if (!await service.cache.set('wxUser_' + token_info.id, "wx " + token_info.token)) {
      ctx.apiFail("登陆失败")
    }
    ctx.apiSuccess(token_info)
  }

  async login() {
    let { ctx, service } = this
    ctx.validate({
      username: {
        type: 'string',
        range:{
          reg:/(^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$)|(^1\d{10}$)/
        },
        required: true,
        desc:"用户名必填且为手机或邮箱==>"
      },
      password: {
        type: 'string',
        required: true,
        range:{
          min:6,
          max:16
        },
        desc:"密码"
      },
    });

    let token_info = await service.user.Login()
    if(token_info) {
      if (!await service.cache.set('htUser_' + token_info.id, "ht " + token_info.token)) {
        ctx.apiFail("登陆失败")
      }
    }
    ctx.apiSuccess(token_info)
  }
  
  async logout() {
    let { ctx, service } = this
    await service.cache.remove('htUser_' + ctx.authUser.id)
    ctx.apiSuccess("退登成功")
  }

}

module.exports = UserController;
