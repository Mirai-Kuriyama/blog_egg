'use strict';

const Controller = require('egg').Controller;
const fs = require('mz/fs');
const path = require('path')
class ArticleController extends Controller {
    async getList() {
        let { ctx, service } = this
        ctx.validate({
            page: {
                type: 'number',
                required: false,
                range:{
                    min:1,
                },
                defValue:1,
                desc: "当前页数"
            },
            category_id: {
                type: 'string',
                required: false,
                defValue:"-1",
                desc: "分类id"
            },
            page_size: {
                type: 'number',
                required: false,
                range:{
                    min:1,
                },
                defValue:10,
                desc: "每页数量"
            },
        });


        let result = await service.article.getList()

        ctx.apiSuccess(result)
    }


    async getCollection() {
        let { ctx, service } = this
        ctx.validate({
            page: {
                type: 'number',
                required: false,
                range:{
                    min:1,
                },
                defValue:1,
                desc: "当前页数"
            },
            category_id: {
                type: 'string',
                required: false,
                defValue:"-1",
                desc: "分类id"
            },
            page_size: {
                type: 'number',
                required: false,
                range:{
                    min:1,
                },
                defValue:10,
                desc: "每页数量"
            },
        });

        let result = await service.article.getCollection()
        ctx.apiSuccess(result)
    }

    async collectToggle() {
        let { ctx, service } = this
        ctx.validate({
            id: {
                type: 'string',
                required: true,
                desc: "文章id"
            },
        })
        

        let result = await service.article.collectToggle()
        ctx.apiSuccess(result)

    }


    async addOrEdit() {
        let { ctx, service } = this
        let url = ctx.request.url

        let rules = {
            category_id: {
                type: 'string',
                required: true,
                defValue:"-1",
                desc: "分类id"
            },
            title: {
                type: 'string',
                required: true,
                desc: "标题"
            },
            desc: {
                type: 'string',
                required: true,
                desc: "简介"
            },
            cover_url: {
                type: 'string',
                required: false,
                desc: "简介"
            },
            content:{
                type: 'string',
                required: true,
                desc: "内容"
            },
            auto_pub:{
                type: 'number',
                required: true,
                defValue:0,
                desc: "是否自动发布"
            },
            
        }
        if(url.indexOf("edit")!=-1) {
            rules.id = {
                type: 'string',
                required: true,
                defValue:"-1",
                desc: "文章id"
            }
        }else {
            rules.flag={
                type: 'number',
                required: true,
                defValue:0, // 0存为草稿 1提交审核
                desc: "是否自动发布"
            }
        }
        ctx.validate(rules);
        let result;
        if(url.indexOf("edit")!=-1) {
            result = await service.article.addOrEdit(1)
        }else {
            result = await service.article.addOrEdit()
        }

        ctx.apiSuccess(result)
    }


    async putCheckHandle() { // 提交审核/撤销审核
        let { ctx, service } = this
        let url = ctx.request.url
        ctx.validate({
            id: {
                type: 'string',
                required: true,
                desc: "文章id"
            },
        })
        let flag = "put"
        if(url.indexOf("unputcheck")!=-1) {
            flag = "unput"
        }
        let result = await service.article.putCheckHandle(flag)

        ctx.apiSuccess(result)
    }
    async publish() {
        let { ctx, app } = this
        ctx.validate({
            id: {
                type: 'string',
                required: true,
                desc: "文章id"
            },
        })
        let {id} = ctx.params
        let result = await app.model.Article.findOne({
			where:{
                id:+id,
				is_delete:0
			},
			attributes: ["id", "status","user_id"],
        })
        if(!result) {
            ctx.throw(200,"文章不存在")
        }
        if(result.id != ctx.authUser.id) {
            ctx.throw(200,"不能发布他人文章")
        }
        if(result.status!=2) {
            ctx.throw(200,"文章不是能发布的状态")
        }
        result.status = 4
        if(! await result.save()) {
            ctx.throw(200,"发布失败")
        }
        ctx.apiSuccess("发布成功")
    }

    async agreeHandle() {
        let { ctx, service } = this
        ctx.validate({
            id: {
                type: 'string',
                required: true,
                desc: "文章id"
            },
        })
        let result = await service.article.agreeHandle()

        ctx.apiSuccess(result)
    }

    async remove() {
        let { ctx, service,app } = this
        ctx.validate({
            id: {
                type: 'string',
                required: true,
                desc: "文章id"
            },
        })
        let { id } = ctx.params
        let article = await app.model.Article.findOne({
            where:{
                id:+id,
                user_id:ctx.authUser.id,
                is_delete:0
            },
            attributes:["id","user_id","status"]
        })
        if(!article) {
            ctx.throw(200,"文章不存在或已被删除")
        }
        if(article.status==1 || article.status==4) {
            ctx.throw(200,"不在可删除的状态")
        }
        let res = await article.update({
            is_delete:1,
            delete_time:new Date()
        })
        if(!res) {
            ctx.throw(200,"删除失败")
        }
        ctx.apiSuccess("删除成功")

    }

    async disagreeHandle() {
        let { ctx, service} = this
        let url = ctx.request.url

        // 作者无权永久下架
        if(url.indexOf("offpubforever")!= -1 && ctx.authUser.role > 1 ) {
            ctx.throw(200, "无权永久下架")
        }
        
        // 定义基本参数验证规则
        let rules = {
            id: {
                type: 'string',
                required: true,
                desc: "文章id"
            },
        }

        // 管理员操作要传原因,加入规则
        if(ctx.authUser.role < 2) {
            rules.reason = {
                type: 'string',
                required: true,
                desc: "理由"
            }
        }

        // 开始验证
        ctx.validate(rules)

        let result = await service.article.disagreeHandle()

        ctx.apiSuccess(result)

    }

    async getDetail() { // 获取文章详情
        let { ctx, service } = this
        ctx.validate({
            id: {
                type: 'string',
                required: true,
                desc: "文章id"
            },
        })
        
        let result = await service.article.getDetail()

        ctx.apiSuccess(result)
    }

    async upLoad() {
        let { ctx, app } = this
        if(!ctx.request.files) {
            ctx.throw(200,"没有选择文件")
        }
        const file = ctx.request.files[0];
        // 阿里oss
        const key = 'blog/' + ctx.genID() + path.extname(file.filename);
        
        // 七牛上传
        // const key = 'mini-tinyblog' + ctx.genID() + path.extname(file.filename);


        let result;
        try {
            // 七牛上传
            // result = await app.fullQiniu.uploadFile(key, file.filepath);
            // 阿里上传
            result = await ctx.oss.put(key,file.filepath)
        } catch (err) {
            ctx.throw(200,"上传失败")
        } finally {
            await fs.unlink(file.filepath);
        }
        ctx.apiSuccess(result)
        if(!result) {
            ctx.throw(200,"上传失败")
        }

        // 七牛
        // ctx.apiSuccess(result.url)

        // 阿里的返回形式
        // {
        //     name: "blog/2bct63uc6000000.png"
        //     res: {status: 200, statusCode: 200, statusMessage: "OK",…}
        //     url: "http://mini-tinyblog.oss-accelerate.aliyuncs.com/blog/2bct63uc6000000.png"
        // }
        ctx.apiSuccess(result.name)



    }
    
}

module.exports = ArticleController;
