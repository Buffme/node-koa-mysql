const Router = require('koa-router')
const { UserModule } = require('../module/user')

const router = new Router({
  prefix: '/api'
})

// 获取全部列表 http://localhost:3000/api/getAllUsers
router.get('/getAllUsers', async (ctx) => {
  const userList = await UserModule.list();

  // 返回结果
  ctx.response.status = 200;
  ctx.body = {
    code: '200',
    data: userList,
    msg: 'success'
  }

})

module.exports = {
  router
}