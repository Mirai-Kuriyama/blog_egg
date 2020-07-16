'use strict';
module.exports = app => {
    const {
        STRING,
        INTEGER,
        DATE
    } = app.Sequelize;
    // 配置（重要：一定要配置详细，一定要！！！）
    const Category = app.model.define('category', {
        id: { // 分类唯一id
            type: INTEGER(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        text: { // 分类文字不超过25个字
            type: STRING(25),
            unique: true
        },
        color: { // 分类颜色,以后可能用到
            type: STRING(100),
            allowNull: false,
            defaultValue: "",
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
    Category.associate = function (model) {
        // Category.hasMany(app.model.Article,
        //     {
        //         // as:"category_info",
        //         foreignKey: 'id',
        //         // sourceKey: 'id'
        //     }
        // );
    }
    return Category;
};