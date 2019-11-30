<template>
  <div> No find resources you want to see </div>
</template>

<script>
export default {
  validate ({redirect }) {
    redirect('/error/err_404')
  }
}
</script>

<style lang="scss">
</style>
