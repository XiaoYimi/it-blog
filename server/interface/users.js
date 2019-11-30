import Router from 'koa-router'
import Redis from 'koa-redis'
import axios from './utils/axios'
import passport from './utils/passport'
import nodeMailer from 'nodemailer'
import dbConfig from '../dbs/config'
import UserModel from '../dbs/models/users'
import ContactModel from '../dbs/models/contacts'
import GroupModel from '../dbs/models/groups'
import CollectionModel from '../dbs/models/collections'
import MessageModel from '../dbs/models/messages'
import ProblemModel from '../dbs/models/problems'
import ArticleModel from '../dbs/models/articles'

// 为当前所有接口归为一个模块 users
let router = new Router({ prefix: '/users' })

// 用于 session 存储的数据
let Store = new Redis().client

router.get('/test', async (ctx) => {
  ctx.body = {
    code: 1,
    msg: '这是第一个数据接口'
  }
})

// 验证码获取
router.post('/verify', async (ctx) => {
  // 获取用户邮箱(接收方)
  const nickname = ctx.request.body.nickname

  // 获取 resis 保存的 expire (有效时长)
  const saveExpire = await Store.hget(`nodemail:${nickname}`, 'expire')

  // 检测是否频繁获取验证码
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证码获取过于频繁,1 分钟 1 次'
    }
    return
  }

  // 定义邮件发送方信息
  let transpoter = nodeMailer.createTransport({
    service: 'qq',
    auth: {
      user: dbConfig.smtp.user,
      pass: dbConfig.smtp.pass
    }
  })

  // 定义邮件接收方信息
  let receiver = {
    code: dbConfig.smtp.code(),
    expire: dbConfig.smtp.expire(),
    email: ctx.request.body.signup,
    user: ctx.request.body.nickname
  }

  // 进行邮箱服务配置
  let mailOptions = {
    from: `"认证邮件" <${dbConfig.smtp.user}>`,
    to: receiver.email,
    subject: '《IT 博官网》注册码',
    html: `您正在 IT 博官网注册,注册码：${receiver.code}`
  }

  // 实现注册码邮件发送
  await transpoter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    } else {
      // 验证码发送成功，并保存该信息，以便验证使用
      Store.hmset(`nodemail:${receiver.user}`, 'code', receiver.code, 'expire', receiver.expire, 'email', receiver.email)
    }
  })

  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能因网络会有所延迟'
  }
})

// 注册
router.post('/signup', async (ctx) => {
  // 获取客户端用户表单信息
  const { signup, nickname, pass, occupation, code } = ctx.request.body

  if (code) {
    // 获取 redis 存储的验证码和时长
    const saveCode = await Store.hget(`nodemail:${nickname}`, 'code')
    const saveExpire = await Store.hget(`nodemail:${nickname}`, 'expire')

    // 验证码判断
    if (saveCode === code) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新发送'
        }
        return false
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '请填写正确验证码'
      }
      return false
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请输入验证码'
    }
    return false
  }

  // 数据库查找该用户，存在则提示已被注册，不存在则写入库
  let user = await UserModel.find({ nickname })
  // 存在记录，则已被注册
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '该用户名已被注册'
    }
    return false
  }

  // 写入数据库
  let nuser = await UserModel.create({ nickname, signup, pass, occupation })
  let ncontact = await ContactModel.create({ nickname, email: signup })
  let ngroup = await GroupModel.create({ nickname, list: [{ name: 'default', count: 0 }] })
  let ncollection = await CollectionModel.create({ nickname })
  const mid = Math.random().toString().slice(2) + ['a', 'b', 'c', 'd'][Math.floor(Math.random() * 4)]
  let nmessage = await MessageModel.create({
    mid,
    from: 'System',
    to: nickname,
    title: '欢迎您注册 IT 博',
    content: '欢迎您加入 IT 博,成为 IT 博会员; 接下来的日子, IT 博将陪伴您成长...'
  })


  // 通过数据库返回结果判断是否注册状态  
  if (nuser && ncollection && ncontact && ngroup && nmessage) {
    let res = await axios.post('/users/signin', { nickname, pass }) // 写入数据库后，自我验证
    if (res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: '注册成功'
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'mongodb error'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})

// 登录
router.post('/signin', async (ctx, next) => {
  return passport.authenticate('local', (error, user, info, status) => {
    if (error) {
      ctx.body = {
        code: -1,
        msg: error
      }
    } else {
      if (user) {
        const token = Math.random().toString().slice(2,10) + ['a', 'b', 'c', 'd'][Math.floor(Math.random() * 4)]
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user,
          limitNumber: token
        }
        return ctx.login(user)
      } else {
        ctx.body = {
          code: -1,
          msg: info
        }
      }
    }
  })(ctx, next)
})

