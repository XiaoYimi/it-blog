<template>
  <div class="page-index">
    <el-row>
      <news :news="news"/>
    </el-row>
    <el-row>
      <now-articles :articles="nowArticles"/>
    </el-row>
    <el-row>
      <past-articles :articles="pastArticles"/>
    </el-row>
  </div>
</template>

<script>
import News from '../components/index/news'
import NowArticles from '../components/index/newarticles'
import PastArticles from '../components/index/pastarticles'
export default {
  components: {
    News,
    NowArticles,
    PastArticles
  },
  async fetch ({store, params, $axios}) {
    const {status, data: { code, user }} = await $axios.get('/users/baseUser')
    if (status === 200 && code === 0) {
      store.commit('getUser', user)
    }
  },
  async asyncData ({ $axios }) {
    const { status, data: { code, msg, nowArticles, pastArticles, news } } = await $axios.get('/articles/index')
    if (status === 200 && code === 0) {
      return news !== undefined ?  { nowArticles, pastArticles, news } : { nowArticles, pastArticles }
    }
  },
  computed: {
    nallarticles () {
      const arts = this.allarticles
      const today = new Date()
      return this.allarticles
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/index/index.scss';
</style>
