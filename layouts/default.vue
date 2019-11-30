<template>
  <el-container class="layout">
    <el-header>
      <blog-header/>
      <!-- 根据cookie user 是否存在，才决定 userBlogType 是否为 true / false（状态管理 Store 控制） -->
    </el-header>
    <el-main>
      <nuxt/>
    </el-main>
    <el-footer>
      <blog-footer/>
    </el-footer>
  </el-container>
</template>

<script>
import BlogHeader from '../components/public/header'
import BlogFooter from '../components/public/footer'
export default {
  components: {
    BlogHeader,
    BlogFooter
  }
}
</script>

<style>
</style>
