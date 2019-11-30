import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import UsersModel from '../../dbs/models/users'

// 使用本地策略,实现自动验证

passport.use(new LocalStrategy({
  usernameField: 'nickname',
  passwordField: 'pass'
}, async (username, password, done) => {
  let res = await UsersModel.findOne({ nickname: username })  // 在数据库查找记录
  if (res != null) {
    return res.pass === password ? done(null, res) : done(null, false, '密码错误')
  } else {
    return done(null, false, '用户不存在')
  }
}))


// 每次进入页面、需要进行序列化，通过 session 自动验证
// 将用户登录状态存储在 session 中，实现 http 有状态管理
// ctx.login 时触发
passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

export default passport