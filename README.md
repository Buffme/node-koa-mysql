# node-koa-mysql

# 数据库

## 数据库介绍

### 数据库是存储、管理数据的仓库，它提供了对数据的检索、存储、多用户共享访问的能力，并且设法使数据的冗余度尽可能小。

### 数据库按照存储的数据模型，分为关系型数据库和非关系型数据库。

* 关系型数据库：把复杂的数据结构归结为简单的二维表格形式，表格之间的数据关系通过主外键关系来维系。在应用开发中，大多数业务都可以抽象为二维表格，可以采用关系型数据库存储数据。在关系型数据库中，大多是基于SQL来查询的。如：Oracle（重量、付费、银行）、MySQL（轻量、开源、流行）
* 非关系型数据库：不同于关系型数据库，非关系型数据库一般不采用SQL作为查询语言，也经常避免使用类似SQL中的JOIN操作来关联多张数据表。如：MongoDB（结构简单）、Redis（基于内存的可持久化的键值对存储数据库——提升系统性能）

### SQL 语法
#### 可以把 SQL 分为两个部分：数据操作语言 (DML) 和 数据定义语言 (DDL)。
#### DDL：
* CREATE DATABASE - 创建新数据库
* ALTER DATABASE - 修改数据库
* CREATE TABLE - 创建新表
* ALTER TABLE - 变更（改变）数据库表
* DROP TABLE - 删除表
* CREATE INDEX - 创建索引（搜索键）
* DROP INDEX - 删除索引

#### DDL：
* SELECT - 从数据库表中获取数据   如：select *（列名称） from user（表名称）where city='shenzhen'
* UPDATE - 更新数据库表中的数据  如：update user（表名称）set city='shenzhen' where address='nanshan'
* DELETE - 从数据库表中删除数据   如：delete from user（表名称）where city='shenzhen'
* INSERT INTO - 向数据库表中插入数据   如：insert into user（表名称） (city, address) values ('shenzhen', 'nanshan')

### 注意：SQL 对大小写不敏感

### Sequelize 介绍
#### 书写 SQL 语句需要一定的技术能力，并且不恰当的 SQL 语句还会带来 SQL 注入漏洞。为了快捷开发，社区出现了一系列的ORM（对象关系映射）类库，来降低操作数据库的成本。在Node.js中，一般采用Sequelize这个ORM类库来操作数据库
1. 安装
```js
npm install sequelize --save
```
2. 应用（文档见：https://www.sequelize.com.cn/）
* 在建立连接时，需要传递指定数据库的名称、用户名、密码等连接参数
```js
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
```
* 定义模型，在定义模型时，也可以对字段增加一些约束，如设置默认值、是否允许为空、是否唯一等
```js
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

```

# Koa

### Koa 是基于 Node.js 的 Web 框架，其特点是轻量、健壮、富有表现力，由 Express 的原班人马打造，目前有 Koa1 和 Koa2 两种版本

### Express、Koa1 和 Koa2 最重要的区别在于异步操作的处理：

* Express： 回调函数（ES5)
* Koa1 ： Generator函数+yield语句+Promise语句（ES6)
* Express： async/await+Promise（ES7)

### Context 对象

#### Koa 将 Node.js 的 Request（请求）和Response（响应）对象封装到Context对象中，所以也可以把 Context 对象称为一次对话的上下文，通过加工 Context 对象，就可以控制返回给用户的内容。

#### Context 对象还内置了一些常用属性，如context.state、context.cookies、context.throw等，通过这些属性和方法能够实现很多功能，如路由控制、读取Cookie、返回内容给用户等。

### Koa 中间件

#### Koa 中间件函数是一个带有 context 和 next 两个参数的简单函数。context 就是上下文，封装了Request和Response等对象；next 用于把中间件的执行权交给下游的中间件。当前中间件中位于 next() 之后的代码会暂停执行，直到最后一个中间件执行完毕后，再自下而上依次执行每个中间件中next() 之后的代码，类似于一种先进后出的堆栈结构。官方给出的“洋葱模型”示意图来解释中间件的执行顺序。 

#### 常用的 Koa 中间件：koa-bodyparser（解析请求参数）、koa-router（路由控制）、koa-static（加载静态资源）、koa-views（加载HTML模板文件）等


### 简单实践：通过操作定义的数据模型来实现功能：获取所有的客户信息数据的 api

1. 操作数据库
```js
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
  // static async created(user) {
  //   return await User.created(user)
  // }
}

module.exports = {
  UserModule
}
```

2. 编写接口代码
```js
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
```
```js
// app.js
const Koa = require('koa')
const { router } = require('./app/router/user')

const app = new Koa()

app.use(router.routes())

app.listen(3000, () => {
  console.log('Koa is listening in http://localhost:3000')
})

module.exports = app
}

```