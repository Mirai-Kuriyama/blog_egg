'use strict';
module.exports = app => {
    const {
        STRING,
        INTEGER,
        DATE
    } = app.Sequelize;
    // 配置（重要：一定要配置详细，一定要！！！）
    const History = app.model.define('history', {
        id: { // 唯一id
            type: INTEGER(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: { //用户id
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
        article_id: { // 文章id
            type: INTEGER(20).UNSIGNED,
            allowNull: false,
            comment: '文章id',
            //  定义外键（重要）
            references: {
                model: 'article', // 对应表名称（数据表名称）
                key: 'id' // 对应表的主键
            },
            onUpdate: 'restrict', // 更新时操作
            onDelete: 'cascade'  // 删除时操作
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
    History.associate = function (model) {
        // History.hasMany(app.model.Article,
        //     {
        //         // as:"category_info",
        //         foreignKey: 'id',
        //         // sourceKey: 'id'
        //     }
        // );
    }
    return History;
};