// 获取访问页面令牌 Cookie (limitNumber) 
import Cookie from 'js-cookie'
export default {
  getCookieInServer (req) {
    let cookies = {}
    req && req.headers.cookie && req.headers.cookie.split(';').forEach(val => {
      let items = val.split('=')
      cookies[items[0].trim()] = (items[1] || '').trim()
    })
    return cookies
  },
  getCookieInClient (key) {
    const getcookie = Cookie.get(key)
    return getcookie ? getcookie : ''
  }
}