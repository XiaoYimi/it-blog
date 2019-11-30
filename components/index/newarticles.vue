<template>
  <dl class="index-block">
    <dt class="block-title"><i class="el-icon-document"/> 今日文章</dt>
    <dd v-for="(item, idx) of narticles" :key="idx"
      @click="toDetail('/user/' + item.nickname + '/groups/' + item.group + '/articles/detail/' + item.aid)"
      class="block-child">
      <h3 class="title">{{ item.title }}</h3>
      <div class="content" v-html="item.content"/>
      <div class="info">
        <span class="hidden-sm-and-up">IT博主:</span>
        <span @click.stop="toAuthor('/user/' + item.nickname + '/detail')"
          class="author">{{ item.nickname }}</span>
        <span class="hidden-sm-and-down">发布于 {{ item.date }}</span>
        <span>阅读 ({{ item.reading }})</span>
      </div>
    </dd>
    <dd v-if="!articleslen" class="block-child no-data">暂无文章 ...</dd>
  </dl>
</template>

<script>
import DateDeal from '@/server/interface/utils/date_iso_to_ch'
export default {
  props: {
    articles: Array
  },
  computed: {
    narticles () {
      let articles = this.articles.map(item => {
        item.date = DateDeal.datetime(item.date)
        return item
      })
      if (articles.length > 10) { articles = articles.slice(0, 10) }
      return articles
    },
    articleslen () { return this.articles.length }
  },
  methods: {
    toDetail (src) {
      this.$router.push(src)
    },
    toAuthor (src) {
      this.$router.push(src)
    }
  }
}
</script>

<style lang="scss">
</style>
