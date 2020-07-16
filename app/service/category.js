'use strict';

const Service = require('egg').Service;

class CategoryService extends Service {
  async add() {
    let {ctx, app} = this
    if(ctx.authUser.role > 1 || ctx.status == 0) {
        ctx.throw(403, "无权操作")
    }
    let {cats} = ctx.request.body

    let result = await app.model.Category.bulkCreate(cats)

    if(result && result.length) {
        if(result.length == cats.length) {
            return "创建成功"
        }else {
            return "部分创建成功"
        }


    }else {
        ctx.throw(200,"创建失败")
    }


  }
}

module.exports = CategoryService;
