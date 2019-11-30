<template>
  <div class="page-exit">
    正在退出... 
  </div>
</template>

<script>
export default {
  layout: 'blank',
  fetch ({ store }) {
    store.commit('clearUser')
  },
  async mounted () {
    const { status, data } = await this.$axios.get('/users/exit')
    let re, r, n = 'limitNumber'
    if (status === 200 && data.code === 0) {
      r = new RegExp("(^| )" + n + "=([^;]*)(;|$)")
      if (re = document.cookie.match(r)) {
        re = re[2]
      } else {
        re = null
      }
      let now = new Date()
      let pass = now.setTime(now.getTime() - 1)
      pass = new Date(pass).toGMTString()
      if (re != null) {
        document.cookie = n + "=" + re + ";expires=" + pass
      }
      setTimeout(() => { window.location = '/' }, 400)
    } else {
      console.log(status, data.code)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-exit {
  padding: 10px 20px;
  font-size: 18px;
}
</style>
