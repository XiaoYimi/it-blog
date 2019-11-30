<template>
  <dl class="user-detail-group">
    <dt class="group">{{ nickname }} 的博文分组 -- {{ group }}</dt>
    <dd v-for="(item, aid) of narticles" :key="aid"
      @click="toDetail('/user/' + item.nickname + '/groups/' + item.group + '/articles/detail/' + item.aid)"
      class="item">
      <div class="title">{{ item.title }}</div>
      <div class="date">{{ item.date }}</div>
    </dd>
  </dl>
</template>

<script>
import DateDeal from '@/server/interface/utils/date_iso_to_ch'
export default {
  head () { return { title: '查看用户组下博文' } },
  async fetch ({store, params, $axios}) {
    const {status, data: { code, user }} = await $axios.get('/users/baseUser')
    if (status === 200 && code === 0) {
      store.commit('getUser', user)
    }
  },
  async asyncData ({$axios, params }) {
    const { status, data: { code, msg, articles } } = await $axios.get('/articles/group', {
      params: { nickname: params.nickname, group: params.groupname }
    })
    if (status === 200 && code ===0) {
      console.log(articles)
      return { articles }
    } else {
      return {}
    }
  },
  computed: {
    narticles () {
      return this.articles.map(item => {
        item.date = DateDeal.datetime(item.date)
        return item
      })
    },
    nickname () { return this.articles[0].nickname },
    group () { return this.articles[0].group }
  },
  methods: {
    toDetail (src) { this.$router.push(src) }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/user/_nickname/detail/index.scss';
</style>
