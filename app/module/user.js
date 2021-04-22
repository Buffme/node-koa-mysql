const { User } = require('../../models/user')

class UserModule {
  // 获取全部列表
  static async list() {
    return await User.findAndCountAll({
      order: [
        ['id', 'DESC']
      ] // 定义排序规则-降序
    })
  }
  // 创建客户
  static async created(user) {
    return await User.created(user)
  }
}

module.exports = {
  UserModule
}