<template>
  <div class="search-block">
    <el-input placeholder="请输入关键字词,点击按钮搜索" v-model="keyword" @keyup.enter.native="search" class="input-search">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>

    <div class="search-type">
      <div class="search-type-title">匹配-用户</div>
      <div v-if="userslen" class="search-users">
        <nuxt-link :to="'/user/' + item.nickname + '/detail'" v-for="(item, uid) of users" :key="uid" class="item">{{ item.nickname }}</nuxt-link>
      </div>
      <div v-else class="no-data">暂无匹配用户 ...</div>
    </div>

    <div class="search-type">
      <div class="search-type-title">匹配-文章</div>
      <div v-if="articleslen" class="search-articles">
        <div class="item" v-for="(item, aid) of narticles" :key="aid"
          @click="toDetail('/user/' + item.nickname + '/groups/' + item.group + '/articles/detail/' + item.aid)">
          <span class="title">{{ item.title }}</span>
          <span class="date">{{ item.date }}</span>
        </div>
      </div>
      <div v-else class="no-data">暂无匹配文章 ...</div>
    </div>

  </div>
</template>

<script>
import DateDeal from '@/server/interface/utils/date_iso_to_ch'
export default {
  async fetch ({store, params, $axios}) {
    const {status, data: { code, user }} = await $axios.get('/users/baseUser')
    if (status === 200 && code === 0) {
      store.commit('getUser', user)
    }
  },
  computed: {
    userslen () { return this.users.length },
    articleslen () { return this.articles.length },
    narticles () {
      return this.articles.map(item => {
        item.date = DateDeal.datetime(item.date)
        return item
      })
    }
  },
  data () {
    return {
      keyword: '',
      users: [],
      articles: []
    }
  },
  methods: {
    async search () {
      const { status, data: { code, msg, users, articles }} = await this.$axios.get('/users/search', {
        params: { keyword: this.keyword }
      })
      if (status === 200) {
        if (code === 0) {
          this.users = users
          this.articles = articles
        } else {
          this.$message({ message: msg, duration: 2000 })
        }
      } else {
        this.$message({ message: `网路请求出错 (${status}), 请稍后尝试`, type: 'error' })
      }
    },
    toDetail (src) { this.$router.push(src) }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/public/search.scss';
</style>
