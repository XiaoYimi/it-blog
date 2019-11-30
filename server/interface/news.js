import Router from 'koa-router'
import NewsModel from '../dbs/models/news' 

let router = new Router({ prefix: '/news' })

// 首页新闻
router.get('/index', async (ctx) => {
  const news = await NewsModel.find().sort({ date: -1 }).limit(5)
  if (news.length > 0) {
    ctx.body = {
      code: 0,
      msg: 'request ok',
      news
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '暂无可发布新闻',
      news
    }
  }
})

// 新闻发布
router.post('/publish', async (ctx) => {
  const { title, content } = ctx.request.body
  const nid = Math.random().toString().slice(2) + ['a', 'b', 'c', 'd'][Math.floor(Math.random() * 4)]
  if (title && content) {
    const inserted = await NewsModel.create({ title, content, nid })
    inserted !== null ? ctx.body = {
      code: 0,
      msg: '发布成功'
    } : ctx.body = {
      code: 0,
      msg: '数据库操作失败,发布失败'
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '新闻发布的标题或内容不能为空'
    }
  }
})

// 新闻详情
router.get('/detail', async (ctx) => {
  const nid = ctx.query.nid
  const find = await NewsModel.findOne({ nid }, { _id: 0, reading: 1 })
  await NewsModel.updateOne({ nid }, {
    $set: { reading: find.reading + 1 }
  })
  const news = await NewsModel.findOne({ nid })
  if (news !== null) {
    ctx.body = {
      code: 0,
      msg: 'request ok',
      news
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '未找到相关记录'
    }
  }
})

export default router