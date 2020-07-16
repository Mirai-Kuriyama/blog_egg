'use strict';

const collection = require('../model/collection');

const Service = require('egg').Service;

class ArticleService extends Service {
  async getList() {
    let { ctx, app } = this
    let { page, page_size, category_id } = ctx.request.body
    let from = ctx.request.url.indexOf("/wxlist") != -1 ? "wx" : "ht"
    let where = {
      is_delete: 0,
    }

    if (category_id && category_id != -1) {
      where.category_id = +category_id
    }
    const Op = app.Sequelize.Op

    if (from == "wx") {
      where.status = 4
    } else {
      if (ctx.authUser.role <= 1) {
        where.status = {
          [Op.gte]: 1
        }
      } else {
        where.user_id = ctx.authUser.id
      }
    }

    let article = await app.model.Article.findAndCountAll({
      where,
      include: [{
        model: app.model.User,
        attributes: ['id', 'username', 'avatar_url']
      },
      {
        model: app.model.Category,
        attributes: ['id', 'text', 'color']
      }
      ],
      attributes: ["id", "title", "cover_url", "desc", "created_at", "status", "auto_pub", "reason"],
      offset: (page - 1) * page_size,
      limit: page_size,
      order: [
        ['id', 'DESC']
      ]
    })

    return article
  }

  async getCollection() {
    let { ctx, app } = this
    let { page, page_size, category_id } = ctx.request.body

    // if (category_id && category_id != -1) {
    //   where.category_id = +category_id
    // }
    const Op = app.Sequelize.Op
    let article = await app.model.Collection.findAndCountAll({
      where: {
        user_id: ctx.authUser.id,
        is_delete: 0
      },
      include: [
        {
          model: app.model.Article,
          attributes: ["id", "title", "cover_url", "desc", "created_at", "status", "auto_pub"],
          // include:[
          //   {
          //     model:app.model.Category,
          //     attributes:["id","text"],
          //   }
          // ],
        }
      ],
      attributes: ["id", "created_at"],
      order: [
        ['id', 'DESC']
      ],
      row: true
    })

    // let article = await app.model.Article.findAndCountAll({
    //   where: {
    //     is_delete: 0,
    //     // id: ctx.authUser.id
    //   },
    //   attributes: ["id", "title", "cover_url", "desc", "created_at", "status", "auto_pub"],
    //   include: [
    //     {
    //       model: app.model.User,
    //       through: { 
    //         order: [
    //           ['id', 'DESC']
    //         ],
    //         attributes: []
    //       },
    //       where:{
    //         id:ctx.authUser.id
    //       },
    //       attributes: []
    //     },
    //     // {
    //     //   // where:{
    //     //   //   id:42
    //     //   // },
    //     //   model:app.model.Category,
    //     //   attributes:[]
    //     // }
    //   ],
    //   // row:true
    //   offset: (page - 1) * page_size,
    //   limit: page_size,
    // })

    return article
  }

  async collectToggle() {
    let { ctx, app } = this

    let { id } = ctx.params
    let article = await app.model.Article.findOne({
      where: {
        id: +id,
        is_delete: 0,
        status: 4
      },

    })
    if (!article) {
      ctx.throw(200, "文章不存在或已被下架")
    }

    let collect = await app.model.Collection.findOrCreate({
      where: {
        article_id: +id,
        user_id: ctx.authUser.id,
        is_delete: 0
      },
    })

    if (collect && collect[1]) {
      return "收藏成功"
    } else {
      let collected = collect[0]
      let res = await collected.update({
        is_delete: 1,
        delete_time: new Date()
      })
      if (!res) {
        ctx.throw(200, "取消收藏失败")
      }

      return "取消收藏成功"

    }

  }


  async addOrEdit(isEdit) {
    let { ctx, app,service } = this
    let { flag, id, category_id, title, desc, cover_url, content, auto_pub } = ctx.request.body
    if (isEdit == 1 && id != -1) { // 这是编辑
      let article = await app.model.Article.findOne({
        where:{
          id:+id,
          is_delete:0
        }
      })
      if(!article) {
        ctx.throw(200,"文章不存在或已删除")
      }
      
      if(article.user_id!=ctx.authUser.id) {
        ctx.throw(200,"不是你的文章")
      }

      let uped_article = await article.update({
        category_id:+category_id,
        title,
        desc,
        cover_url,
        content,
        auto_pub,
        status:1,
      })
      if(!uped_article) {
        ctx.throw(200,"提交失败")
      }
      await service.cache.remove("article_"+id)
      return "提交成功"

    } else { // 这是新增(提交/保存草稿)

      let param = {
        user_id: ctx.authUser.id,
        category_id,
        title,
        desc,
        cover_url,
        content,
        auto_pub,
      }

      if (flag == 1) { // 提交
        param.status = 1
      }
      let articleCreate = await app.model.Article.create(param)
      if (articleCreate) {
        return "操作成功"
      } else {
        ctx.throw(200, "操作失败")
      }
    }
  }


