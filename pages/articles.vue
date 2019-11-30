<template>
  <div class="page-articles">
    <div class="page-title">IT博文章</div>
    <ul class="articles-wrapper" v-if="articles">
      <li class="articles-item"
        v-for="(item, idx) of narticles" :key="idx"
        :aid="item.aid"
        @click="clickDetail('/user/' + item.nickname + '/groups/' + item.group + '/articles/detail/' + item.aid)"
      >
        <h3 class="item-title">{{ item.title }}</h3>
        <div class="item-content" v-html="item.content" />
        <div class="other-info">
          <span class="hidden-sm-and-up">IT博主:</span>
          <span @click.stop="toAuthor('/user/' + item.nickname + '/detail')"
            class="author">{{ item.nickname }}</span>
          <span class="date hidden-sm-and-down">发布于 {{ item.date }}</span>
          <span class="reading"><i class="el-icon-reading"/> 阅读({{ item.reading }})</span>
        </div>
      </li>
    </ul>
    <div v-else>暂无文章 ...</div>
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
  async asyncData ({ $axios, redirect }) {
    const { status, data: { code, articles } } = await $axios.get('/articles/all')
    if (articles === undefined) { return { articles: null } }
    if (status === 200 && code === 0) {
      if (articles.length > 0) {
        return { articles }
      }
    } else {
      redirect('/error_err_404')
    }
  },
  computed: {
    narticles () {
      let self = this
      const arts = self.articles
      for (let i=0; i<arts.length; i++) {
        let date = arts[i].date
        date = DateDeal.datetime(date)
        arts[i].date = date
      }
      return arts
    }
  },
  methods: {
    clickDetail (src) { this.$router.push(src) },
    toAuthor (src) { this.$router.push(src) }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/public/articles.scss';
</style>
