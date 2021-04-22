const Sequelize = require('sequelize')

const {
  dbName,
  host,
  port,
  user,
  password
} = require('../config/config').database

const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql', // SQL 语言类型
  host,
  port,
  logging: false,
  timezone: '+08:00',
  define: {
    timestamps: false, // 时间戳
    // paranoid: true,
    // createdAt: 'created_at', // 创建 created_at 代替 createdAt
    // updatedAt: 'updated_at', // 创建 updated_at 代替 updatedAt
    // underscored: true, // 把驼峰命名转换为下划线
  }
})
// 创建模型
sequelize.sync({force: false}) // force 是否进行强制同步，true：同步时会删除已经存在的数据表
module.exports = {
  sequelize
}
