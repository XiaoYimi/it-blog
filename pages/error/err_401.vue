<template>
  <div class="page-error">
    <img
    src="@/assets/image/error/401.jpg"
    alt="您请求的资源要求用户身份认证"
    class="img-error">
  </div>
</template>

<script>
export default {
  async fetch ({store, $axios}) {
    const {status, data: { code, user }} = await $axios.get('/users/baseUser')
    if (status === 200 && code === 0) {
      store.commit('getUser', user)
    }
  },
  head () { return { title: '错误 401' } }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/error/index.scss';
</style>
