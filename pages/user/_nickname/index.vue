<template>
  <div class="page-user">
    <user-nav/>
    <dl class="user-item-wrapper">
      <dt class="user-item-title">博文动态</dt>
      <dd class="user-item-child"
        v-for="(item, idx) of narticles"
        :key="idx"
        @click="toDetail('/user/'+ item.nickname + '/groups/' + item.group +'/articles/detail/' + item.aid)">
        <div class="title">{{ item.title }}</div>
        <div class="date">{{ item.date }}</div>
      </dd>
      <dd v-if="!len"  class="user-item-child no-data">暂无数据 ...</dd>
    </dl>
  </div>
</template>

<script>
import UserNav from '@/components/user/nav'
import DateDeal from '@/server/interface/utils/date_iso_to_ch'
export default {
  layout: 'user',
  middleware: 'userToken',
  head () { return { title: '用户主页' } },
  async validate ({ params, $axios, redirect }) {
    return /^\w{3,8}$/.test(params.nickname)
  },
  components: {
    UserNav
  },
  async fetch ({store, params, $axios}) {
    const {status, data: { code, user }} = await $axios.get('/users/baseUser')
    if (status === 200 && code === 0) {
      store.commit('getUser', user)
    }
  },
  async asyncData ({ $axios, params }) {
    const { status, data: { code, articles } } = await $axios.get('/articles/author', {
      params: {
        nickname: params.nickname
      }
    })
    return { articles }
  },
  computed: {
    narticles () {
      let self = this
      const arts = self.articles
      if (arts === undefined) { return }
      for (let i=0; i<arts.length; i++) {
        let date = arts[i].date
        date = DateDeal.date(date)
        arts[i].date = date
      }
      return arts
    },
    len () {
      return this.articles === undefined ? 0 : this.articles.length
    }
  },
  methods: {
    toDetail (src) {
      this.$router.push(src)
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/user/_nickname/common.scss';
</style>