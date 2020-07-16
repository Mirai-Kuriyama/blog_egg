'use strict';
let path = require("path")
let fs = require("fs")
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    let {ctx} = this
    ctx.apiSuccess(await ctx.checkPassword("123456"))
  }
  async login() {
    const { ctx } = this;
    ctx.body = { token: USER_MAP[ctx.request.body.userName].token }
  }
  async getInfo() {
    const { ctx } = this;
    ctx.body = USER_MAP[ctx.query.token]
  }
}

module.exports = HomeController;
