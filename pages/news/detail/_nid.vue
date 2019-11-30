<template>
  <div class="news-block">
    <h2 class="title">{{ news.title }}</h2>
    <div class="info">
      <span class="reading">阅读: {{ news.reading }}</span>
      <span class="date">日期: {{ date }}</span>
    </div>
    <div class="content" v-html="news.content" />
    <div class="end">--End</div>
  </div>
</template>

<script>
import DateDeal from '@/server/interface/utils/date_iso_to_ch'
export default {
  head () { return { title: '新闻详情' } },
  async fetch ({store, params, $axios}) {
    const {status, data: { code, user }} = await $axios.get('/users/baseUser')
    if (status === 200 && code === 0) {
      store.commit('getUser', user)
    }
  },
  async asyncData ({ params, $axios, redirect }) {
    const { status, data: { code, msg, news }} = await $axios.get('/news/detail', {
      params: { nid: params.nid }
    })
    if (status === 200 && code === 0) {
      return { news }
    } else {
      redirect('/error/err_404')
    }
  },
  computed: {
    date () {
      return DateDeal.datetime(this.news.date)
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/news/index.scss';
</style>
