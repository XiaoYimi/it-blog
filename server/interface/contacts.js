import Router from 'koa-router'
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'
import dbConfig from '../dbs/config'
import ContactModel from '../dbs/models/contacts'

let router = new Router({ prefix: '/contacts' })
const Store = new Redis().client

router.get('/test', (ctx) => {
  ctx.body = {
    code: 0,
    msg: '/contacts/test ok'
  }
})

// 修改联系方式 必传的验证码
router.post('/verify', async (ctx) => {
  const { nickname, email } = ctx.request.body
  if (nickname && email) {
    const saveExpire = await Store.hget(`nodemail:${nickname}`, 'expire')
    if (saveExpire && new Date().getTime() - saveExpire < 0) {
      ctx.body = {
        code: 1,
        msg: '验证码获取过于频繁,1 分钟 1 次'
      }
      return false
    }

    let transpoter = nodeMailer.createTransport({
      service: 'qq',
      auth: {
        user: dbConfig.smtp.user,
        pass: dbConfig.smtp.pass
      }
    })

    const receiver = {
      code: dbConfig.smtp.code(),
      expire: dbConfig.smtp.expire(),
      email,
      user: nickname
    }

    const mailOptions = {
      from: `"认证邮件" <${dbConfig.smtp.user}>`,
      to: receiver.email,
      subject: '《IT 博官网》验证码', 
      html: `此刻您正在修改账户的联系方式,验证码： ${receiver.code}`
    }

    await transpoter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error)
      } else {
        Store.hmset(`nodemail:${receiver.user}`, 'code', receiver.code, 'expire', receiver.expire, 'email', receiver.email)
      }
    })

    ctx.body = {
      code: 0,
      msg: '验证码已发送，可能因网络会有所延迟'
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '获取验证码失败,传参错误'
    }
  }
})

// 修改所有联系方式
router.post('/changeContacts', async (ctx) => {
  if (ctx.isAuthenticated()) {
    const { nickname, wechat, qq, weibo, email, phone, code } = ctx.request.body
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

      const find = await ContactModel.findOne({ nickname })
      if (find != null) {
        const update = await ContactModel.updateOne({ nickname }, {
          $set: { wechat, qq, weibo, email, phone }
        })
        if (update.nModified === 1) {
          ctx.body = {
            code: 0,
            msg: '修改成功'
          }
        } else {
          ctx.body = {
            code: 1,
            msg: '修改失败,数据更新失败'
          }
        }
      } else {
        ctx.body = {
          code: 1,
          msg: '查找不到该用户的联系方式'
        }
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '请输入验证码'
      }
      return false
    }
  } else {
    ctx.body = {
      code: 401,
      msg: '请求需身份认证登录'
    }
  }
})

export default router