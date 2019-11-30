import Router from 'koa-router'
import axios from './utils/axios'
import ArticleModel from '../dbs/models/articles'
import GroupModel from '../dbs/models/groups'

let router = new Router({ prefix: '/articles' })

router.get('/test', async (ctx) => {
  ctx.body = {
    code: 1,
    msg: '这是第一个数据接口'
  }
})


// 首页博文
router.get('/index', async (ctx) => {
  const limitdate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
  const nowArticles = await ArticleModel.aggregate([
    { $match: { date: { $gte: limitdate } } }
  ])
  const pastArticles = await ArticleModel.aggregate([
    { $match: { date: { $lt:limitdate } } }
  ])
  const { status, data: {code, news} } = await axios.get('/news/index')
  if (status === 200 && code === 0) {
    ctx.body ={
      code: 0,
      msg: 'request ok',
      nowArticles,
      pastArticles,
      news
    }
  } else {
    ctx.body ={
      code: 0,
      msg: 'request ok',
      nowArticles,
      pastArticles
    }
  }
})

// 所有用户的博文 
router.get('/all', async (ctx) => {
  let articles = await ArticleModel.find().sort({ date: -1 })
  if (articles.length > 0) {
    ctx.body = {
      code: 0,
      msg: 'request ok',
      articles
    }
  } else {
    ctx.body = {
      code: 1,
      msg: 'no record'
    }
  }
})

// 用户所有博文
router.get('/author', async (ctx) => {
  const articles = await ArticleModel.find({ nickname: ctx.query.nickname }).sort({ date: -1 })
  if (articles.length >  0) {
    ctx.body = {
      code: 0,
      msg: 'request ok',
      articles
    }
  } else {
    ctx.body = {
      code: 1,
      msg: 'no record'
    }
  }
})

// 博文发布
router.post('/publishArticle', async (ctx) => {
  const { title, content, nickname, group } = ctx.request.body
  if (title === '') {
    ctx.body = {
      code: -1,
      msg: '发布失败,缺少标题'
    }
    return
  }
  if (nickname && group) {
    const aid = Math.random().toString().slice(2) + ['a', 'b', 'c', 'd'][Math.floor(Math.random() * 4)]
    const res = await ArticleModel.create({
      aid,
      nickname,
      group,
      title,
      content
    })
    if (res !== null) {
      const findgroups = await GroupModel.findOne({ nickname }, { _id: 0, list: 1 })
      const nfindgroups = findgroups.list.map(item => {
        if (item.name === group) { item.count += 1 }
        return item
      })
      const update = await GroupModel.updateOne({ nickname }, {
        $set: { list: nfindgroups }
      })
      if (update.nModified === 1) {
        ctx.body = {
          code: 0,
          msg: '发布成功',
          article: res
        }
      } else {
        ctx.body = {
          code: 1,
          msg: '数据库操作错误'
        }
      }
  
    } else {
      ctx.body = {
        code: -1,
        msg: '发布失败, 数据库创建失败'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '用户名或组无法确定，发布失败'
    }
  }
})

// 用户组所有博文
router.get('/group', async (ctx) => {
  const { nickname, group } = ctx.query
  if (nickname && group) {
    const articles = await ArticleModel.find({ nickname, group }).sort({ date: -1 })
    if (articles.length > 0) {
      ctx.body = {
        code: 0,
        msg: 'request ok',
        articles
      }
    } else {
      ctx.body = {
        code: 1,
        msg: '暂无博文记录'
      }
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '获取失败，页面传参错误'
    }
  }
})

// 博文详细
router.get('/detail', async (ctx) => {
  const { aid, nickname, group } = ctx.query
  if (aid && nickname && group) {
    const find = await ArticleModel.findOne({ nickname, aid, group }, { _id: 0, reading: 1 })
    const reading = find.reading + 1
    await ArticleModel.updateOne({nickname, aid}, {
      $set: { reading }
    })
    const article = await ArticleModel.findOne({ nickname, aid, group })
    if (article !== null) {
      ctx.body = {
        code: 0,
        msg: 'request ok',
        article
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '该博问不存在或已删除'
      }
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '页面传参错误,获取失败'
    }
  }
})

// 文章阅读 reading + 1,注意 created 会执行 2次， mounted 执行一次
router.post('/read', async (ctx) => {
  const { nickname, aid } = ctx.request.body
  if (nickname && aid) {
    const find = await ArticleModel.findOne({nickname, aid}, { _id: 0, reading: 1 })
    if (find !== null) {
      const reading = find.reading + 1
      const update = await ArticleModel.updateOne({nickname, aid}, {
        $set: { reading }
      })
      ctx.body = {
        code: 0,
        msg: 'request ok'
      }
    } else {
      ctx.body = {
        code: 1,
        msg: 'this record is not find'
      }
    }
  } else {
    ctx.body = {
      code: 404,
      msg: 'understand constom request'
    }
  }
})

// 删除用户指定博文
router.post('/deleteArticle', async (ctx) => {
  const { nickname, group, aid } = ctx.request.body
  if (nickname && group && aid) {
    const article = await ArticleModel.deleteOne({ nickname, group, aid })
    if (article.n === 1) {
      const groups = await GroupModel.findOne({ nickname })
      const list = groups.list.map(item => {
        if (item.name === group) { item.count -= 1 }
        return item
      })
      await GroupModel.updateOne({ nickname }, {
        $set: { list }
      })
      ctx.body = {
        code: 0,
        msg: '删除成功',
        groups: list
      }
    } else {
      ctx.body = {
        code: 1,
        msg: '删除失败'
      }
    } 
  } else {
    ctx.body = {
      code: 1,
      msg: '页面传参错误,删除失败'
    }
  }
})

// 博文修改
router.post ('/modifyArticle', async (ctx) => {
  const { nickname, group, aid, title, content } = ctx.request.body
  if (nickname && group && aid && title && content) {
    const update = await ArticleModel.updateOne({ nickname, group, aid }, {
      $set: {
        title,
        content,
        date: new Date()
      }
    })
    if (update.nModified === 1) {
      ctx.body = {
        code: 0,
        msg: '博文修改成功'
      }
    } else {
      ctx.body = {
        code: 1,
        msg: '数据库操作失败,博文修改失败'
      }
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '页面传参错误,博文修改失败'
    }
  }
})

export default router