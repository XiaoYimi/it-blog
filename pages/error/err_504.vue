<template>
  <div class="page-error">
    <img
    src="@/assets/image/error/504.jpg"
    alt="作为网关或代理服务器,未及时获取远程请求"
    class="img-error">
  </div>
</template>

<script>
export default {
  async fetch ({store, params, $axios}) {
    const {status, data: { code, user }} = await $axios.get('/users/baseUser')
    if (status === 200 && code === 0) {
      store.commit('getUser', user)
    }
  },
  head () { return { title: '错误 504' } }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/error/index.scss';
</style>
