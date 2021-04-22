const {sequelize} = require('../core/db')
const {DataTypes, Model} = require('sequelize')

// 定义管理员模型
class User extends Model {}

// 初始用户模型
User.init({
  id: { type: DataTypes.STRING(64), primaryKey: true, allowNull: false },
  name: { type: DataTypes.STRING(64), allowNull: false, comment: '姓名' },
  email: { type: DataTypes.STRING(64), unique: true, allowNull: false, comment: '邮箱' },
  country: { type: DataTypes.STRING(64), comment: '国家' },
  city: { type: DataTypes.STRING(64), comment: '城市' },
  address: { type: DataTypes.STRING(64), comment: '地址' },
  phone: { type: DataTypes.STRING(64), comment: '联系电话' },
  sex: { type: DataTypes.ENUM('M', 'F'), comment: '性别' },
  // full_address: {
  //   type: DataTypes.STRING(126),
  //   get() {
  //     return `${this.getDateValue('country')}${this.getDateValue('city')}${this.getDateValue('address')}`
  //   },
  //   comment: '详细地址'
  // }
}, {
  sequelize,
  modelName: 'user',
  tableName: 'user'
})


module.exports = {
  User
}

