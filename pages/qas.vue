<template>
  <div class="page-qas">
    <blog-qas-search @search="search" />
    <blog-qas-list :qas="qas" :keyword="keyword" />
  </div>
</template>

<script>
import BlogQasSearch from '../components/qas/search'
import BlogQasList from '../components/qas/list'
export default {
  components: {
    BlogQasSearch,
    BlogQasList
  },
  async fetch ({store, params, $axios}) {
    const {status, data: { code, user }} = await $axios.get('/users/baseUser')
    if (status === 200 && code === 0) {
      store.commit('getUser', user)
    }
  },
  async asyncData ({ $axios }) {
    const { status , data: { code, qas } } = await $axios.get('/qas/all')
    if (qas === undefined) {
      return { qas: [] }
    } else {
      if (status === 200 && code === 0) {
        return { qas }
      }
    }
  },
  data () {
    return {
      keyword: ''
    }
  },
  methods: {
    search (keyword) {
      this.keyword = keyword
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/qas/index.scss';
</style>
