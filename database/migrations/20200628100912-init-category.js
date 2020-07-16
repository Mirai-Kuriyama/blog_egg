'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const {
      INTEGER,
      STRING,
      DATE,
    } = Sequelize;
    // 创建表
    await queryInterface.createTable('category', {
      id: { // 分类唯一id
        type: INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      text:{ // 分类文字不超过25个字
        type: STRING(25),
        unique: true
      },
      color:{ // 分类颜色,以后可能用到
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
    await queryInterface.dropTable('category')
  }
};