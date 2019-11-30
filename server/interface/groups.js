import Router from 'koa-router'
import GroupModel from '../dbs/models/groups'
import ArticleModel from '../dbs/models/articles'

let router = new Router({ prefix: '/groups' })

// 查询所有组
router.get('/all', async (ctx) => {
  const { nickname } = ctx.query
  const finds = await GroupModel.findOne({ nickname }, { _id: 0, list: 1 })
  if (finds !== null) {
    ctx.body = {
      code: 0,
      msg: 'request ok',
      groups: finds.list
    }
  } else {
    ctx.body = {
      code: 1,
      msg: 'No find record'
    }
  }
})

// 创建博文分组
router.post('/createGroup', async (ctx) => {
  const { newgroup, nickname } = ctx.request.body
  if (newgroup && nickname) {
    const find = await GroupModel.findOne({ nickname }, { _id: 0, list: 1 })
    const hasNewgroup = find.list.some((item) => { return item.name === newgroup })
    if (!hasNewgroup) {
      const newlist = find.list
      newlist.push({ count: 0, name: newgroup })
      const update = await GroupModel.updateOne({ nickname }, {
        $set: { list: newlist }
      })
      if (update.nModified === 1) {
        ctx.body = {
          code: 0,
          msg: '创建组成功',
          groups: newlist
        }
      } else {
        ctx.body = {
          code: 1,
          msg: '创建组失败'
        }
      }
    } else {
      ctx.body = {
        code: 1,
        msg: '所创建组已存在'
      }
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '参数丢失,创建组失败'
    }
  }
})

// 删除博文分组
router.post('/deleteGroup', async (ctx) => {
  const { group, nickname } = ctx.request.body
  if (group && nickname) {
    const find = await GroupModel.findOne({ nickname }, { _id: 0, list: 1 })
    const hasGroup = find.list.some(item => { return item.name === group })
    if (hasGroup) {
      const newgroups = find.list.filter(item => { return item.name !== group})
      const update = await GroupModel.updateOne({ nickname }, {
        $set: { list: newgroups }
      })
      if (update.nModified === 1) {
        await ArticleModel.deleteMany({ nickname, group })
        ctx.body = {
          code: 0,
          msg: '删除组成功',
          groups: newgroups
        }
      } else {
        ctx.body = {
          code: 1,
          msg: '删除中组失败'
        }
      }
    } else {
      ctx.body = {
        code: 1,
        msg: '数据表未找到该组'
      }
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '参数丢失,删除失败'
    }
  }
})

export default router