/* eslint valid-jsdoc: "off" */

'use strict';
let path = require("path")
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1592457037605_6571';

  // add your middleware config here
  config.middleware = ["errorHandler","auth"];
  config.auth = {
    ignore: ['/api/wxlogin', '/api/login','/api/test'],
    // match:["/api/article/list"]
  };

  // 取消post请求需要_csrf字段
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['*']
  };

  // 配置cors跨域
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

   // 加密
   config.crypto = {
    secret: '你的随机加密串'
  };

  // jwt鉴权
  config.jwt = {
    secret: '你的随机加密串'
  };



  // 数据库
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: 'root',
    port: 3306,
    database: 'eggapi',
    // 中国时区
    timezone: '+08:00',
    define: {
      // 取消数据表名复数
      freezeTableName: true,
      // 自动写入时间戳 created_at updated_at
      timestamps: true,
      // 字段生成软删除时间戳 deleted_at
      // paranoid: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      // deletedAt: 'deleted_at',
      // 所有驼峰命名格式化
      underscored: true
    }
  };

  // 参数验证插件
  config.valparams = {
    locale: 'zh-cn',
    throwError: true
  };


  // redis插件配置
  config.redis = {
    client:{
      port:6379,
      host:"127.0.0.1",
      password:"",
      db:2
    }
  };

  config.multipart = {
    mode: 'file'
  };
  exports.fullQiniu = {
    default: {
      ak: '你的七牛ak', // Access Key
      sk: '你的七牛sk', // Secret Key
      useCdnDomain: true,
      isLog: true,
    },
    app: true,
    agent: false,
   
    // 单实例
    // 通过 app.fullQiniu 直接使用实例
    client: {
        zone: 'Zone_z2', // Zone_z0 华东, Zone_z1 华北, Zone_z2 华南, Zone_na0 北美
        bucket: 'mini-tinyblog',
        baseUrl: null, // 用于拼接已上传文件的完整地址
    }
   
    // 多实例
    // clients: {
    //     // 可以通过 app.fullQiniu.get('myImage'), app.fullQiniu.get('myText') 获取实例
    //     myImage: {
    //         zone: '', // Zone_z0 华东, Zone_z1 华北, Zone_z2 华南, Zone_na0 北美
    //         bucket: '',
    //     baseUrl: null, // 用于拼接已上传文件的完整地址
    //     },
    //     myText: {
    //         zone: '', // Zone_z0 华东, Zone_z1 华北, Zone_z2 华南, Zone_na0 北美
    //         bucket: '',
    //     baseUrl: null, // 用于拼接已上传文件的完整地址
    //     },
    // },
  };

   // oss存储
   config.oss = {
    client: {
      accessKeyId: '你的阿里oss accessKeyId',
      accessKeySecret: '你的阿里oss accessKeySecret',
      bucket: '你的阿里oss 创建的bucket',
      endpoint: '你的阿里oss 加速域名',
      timeout: '60s',
    },
  }

  config.wx_mini = {
    AppID:"小程序appid",
    AppSecret:"小程序AppSecret"
  }

  // 配置vuebuild打包后的静态资源引用路径问题(因为egg的静态资源在public里,所以引用要加public,但vue打包路径没有public)
  config.static = {
    // 静态化访问前缀,如：`http://127.0.0.1:7001/static/images/logo.png`
    prefix: '/',
    dir: path.join(__dirname, '../app/public'), // `String` or `Array:[dir1, dir2, ...]` 静态化目录,可以设置多个静态化目录
    dynamic: true, // 如果当前访问的静态资源没有缓存，则缓存静态文件，和`preload`配合使用；
    preload: false,
    maxAge: 31536000, // in prod env, 0 in other envs
    buffer: true, // in prod env, false in other envs
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
