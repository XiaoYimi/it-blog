<template>
  <el-container class="layout">
    <el-header>
      <blog-header/>
    </el-header>
    <el-container>
      <el-aside class="layout-aside">
        <blog-aside/>
      </el-aside>
      <el-main>
        <nuxt/>
      </el-main>
    </el-container>
    <el-footer>
      <blog-footer/>
    </el-footer>
  </el-container>
</template>

<script>
import BlogHeader from '../components/public/header'
import BlogFooter from '../components/public/footer'
import BlogAside from '../components/public/aside'
export default {
  components: {
    BlogHeader,
    BlogFooter,
    BlogAside
  }
}
</script>

<style>
</style>
