import Router from 'koa-router'
import QaModel from '../dbs/models/problems'
import AnswerModel from '../dbs/models/answers'

let router = new Router({ prefix: '/qas' })

router.get('/test', async (ctx) => {
  ctx.body = {
    code: 0,
    msg: '/qas/test request ok'
  }
})

// 所有问答
router.get('/all', async (ctx) => {
  const qas = await QaModel.find().sort({ date: -1 }).limit(30)
  if (qas.length > 0) {
    ctx.body = {
      code: 0,
      msg: 'request ok',
      qas
    }
  } else {
    ctx.body = {
      code: 1,
      msg: 'no record'
    }
  }
})

// 博问发布
router.post('/publishQa', async (ctx) => {
  const { nickname, title, content } = ctx.request.body
  if (title === '' || content === '') {
    ctx.body = {
      code: -1,
      msg: '所提问的标题或描述为空,发布失败'
    }
    return
  }
  if (nickname) {
    const qid = Math.random().toString().slice(2) + ['a', 'b', 'c', 'd'][Math.floor(Math.random() * 4)]
    const res = await QaModel.create({ title, content, nickname, qid })
    if (res !== null) {
      ctx.body = {
        code: 0,
        msg: '发布成功',
        qa: res
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '发布失败, mongodb error'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '需要身份认证登录提问'
    }
  }
})

// 博问详情
router.get('/detail', async (ctx) => {
  const { nickname, qid } = ctx.query
  const reading_find = await QaModel.findOne({ nickname, qid }, { _id: 0, reading: 1 })
  const reading = reading_find.reading + 1
  await QaModel.updateOne({ nickname, qid }, {
    $set: { reading }
  })
  if (nickname && qid) {
    const find = await QaModel.findOne({ nickname, qid })
    const answers = await AnswerModel.find({ nickname, qid }).sort({ date: -1 })
    let qa
    if (find !== null) {
      qa = find
    } else {
      ctx.body = {
        code: 1,
        msg: '数据库操作失败'
      }
      return false
    }
    if (answers.length > 0) {
      ctx.body = {
        code: 0,
        msg: 'request ok',
        qa,
        answers
      }
    } else {
      ctx.body = {
        code: 0,
        msg: '暂未有博友回答该问题',
        qa,
        answers: []
      }
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '请求参数错误,访问失败'
    }
  }
})

// 博问回答
router.post('/answer', async (ctx) => {
  const { nickname, qid, answer, content } = ctx.request.body

  if (!answer) {
    ctx.body = {
      code: 401,
      msg: '请登录后再来评论'
    }
    return false
  }

  if (nickname && qid && answer && content) {
    const created = await AnswerModel.create({ nickname, qid, answer, content, date: new Date() })
    if (created !== null) {
      const finds = await AnswerModel.find({ nickname, qid }).sort({ date: -1 })
      ctx.body = {
        code: 0,
        msg: '发送成功',
        answers: finds
      }
    } else {
      ctx.body = {
        code: 1,
        msg: '数据库操作失败,发送失败',
      }
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '缺少请求必要的参数,发送失败'
    }
  }
})



export default router