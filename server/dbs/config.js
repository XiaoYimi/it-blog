export default {
  // 数据库地址
  dbs: 'mongodb://127.0.0.1:27017/blog',

  // redis 服务器地址
  redis: {
    get host () { return '127.0.0.1' },
    get port () { return 6379 }
  },

  // QQ邮箱服务(smtp)
  smtp: {
    get host () { return 'smtp.qq.com' /** 不得更改 */ },
    get user () { return '2590856083@qq.com' /** 邮箱(发送方) */ },
    get pass () { return '<pass_code>' /** 邮箱发送需要的令牌 */ },

    // 验证码生成
    get code () { return () => {
      return Math.random().toString().slice(2,6).toUpperCase()
    }},
    // 验证码有效时长 (1 minutes)
    get expire () { return () => {
      return new Date().getTime() + 60 * 1000
    }}
  }

}