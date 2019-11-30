<template>
  <div class="page-qas">
    user/:username/qas/index
  </div>
</template>

<script>
export default {
  async fetch ({store, params, $axios}) {
    const {status, data: { code, user }} = await $axios.get('/users/baseUser')
    if (status === 200 && code === 0) {
      store.commit('getUser', user)
    }
  }
}
</script>

<style lang="scss">
</style>