  async putCheckHandle(flag) {
    let { ctx, app } = this
    let { id } = ctx.params

    let where = {
      id: +id,
      user_id: ctx.authUser.id,
    }
    if (flag == "put") {
      where.status = 0
    } else {
      where.status = 1
    }
    let article = await app.model.Article.findOne({
      where,
      attributes: ["id", "title", "cover_url", "desc", "created_at", "status", "auto_pub"],
    })
    if (!article) {
      ctx.throw(200, "操作失败")
    }
    article = await article.update({
      status: flag == "put" ? 1 : 0
    })

    if (article) {
      return "操作成功"
    } else {
      ctx.throw(200, "操作失败")
    }
  }

  async agreeHandle(flag) {
    let { ctx, app } = this
    let { id } = ctx.params
    if (ctx.authUser.role > 1) {
      ctx.throw(200, "无权操作")
    }

    let article = await app.model.Article.findOne({
      where: {
        id: +id,
        is_delete: 0
      },
      attributes: ["id", "status", "auto_pub"],
    })

    if (!article) {
      ctx.throw(200, "文章不存在")
    }
    if (article.status != 1) {
      ctx.throw(200, "文章不在可审核状态")
    }

    let edit_info = {}
    if (article.auto_pub == 1) {
      edit_info.status = 4
    } else {
      edit_info.status = 2
    }
    article = await article.update(edit_info)
    if (article) {
      return "操作成功"
    } else {
      ctx.throw(200, "操作失败")
    }
  }

  async disagreeHandle() {
    let { ctx, app } = this
    let url = ctx.request.url
    // 获取参数
    let { id, reason } = ctx.request.body

    // 先查出文章
    let article = await app.model.Article.findOne({
      where: {
        id: +id,
        is_delete: 0
      },
    })

    if (!article) {
      ctx.throw(200, "文章不存在或已删除")
    }
    if (article.status != 1 && article.status != 4) {
      ctx.throw(200, "文章不在能下架/能审核的状态")
    }
    if (ctx.authUser.role > 1 && article.user_id != ctx.authUser.id) {
      ctx.throw(200, "无权下架别人的文章")
    }

    // 文章状态 0=>草稿  1=>审核中 2=>审核通过 3=>审核未通过 4=>发布中 5=>已下架(自己主动下架) 6=>违规被管理下架(可以编辑再提交审核) 7=>强制下架(不可编辑再提交,只能删除) 
    let tmp_status = 5
    if (url.indexOf("offpubforever") != -1) { // 永久下架
      tmp_status = 7
    } else if (url.indexOf("offpubonce") != -1) { // 普通下架(管理员下架/作者自下架)
      if (ctx.authUser.role < 2) { // 管理员下架
        tmp_status = 6
      }
    } else if (url.indexOf("disagree") != -1) { // 管理审核不通过
      tmp_status = 3
    }

    let tmp_up = {
      status: tmp_status
    }

    // 管理员需要更新原因
    if (ctx.authUser.role< 2) {
      tmp_up.reason = reason
    }

    // 开始更新数据库
    let res = await article.update(tmp_up)

    if (!res) {
      ctx.throw(200, "操作失败")
    }

    return "操作成功"

  }

  async getDetail() {
    let { ctx, app, service } = this
    let { id } = ctx.params
    let article = await service.cache.get('article_' + id)
    if (article) {
      let collect = await app.model.Collection.findOne({
        where: {
          is_delete: 0,
          user_id: ctx.authUser.id,
          article_id: +id
        },
      })
      if (collect) {
        article.is_collect = 1
      } else {
        article.is_collect = 0
      }
      return article
    }

    article = await app.model.Article.findOne({
      where: {
        id: +id,
        is_delete: 0,
      },
      attributes: ["id", "title", "cover_url", "desc", "content", "created_at", "status", "auto_pub"],
      include: [
        {
          model: app.model.User,
          attributes: ['id', 'username', 'avatar_url']
        },
        {
          model:app.model.Category,
          attributes: ['id']
        }
      ],
    })

    if (!article) {
      ctx.throw(200, "文章不存在或已删除")
    }
    article = JSON.parse(JSON.stringify(article))
    let collect2 = await app.model.Collection.findOne({
      where: {
        user_id: ctx.authUser.id,
        article_id: +id,
        is_delete: 0
      },
      attributes: ["id"]
    })
    if (!collect2) {
      article.is_collect = 0
    } else {
      article.is_collect = 1
    }
    await service.cache.set('article_' + id, article)

    return article
  }
}

module.exports = ArticleService;
