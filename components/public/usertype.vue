<template>
  <div class="user-type-wrapper">
    <dl class="mobile-blog-type mobile-blog-type-user">
      <dt class="mobile-blog-type-title">IT博分类</dt>
      <dd class="mobile-blog-type-item" @click="handleClose"><nuxt-link to="/">Javascript</nuxt-link></dd>
      <dd class="mobile-blog-type-item" @click="handleClose"><nuxt-link to="/">HTML5</nuxt-link></dd>
      <dd class="mobile-blog-type-item" @click="handleClose"><nuxt-link to="/">CSS3</nuxt-link></dd>
      <dd class="mobile-blog-type-item" @click="handleClose"><nuxt-link to="/">Python</nuxt-link></dd>
      <dd class="mobile-blog-type-item" @click="handleClose"><nuxt-link to="/">PHP</nuxt-link></dd>
      <dd class="mobile-blog-type-item" @click="handleClose"><nuxt-link to="/">Java</nuxt-link></dd>
    </dl>
  </div>
</template>

<script>
export default {
  props: {
    methods: {
      closeDrawer () {
        console.log(8888)
        // this.$emit('handleClose')
      }
    }
  }
}
</script>

<style lang="scss">

</style>

