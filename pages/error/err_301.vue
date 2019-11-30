<template>
  <div class="page-error">
    <img
    src="@/assets/image/error/301.jpg"
    alt="您请求的资源永久移走,请重定向请求资源"
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
  head () { return { title: '错误 301' } }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/error/index.scss';
</style>
