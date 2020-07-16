'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const {
      INTEGER,
      STRING,
      DATE,
      UUID
    } = Sequelize;
    // 创建表
    await queryInterface.createTable('user', {
      id: { // 用户唯一id
        type: INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      // user_id: { // 用户唯一id
      //   type: UUID,
      //   primaryKey: true,
      //   unique: true
      //   // autoIncrement: true
      // },
      password: { // 登陆文章管理后台密码
        type: STRING(200),
        allowNull: true,
        defaultValue: ''
      },
      email : { // 作者认证注册的时候邮箱与手机二选一,都可用于登陆,不可重复,另一个可后续绑定
        type: STRING(50),
        unique: true
      },
      phone: { // 作者认证注册的时候邮箱与手机二选一,都可用于登陆,不可重复,另一个可后续绑定
        type: STRING(11),
        unique: true
      },
      wx_mini_openid:{ // 微信小程序openid(现阶段主要微信登陆为主,先不要头像昵称,他自愿给再存)
        type: STRING(200),
        unique: true
      },
      wx_gzh_openid:{ // 微信公众号openid
        type: STRING(200),
        unique: true
      },
      wx_unionid:{ // 微信同主体unionid 以后也许有用
        type: STRING(200),
        unique: true
      },
      role: { // 用户角色0=>超管(用于审核)  1=>管理(暂未考虑好)  2=>普通读者(只能看,点赞,评论,收藏,无法写文章) 3=>作者(包含2 + 管理文章)
        type: INTEGER(1),
        allowNull: false,
        defaultValue: 2
      },
      status: { // 角色状态 0=>禁用  1=>启用 角色为2读者角色如被禁用 只能浏览,收藏,无法点赞/评论 角色为3作者角色如被禁用则和读者一样,并且无法登陆文章后台,就算登陆了,也无权操作任何东西
        type: INTEGER(1),
        allowNull: false,
        defaultValue: 1,
        comment: '角色状态 0禁用 1启用',
      },
      username: { // 用户可以随时改的显示称呼,初始给随机名字(用户65sd46),授权微信头像昵称后改为微信昵称
        type: STRING(255), // 避免特殊emoji字符,前台经过encodeURIComponent(username)后 传给后台存储
        comment: '用户昵称',
        unique: true
      },
      avatar_url: { // 用户头像, 初始默认, 微信授权后改为微信头像
        type: STRING(200),
        allowNull: false,
        defaultValue: ''
      },
      area: { // 用户地区
        type: STRING(50),
        allowNull: false,
        defaultValue: ''
      },
      gender: { // 用户性别 0=>保密 1=>男 2=>女
        type: INTEGER(1),
        allowNull: false,
        defaultValue: 0,
        comment: '用户性别'
      },
      is_delete: { // 该记录是否删除 0=>正常 1=>记录已删除
        type: INTEGER(1),
        allowNull: false,
        defaultValue: 0,
        comment: '该记录是否删除'
      },
      created_at: DATE,
      updated_at: DATE,
      delete_time: {
        type: DATE,
        allowNull: true,
        comment: '记录删除时间'
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('user')
  }
};