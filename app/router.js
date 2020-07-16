'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
 
  const { router, controller } = app;
  // router.get('/', controller.home.index); // 打包后的前端静态资源
  router.get('/api/test', controller.home.index); // 测试接口

  router.post('/api/login', controller.user.login); // 文章后台登陆
  router.get('/api/logout', controller.user.logout); // 文章后台登陆
  router.get('/api/login', controller.user.login); // 文章后台登陆
  router.post('/api/category/add', controller.category.add); // 文章分类添加
  router.get('/api/category/get', controller.category.get); // 文章分类获取
  router.post('/api/article/list', controller.article.getList); // 文章列表
  router.get('/api/article/detail/:id', controller.article.getDetail); // 文章详情
  router.post('/api/article/add', controller.article.addOrEdit); // 文章添加 
  router.post('/api/article/edit', controller.article.addOrEdit); // 文章编辑
  router.get('/api/article/remove/:id', controller.article.remove); // 文章编辑
  router.get('/api/article/putcheck/:id', controller.article.putCheckHandle); // 文章提交审核
  router.get('/api/article/unputcheck/:id', controller.article.putCheckHandle); // 文章撤销提交
  router.get('/api/article/publish/:id', controller.article.publish); // 文章发布
  router.get('/api/article/agree/:id', controller.article.agreeHandle); // 文章审核通过
  router.post('/api/article/disagree', controller.article.disagreeHandle); // 文章审核不通过
  router.post('/api/article/offpubonce', controller.article.disagreeHandle); // 文章下架
  router.post('/api/article/offpubforever', controller.article.disagreeHandle); // 文章永久下架
  
  router.post('/api/wxlogin', controller.user.wxLogin); // 微信登陆
  router.get('/api/category/wxget', controller.category.get); // 文章分类获取(微信)
  router.post('/api/article/wxlist', controller.article.getList); // 文章列表(微信)
  router.post('/api/collection/get', controller.article.getCollection); // 文章收藏列表(微信)
  router.get('/api/collection/toggle/:id', controller.article.collectToggle); // 文章收藏/取消收藏(微信)
  
  router.post('/api/upload', controller.article.upLoad); // 上传文件
};
