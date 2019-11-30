<template>
  <div class="blog-header">
    <el-row :gutter="8">
      <el-col :span="2" class="blog-logo-wrapper">
        <img
          src="https://ccdn.goodq.top/caches/b2ac3c765e8751bf8ed83348310feed1/aHR0cHM6Ly81NmIwMDU5NzBjZmM3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTYvMDIvMTY5ZjE3MDRlYmMzMWViNDY1Mzg4Y2Y2NTMzNGNkZGQucG5n.png"
          alt="blog-logo"
          class="blog-logo">
      </el-col>

      <el-col :xs="22" :sm="22" :lg="4">
        <el-row :gutter="2">
          <el-col :xs="12" :sm="12" class="blog-who">
            <el-row v-if="($store.state.user.nickname)">
              <el-col :span="24" :offset="18">{{ $store.state.user.nickname }}'s</el-col>
            </el-row>
            <el-row>
              <el-col :span="24" :offset="18">iT blog</el-col>
            </el-row>
          </el-col>
          <el-col :xs="12" :sm="12" class="btn-menu-wrapper">
            <i class="el-icon-menu btn-menu hidden-lg-and-up" @click="drawer = true" type="primary"/>
          </el-col>
        </el-row>
      </el-col>

      <el-col :lg="11" class="blog-menu-wrapper hidden-md-and-down">
        <ul class="blog-menu">
          <li class="blog-menu-item"><nuxt-link to="/">IT博首页</nuxt-link></li>
          <li class="blog-menu-item"><nuxt-link to="/articles">IT博文章</nuxt-link></li>
          <li class="blog-menu-item"><nuxt-link to="/qas">博主问答</nuxt-link></li>
          <li class="blog-menu-item"><nuxt-link to="/about">关于IT博</nuxt-link></li>
        </ul>
      </el-col>

      <el-col :lg="5" class="input-search-wrapper hidden-md-and-down">
        <div class="blog-user-wrapper">
          <template v-if="$store.state.user.nickname">
            <nuxt-link :to="'/user/' + $store.state.user.nickname" class="blog-user">{{ $store.state.user.nickname }}</nuxt-link>
            <nuxt-link to="/exit" class="blog-exit">退出</nuxt-link>
          </template>
          <template v-else>
            <nuxt-link to="/login">登录</nuxt-link>
            <nuxt-link to="/register">注册</nuxt-link>
          </template>
        </div>
        <div @click="toPageSearch" class="btn-search">
          <el-input placeholder="请输入用户/文章关键词" :disabled="true" class="input-search">
            <el-button slot="append" icon="el-icon-search" :disabled="true"></el-button>
          </el-input>
        </div>
      </el-col>
    </el-row>

    <el-drawer
      title="菜单"
      direction="rtl"
      :visible.sync="drawer"
      :before-close="handleClose"
      class="mobile-menu-wrapper">
      <ul class="mobile-menu">
        <li class="mobile-menu-item" @click="handleClose"><nuxt-link to="/">IT博首页</nuxt-link></li>
        <li class="mobile-menu-item" @click="handleClose"><nuxt-link to="/articles">IT博文章</nuxt-link></li>
        <li class="mobile-menu-item" @click="handleClose"><nuxt-link to="/qas">博主问答</nuxt-link></li>
        <li class="mobile-menu-item" @click="handleClose"><nuxt-link to="/search">全局搜索</nuxt-link></li>
        <li class="mobile-menu-item" @click="handleClose"><nuxt-link to="/about">关于IT博</nuxt-link></li>
      </ul>

      <dl class="mobile-blog-type" v-if="$store.state.user.nickname">
        <dt class="mobile-blog-type-title">用户菜单</dt>
        <dd class="mobile-blog-type-item" @click="handleClose">
          <nuxt-link :to="'/user/' + $store.state.user.nickname">主页</nuxt-link>
        </dd>
        <dd class="mobile-blog-type-item" @click="handleClose">
          <nuxt-link :to="'/user/' + $store.state.user.nickname + '/publish/article'">博文发布</nuxt-link>
        </dd>
        <dd class="mobile-blog-type-item" @click="handleClose">
          <nuxt-link :to="'/user/' + $store.state.user.nickname + '/publish/qa'">我要提问</nuxt-link>
        </dd>
        <dd class="mobile-blog-type-item" @click="handleClose">
          <nuxt-link :to="'/user/' + $store.state.user.nickname + '/collection'">我的收藏</nuxt-link>
        </dd>
        <dd class="mobile-blog-type-item" @click="handleClose">
          <nuxt-link :to="'/user/' + $store.state.user.nickname + '/messages'">我的消息</nuxt-link>
        </dd>
        <dd class="mobile-blog-type-item" @click="handleClose">
          <nuxt-link :to="'/user/' + $store.state.user.nickname + '/setting'">我的设置</nuxt-link>
        </dd>
      </dl>

      <dl class="mobile-blog-type" v-if="$store.state.user.nickname">
        <dt class="mobile-blog-type-title">IT博分类</dt>
        <dd v-for="(item, idx) of $store.state.user.groups" :key="idx"
          class="mobile-blog-type-item" @click="handleClose">
            <nuxt-link :to="'/user/' + $store.state.user.nickname + '/groups/' + item.name">{{ item.name }} ({{ item.count }})</nuxt-link>
          </dd>
      </dl>

      <div class="mobile-user-wrapper">
        <template v-if="$store.state.user.nickname">
          <span @click="handleClose"><nuxt-link :to="'/user/' + $store.state.user.nickname">{{ $store.state.user.nickname }}</nuxt-link></span>
          <span @click="handleClose"><nuxt-link to="/exit" class="mobile-exit">退出</nuxt-link></span>
        </template>
        <template v-else>
          <span @click="handleClose"><nuxt-link to="/login">登录</nuxt-link></span>
          <span @click="handleClose"><nuxt-link to="/register">注册</nuxt-link></span>
        </template>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      drawer: false
    }
  },
  methods: {
    toPageSearch () {
      this.$router.push({path: '/search'})
    },
    handleClose () {
      this.drawer = false
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/public/header.scss';
</style>
