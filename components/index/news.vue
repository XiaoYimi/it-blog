<template>
  <dl class="index-block">
    <dt class="block-title"><i class="el-icon-info"/> IT时事</dt>
    <dd v-for="(item, idx) of news" :key="idx" class="block-news">
      <nuxt-link :to="'/news/detail/' + item.nid">{{ item.title }}</nuxt-link>
    </dd>
    <dd v-if="!newslen" class="block-child no-data">暂无新闻 ...</dd>
  </dl>
</template>

<script>
import DateDeal from '@/server/interface/utils/date_iso_to_ch'
export default {
  props: {
    news: Array
  },
  computed: {
    narticles () {
      let news = this.news.map(item => {
        item.date = DateDeal.datetime(item.date)
        return item
      })
      if (news.length > 5) { news = news.slice(0, 5) }
      return news
    },
    newslen () { return this.news.length }
  }
}
</script>

<style lang="scss">
</style>
