'use strict';
module.exports = app => {
    const {
        STRING,
        INTEGER,
        TEXT,
        DATE,
    } = app.Sequelize;
    // 配置（重要：一定要配置详细，一定要！！！）
    const Article = app.model.define('article', {
        id: { // 用户唯一id
            type: INTEGER(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: { // 关联user表的主建id
            type: INTEGER(20).UNSIGNED,
            allowNull: false,
            comment: '用户id',
            //  定义外键（重要）
            references: {
                model: 'user', // 对应表名称（数据表名称）
                key: 'id' // 对应表的主键
            },
            onUpdate: 'restrict', // 更新时操作
            onDelete: 'cascade'  // 删除时操作
        },
        category_id: { // 关联catgory表的主建id
            type: INTEGER(20).UNSIGNED,
            allowNull: false,
            comment: '分类id',
            //  定义外键（重要）
            references: {
                model: 'catgory', // 对应表名称（数据表名称）
                key: 'id' // 对应表的主键
            },
            onUpdate: 'restrict', // 更新时操作
            onDelete: 'cascade'  // 删除时操作
        },
        title: { // 作者认证注册的时候邮箱与手机二选一,都可用于登陆,不可重复,另一个可后续绑定
            type: STRING(200),
            allowNull: false,
            defaultValue: "",
            comment: '文章标题',
        },
        desc: {
            type: STRING(255),
            allowNull: false,
            defaultValue: "",
            comment: '文章简介/描述',
        },
        content: { // 作者认证注册的时候邮箱与手机二选一,都可用于登陆,不可重复,另一个可后续绑定
            type: TEXT,
            allowNull: false,
            defaultValue: "",
            comment: '文章内容富文本',
        },
        cover_url: {
            type: STRING(200),
            allowNull: false,
            defaultValue: '',
            comment: '文章封面图',
        },
        auto_pub: { // 审核通过后是否自动转为发布0=>否  1=>是
            type: INTEGER(1),
            allowNull: false,
            defaultValue: 0,
            comment: '审核通过后是否自动转为发布0=>否  1=>是',
        },
        status: { // 文章状态 0=>草稿  1=>审核中 2=>审核通过 3=>审核未通过 4=>发布中 5=>已下架(自己主动下架) 6=>违规被管理下架(可以编辑再提交审核) 7=>强制下架(不可编辑再提交,只能删除) 
            type: INTEGER(1),
            allowNull: false,
            defaultValue: 0,
            comment: '文章状态',
        },
        reason: { // 管理员下架/审核未通过原因
            type: STRING(150),
            allowNull: false,
            defaultValue: "",
            comment: '管理员下架原因',
        },

        is_delete: { // 该记录是否删除 0=>正常 1=>记录已删除
            type: INTEGER(1),
            allowNull: false,
            defaultValue: 0,
            comment: '该记录是否删除'
        },
        created_at: {
            type: DATE,
            get() {
                return new Date(this.getDataValue("created_at")).getTime()
            }
        },
        updated_at: DATE,
        delete_time: {
            type: DATE,
            allowNull: true,
            comment: '记录删除时间'
        }
    });
    // 定义关联关系
    Article.associate = function (model) {

        Article.belongsTo(app.model.Category,{foreignKey: "category_id"});
        Article.belongsTo(app.model.User, { foreignKey: "user_id"})
        // Article.hasOne(app.model.Collection,{ as:"is_collect", foreignKey: "article_id"})
        // Article.belongsToMany(app.model.User, { through: app.model.Collection,foreignKey: "article_id"})
    }
    return Article;
};