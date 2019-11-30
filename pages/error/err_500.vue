<template>
  <div class="page-error">
    <img
    src="@/assets/image/error/500.jpg"
    alt="服务器内部错误,无法完成请求"
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
  head () { return { title: '错误 500' } }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/error/index.scss';
</style>
