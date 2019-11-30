import Router from 'koa-router'
import MessageModel from '../dbs/models/messages'

let router = new Router({ prefix: '/messages' })

// 查用用户所有消息
router.get('/all', async (ctx) => {
  const messages = await MessageModel.find({ to: ctx.query.nickname, selfcontrl: false }).sort({ date: -1 })
  if (messages.length > 0) {
    ctx.body = {
      code: 0,
      msg: 'request ok',
      messages
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '暂无数据',
      messages: []
    }
  }
})

// 详细消息
router.get('/detail', async (ctx) => {
  const { nickname, mid } = ctx.query
  if (nickname && mid) {
    const message = await MessageModel.findOne({ to: nickname, mid })
    if (message !== null) {
      ctx.body = {
        code: 0,
        msg: 'request ok',
        message
      }
    } else {
      ctx.body = {
        code: 1,
        msg: 'no find you requested'
      }
    }
  } else {
    ctx.body = {
      code: 404,
      msg: 'request err'
    }
  }
})

// 发送消息
router.post('/sendMsg', async (ctx) => {
  const fromMid = Math.random().toString().slice(2) + ['a', 'b', 'c', 'd'][Math.floor(Math.random() * 4)]
  const toMid = Math.random().toString().slice(2) + ['a', 'b', 'c', 'd'][Math.floor(Math.random() * 4)]
  const date = new Date()
  const isnew = true
  const { from, to, title, content } = ctx.request.body
  if (from && to && title && content) {
    const fromCreate = await MessageModel.create({
      from, to, title, content,
      isnew,
      date,
      selfcontrl: true,
      mid: fromMid
    })
    const toCreate = await MessageModel.create({
      from, to, title, content,
      isnew,
      date,
      selfcontrl: false,
      mid: toMid
    })
    if (fromCreate && toCreate) {
      ctx.body = {
        code: 0,
        msg: '发送成功'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '数据库操作错误,发送失败'
      }
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '缺少访问接口参数,发送失败'
    }
  }
})

export default router