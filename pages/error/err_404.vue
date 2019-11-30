<template>
  <div class="page-error">
    <img
    src="@/assets/image/error/404.jpg"
    alt="您在这儿怎么找,也没有你想要的东西唷"
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
  head () { return { title: '错误 404' } }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/error/index.scss';
</style>
