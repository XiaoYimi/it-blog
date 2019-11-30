import Router from 'koa-router'
import CollectionModel from '../dbs/models/collections'

let router = new Router({ prefix: '/collections' })

// 添加收藏
router.post('/add', async (ctx) => {
  const { myself, nickname, group, aid, title } = ctx.request.body
  if (nickname && group && aid && title) {
    const find = await CollectionModel.findOne({ nickname: myself }, { _id: 0, list: 1 })
    const hasCollection = find.list.some(item => {
      return item.nickname === nickname && item.group === group && item.aid === aid
    })
    if (hasCollection) {
      ctx.body = { code: 0, msg: '该收藏已存在' }
    } else {
      const update = await CollectionModel.updateOne({ nickname: myself }, {
        $push: {
          list: { nickname, group, aid, title }
        }
      })
      if (update.nModified === 1) {
        ctx.body = {
          code: 0,
          msg: '添加收藏成功',
          state: true
        }
      } else {
        ctx.body = {
          code: 1,
          msg: '数据库操作失败,添加收藏失败'
        }
      }
    }

  } else {
    ctx.body = {
      code: 1,
      msg: '缺少页面传递参数,添加收藏失败'
    }
  }
})

// 是否收藏
router.get('/hasCollection', async (ctx) => {

  const { myself, nickname, group, aid } = ctx.query
  if (nickname && group && aid) {

    if (ctx.isAuthenticated()) {
      const find = await CollectionModel.findOne({ nickname: myself }, { _id: 0, list: 1 })
      const hasCollection = find.list.some(item => {
        return item.nickname === nickname && item.group === group && item.aid === aid
      })
      if (hasCollection) {
        ctx.body = {
          code: 0,
          msg: '标星状态 true',
          state: true,
          hasUser: true
        }
      } else {
        ctx.body = {
          code: 1,
          msg: '标星状态 false',
          hasUser: true
        }
      }
    } else {
      ctx.body = {
        code: 0,
        msg: 'request ok',
        hasUser: false
      }
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '缺少页面传递参数,标星收藏状态更新失败',
    }
  }


})

// 取消收藏
router.post('/delete', async (ctx) => {
  const { myself, nickname, group, aid, title } = ctx.request.body
  if (nickname && group && aid && title) {
    const find = await CollectionModel.findOne({ nickname: myself }, { _id: 0, list: 1 })
    const hasCollection = find.list.some(item => {
      return item.nickname === nickname && item.group === group && item.aid === aid
    })
    if (hasCollection) {
      const update = await CollectionModel.updateOne({ nickname: myself }, {
        $pull: {
          list: { nickname, group, aid }
        }
      })
      if (update.nModified === 1) {
        ctx.body = {
          code: 0,
          msg: '取消收藏成功',
          state: false
        }
      } else {
        ctx.body = {
          code: 1,
          msg: '数据库操作失败,取消收藏失败'
        }
      } 
    } else {
      ctx.body = {
        code: 1,
        msg: '查找不到你收藏的记录'
      }
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '缺少页面传递参数,取消收藏失败'
    }
  }
})

// 用户收藏列表
router.get('/all', async (ctx) => {
  const find = await CollectionModel.findOne({ nickname: ctx.query.nickname }, { _id: 0, list: 1 })
  const collections = find.list
  ctx.body = {
    code: 0,
    msg: 'request ok',
    collections
  }
})

export default router