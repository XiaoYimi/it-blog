import Koa from 'koa'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'

// 加载必要的包模块
import mongoose from 'mongoose'
import bodyParser from 'koa-bodyparser' // 用于获取上传的数据
import Redis from 'koa-redis' // 用于存储 验证、数据缓存、快速存储的数据
import session from 'koa-generic-session' // 用于管理操作 session
import Json from 'koa-json' // 用于格式化 json 数据
import dbConfig from './dbs/config' // 数据库配置
import passport from './interface/utils/passport' // 用于自动验证
import users from './interface/users' // user 模块接口
import articles from './interface/articles' // article 接口
import qas from './interface/qas' // qa 接口
import messages from './interface/messages' // messages 接口
import position from './interface/position' // position 接口
import contacts from './interface/contacts' // contacts 接口
import groups from './interface/groups' // groups 接口
import collections from './interface/collections' // collections 接口
import news from './interface/news' // news 接口


const app = new Koa()

// Import and Set Nuxt.js options
import config from '../nuxt.config'
config.dev = app.env !== 'production'

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // 启用 redis 服务，并配置 cookie 秘钥(session加密)和签名
  app.keys = ['itblog', 'blog']
  app.proxy = true
  app.use(session({
    key: 'itblog',
    prefix: 'itblog:uid',
    store: new Redis()
  }))

  // 数据库连接，并开启自动登录验证
  mongoose.set('useCreateIndex', true)
  mongoose.connect(dbConfig.dbs, {
    useNewUrlParser: true
  })
  app.use(passport.initialize())
  app.use(passport.session())


  // 使用获取上传数据的中间件
  app.use(bodyParser({
    extendTypes: ['text', 'json', 'form']
  }))

  // 使用格式化化数据中间件
  app.use(Json())

  // 加载路由配置(模块接口)
  app.use(users.routes()).use(users.allowedMethods())
  app.use(articles.routes()).use(articles.allowedMethods())
  app.use(qas.routes()).use(qas.allowedMethods())
  app.use(messages.routes()).use(messages.allowedMethods())
  app.use(position.routes()).use(position.allowedMethods())
  app.use(contacts.routes()).use(contacts.allowedMethods())
  app.use(groups.routes()).use(groups.allowedMethods())
  app.use(collections.routes()).use(collections.allowedMethods())
  app.use(news.routes()).use(news.allowedMethods())  

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
