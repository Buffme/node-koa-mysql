const Koa = require('koa')
const { router } = require('./app/router/user')

const app = new Koa()

app.use(router.routes())

app.listen(3000, () => {
  console.log('Koa is listening in http://localhost:3000')
})

module.exports = app