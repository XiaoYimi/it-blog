import Cookie from '@/server/interface/utils/cookie'

export default async ({ route, $axios, req, redirect }) => {
  let isServer = process.server
  let isClient = process.client
  let redirectURL = '/error/err_401'
  let token, path

  if (isServer) {
    let cookies = Cookie.getCookieInServer(req)
    path = req.originalUrl
    token = cookies.limitNumber ? cookies.limitNumber : ''
  }
  if (isClient) {
    token = Cookie.getCookieInClient('limitNumber')
    path = route.path
  }
  // 获取路径目录 '/user' 的下一个目录是否是该用户 (http://localhost:3000/user/用户/...)
  const userNextFile = path.split('/')[2] 
  const { data: { user }} = await $axios.get('/users/baseUser')

  if (!token || !user || (userNextFile !== user.nickname)){
    redirect(redirectURL)
  }

}