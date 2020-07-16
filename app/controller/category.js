'use strict';

const Controller = require('egg').Controller;

class CategoryController extends Controller {
	async add() {
		let { ctx,service } = this
		let {cats} = ctx.request.body


		// 参数验证不满足要求,自己写的验证
		if(!cats) {
			ctx.throw(422,"分类必传且应为数组")
		}else {
			if(Object.prototype.toString.call(cats)!="[object Array]" || !cats.length) {
				ctx.throw(422,"分类为数组且不能为空")
			}else {
				for (let i = 0; i < cats.length; i++) {
					let el = cats[i];
					if(Object.prototype.toString.call(el)!="[object Object]")	{
						ctx.throw(422,"数组内必须为对象")
					}
				}
				for (let i = 0; i < cats.length; i++) {
					let el = cats[i];
					if(!el.text) {
						ctx.throw(422,"数组内text必传且不能为空")
					}else if(Object.prototype.toString.call(el.text)!="[object String]") {
						ctx.throw(422,"数组内的键值需为string")
					}else if(el.color && Object.prototype.toString.call(el.color)!="[object String]") {
						ctx.throw(422,"数组内的键值需为string")
					}
				}
			}
		}
		let result = await service.category.add()
		ctx.apiSuccess(result)
	}

	async get() {
		let {ctx,app} = this

		let from = ctx.request.url.indexOf("wxget")!=-1?"wx":"ht"

		let result = await app.model.Category.findAll({
			where:{
				is_delete:0
			},
			attributes: ["id", "text","color"],
		})
		result = JSON.parse(JSON.stringify(result))
		if(from == "wx") {
			result.unshift({
				id:"",
				text:"全部",
				color:""
			})
		}
		ctx.apiSuccess(result)
	}
}

module.exports = CategoryController;
