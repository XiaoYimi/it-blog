<template>
<div class="pages-group">
  <user-nav/>
  <dl class="user-item-wrapper">
    <dt class="user-item-title">博文分组 {{ this.$route.params.groupname }}</dt>
    <dd v-for="(item, idx) of narticles" :key="idx" class="user-item-child user-item-group">
      <div class="title"  @click="toDetail('/user/' + item.nickname + '/groups/' + item.group + '/articles/detail/' + item.aid )">
        <span class="title-span" >{{ item.title }}</span>
        <div class="poppanel">
          <span @click.stop="modifyArticle('/user/' + item.nickname + '/groups/' + item.group + '/articles/modify/' + item.aid)" class="btn">修改</span>
          <span @click.stop="deleteArticle({
            nickname: item.nickname,
            group: item.group,
            aid: item.aid
          })" class="btn">删除</span>
        </div>
      </div>
      <div class="date">{{ item.date }}</div>
    </dd>
    <dd v-if="!len" class="no-data">暂无数据 ...</dd>
  </dl>
</div>
</template>

<script>
import UserNav from '@/components/user/nav'
import DateDeal from '@/server/interface/utils/date_iso_to_ch'
export default {
  layout: 'user',
  middleware: 'userToken',
  components: { UserNav },
  async validate ({ $axios, params,redirect }) {
    const { status, data: { code, msg, groups }} = await $axios.get('/groups/all', {
      params: { nickname: params.nickname }
    })
    const isgroup =  groups.some(item => { return item.name === params.groupname })
    return isgroup ? isgroup : redirect('/error/err_404')
  },
  async fetch ({store, params, $axios}) {
    const {status, data: { code, user }} = await $axios.get('/users/baseUser')
    if (status === 200 && code === 0) {
      store.commit('getUser', user)
    }
  },
  async asyncData ({ $axios, params }) {
    const { status, data: { code, msg, articles } } = await $axios.get('/articles/group', {
      params: {
        nickname: params.nickname,
        group: params.groupname
      }
    })
    if (status === 200 && code === 0) {
      return { articles }
    } else {
      return { articles: [] }
    }
  },
  computed: {
    len () { return this.articles === undefined ? 0 : this.articles.length },
    narticles () {
      return this.articles.map(item => {
        item.date = DateDeal.datetime(item.date)
        return item
      })
    }
  },
  methods: {
    toDetail (src) { this.$router.push(src) },
    async deleteArticle (data) {
      const { status, data: { code, msg, groups }} = await this.$axios.post('/articles/deleteArticle', data)
      if (status === 200) {
        if (code === 0) {
          this.$store.dispatch('deleteArticle', { groups })
          this.articles = this.articles.filter(item => {
             return item.aid !== data.aid
          })
          this.$message({ message: msg, type: 'success', duration: 2000 })
        }
      } else {
        this.$message({ message: status, type: 'error' })
      }
    },
    modifyArticle (src) { this.$router.push(src) }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/user/_nickname/common.scss';
</style>