// 获取用户信息
router.get('/baseUser', async (ctx) => {
  if (ctx.isAuthenticated()) {
    let user = await ctx.session.passport.user
    if (user.nickname) {
      let res = await UserModel.aggregate([
        { $project: { pass: 0 } },
        { 
          $lookup: { from: 'contacts', localField: 'nickname', foreignField: 'nickname', as: 'contacts' }
        },
        {
          $lookup: { from: 'groups', localField: 'nickname', foreignField: 'nickname', as: 'groups' }
        }
      ])
      res = res.filter(item => { return item.nickname === user.nickname })
      if (res.length === 1) {
        res = res[0]
        res.contacts = res.contacts[0]
        res.groups = res.groups[0].list
        ctx.body = {
          code: 0,
          msg: 'request ok',
          user: res
        }
      } else {
        ctx.body = {
          code: 1,
          msg: '重复用户'
        }
      }
    } else {
      ctx.body = {
        code: 1,
        msg: 'passport 获取用户失败'
      }
    }
  } else {
    ctx.body = {
      code: 401,
      msg: '请求需身份认证登录'
    }
  }
})

// 退出登录
router.get('/exit', async (ctx) => {
  await ctx.logout()
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0,
      msg: 'exit ok',
    }
  } else {
    ctx.body = {
      code: -1,
      msg: 'exit fail'
    }
  }
})

// 注销账户
router.post('/cancellation', async (ctx) => {
  if (ctx.isAuthenticated()) {
    const user = await ctx.session.passport.user
    if (user.nickname === ctx.request.body.nickname) {
      await UserModel.deleteMany({ nickname: user.nickname })
      await MessageModel.deleteMany({ from: 'System', to: user.nickname })
      await MessageModel.deleteMany({ from: user.nickname, selfcontrol: true })
      await GroupModel.deleteMany({ nickname: user.nickname })
      await ArticleModel.deleteMany({ nickname: user.nickname })
      await ProblemModel.deleteMany({ nickname: user.nickname })
      await ContactModel.deleteMany({ nickname: user.nickname })
      await CollectionModel.deleteMany({ nickname: user.nickname })
      await ctx.logout()
      ctx.body = {
        code: 0,
        msg: '注销成功'
      }
    } else {
      ctx.body = {
        code: 2,
        msg: '注销失败,参数与身份不一致'
      }
    }
    ctx.body = {
      code: 0,
      msg: 'cancellation ok'
    }
  } else {
    ctx.body = {
      code: 401,
      msg: '请求需身份认证登录'
    }
  }
})

// 删除爱好标签
router.post('/deleteTag', async (ctx) => {
  const { tag, nickname } = ctx.request.body
  const find = await UserModel.findOne({ nickname, hobby: tag }, { _id: 0 })
  if (find !== null) {
    const hobbys = find.hobby.filter(item => { return item !== tag })
    const update = await UserModel.updateOne({ nickname, hobby: tag }, {
      $set: { hobby: hobbys }
    })
    if (update.nModified === 1) {
      const findhobby = await UserModel.findOne({ nickname }, { _id: 0, hobby: 1 })
      ctx.body = {
        code: 0,
        msg: 'delete tag ok',
        hobby: findhobby
      }
    } else {
      ctx.body = {
        code: 1,
        msg: 'no delete tag'
      }
    }
  } else {
    ctx.body = {
      code: 1,
      msg: 'no find this tag'
    }
  }
})

// 添加爱好标签
router.post('/createTag', async (ctx) => {
  const { newtag, nickname } = ctx.request.body
  const find = await UserModel.findOne({ nickname }, { _id: 0, hobby: 1 })
  find.hobby.push(newtag)
  if (find !== null) {
    const update = await UserModel.updateOne({ nickname }, {
      $set: { hobby: find.hobby }
    })
    if (update.nModified === 1) {
      ctx.body = {
        code: 0,
        msg: 'create tag ok',
        hobby: find.hobby
      }
    } else {
      ctx.body = {
        code: 1,
        msg: 'no create tag'
      }
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '未找到 hobby 字段'
    }
  }
})

// 所有用户
router.get('/all', async (ctx) => {
  const finds = await UserModel.aggregate([
    { $project: { pass: 0 } },
    { $lookup: { from: 'contacts', localField: 'nickname', foreignField: 'nickname', as: 'contacts' } }
  ])
  if (finds.length > 0) {
    ctx.body = {
      code: 0,
      msg: 'request ok',
      users: finds
    }
  } else {
    ctx.body = {
      code: 1,
      msg: 'No find record'
    }
  }
})


// 全局搜索用户和博文
router.get('/search', async (ctx) => {
  const keyword = ctx.query.keyword
  const user_finds = await UserModel.aggregate([
    { $project: { pass: 0 } },
    { $match: { nickname: { $regex: new RegExp(keyword) } }}
  ])
  const article_finds = await ArticleModel.aggregate([
    { $match: { title: { $regex: new RegExp(keyword) } } }
  ])
  ctx.body = {
    code: 0,
    mag: 'request ok',
    users: user_finds,
    articles: article_finds
  }
})

// 用户详情页
router.get('/detail', async (ctx) => {
  const nickname = ctx.query.nickname
  let user_find = await UserModel.aggregate([
    { $project: { _id: 0, pass: 0 }},
    { $lookup: { from: 'groups', localField: 'nickname', foreignField: 'nickname', as: 'groups' }},
    { $lookup: { from: 'contacts', localField: 'nickname', foreignField: 'nickname', as: 'contacts' }},
    { $match: { nickname }}
  ])
  // console.log(user_find[0].groups[0].list)
  user_find[0].groups = user_find[0].groups[0].list
  user_find[0].contacts = user_find[0].contacts[0]
  ctx.body = {
    code: 0,
    msg: 'request ok',
    user: user_find[0]
  }
})

export default router