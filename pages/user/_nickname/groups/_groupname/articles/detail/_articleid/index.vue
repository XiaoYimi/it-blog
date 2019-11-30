<template>
  <div class="detail-wrapper">
    <h2 class="title">{{ narticle.title }}</h2>
    <div class="statistics">
      <span>作者：<nuxt-link :to="'/user/' + narticle.nickname + '/detail'">{{ narticle.nickname }}</nuxt-link></span>
      <span class="reading">阅读：{{ narticle.reading + 1 }}</span>
      <template v-if="narticle.nickname !== this.$store.state.user.nickname">
        <span v-show="hasUser">
          <span @click="changeCollectionState({
            myself: $store.state.user.nickname,
            nickname: narticle.nickname,
            title: narticle.title,
            aid: narticle.aid,
            group: narticle.group
          })" class="collection">
            <span>标星收藏 </span> 
            <svg v-show="!collectionState" t="1573448355085" class="icon no-coll" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" p-id="1668"><path d="M1015.296 381.715692c-8.743385-26.466462-31.350154-45.686154-58.368-49.860923l-263.955692-40.96L578.363077 42.692923C566.311385 16.620308 540.396308 0 512.039385 0S457.767385 16.620308 445.715692 42.692923L331.027692 290.894769l-263.955692 40.96C39.975385 336.029538 17.447385 355.249231 8.704 381.715692c-8.743385 26.466462-2.126769 55.689846 17.014154 75.539692L219.096615 658.510769 174.276923 937.668923c-4.489846 28.120615 7.168 56.241231 30.011077 72.782769C216.969846 1019.431385 231.699692 1024 246.508308 1024c12.130462 0 24.418462-3.150769 35.367385-9.216l230.084923-125.085538 230.084923 125.085538C753.152 1020.849231 765.361231 1024 777.570462 1024c14.808615 0 29.538462-4.568615 42.220308-13.548308 22.843077-16.541538 34.500923-44.662154 29.932308-72.782769L804.903385 658.510769l193.457231-201.255385C1017.422769 437.326769 1023.960615 408.182154 1015.296 381.715692z" p-id="1669" fill="#999999"></path></svg>
            <svg v-show="collectionState" t="1573446567849" class="icon in-coll" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" p-id="1397"><path d="M1015.296 381.715692c-8.743385-26.466462-31.350154-45.686154-58.368-49.860923l-263.955692-40.96L578.363077 42.692923C566.311385 16.620308 540.396308 0 512.039385 0S457.767385 16.620308 445.715692 42.692923L331.027692 290.894769l-263.955692 40.96C39.975385 336.029538 17.447385 355.249231 8.704 381.715692c-8.743385 26.466462-2.126769 55.689846 17.014154 75.539692L219.096615 658.510769 174.276923 937.668923c-4.489846 28.120615 7.168 56.241231 30.011077 72.782769C216.969846 1019.431385 231.699692 1024 246.508308 1024c12.130462 0 24.418462-3.150769 35.367385-9.216l230.084923-125.085538 230.084923 125.085538C753.152 1020.849231 765.361231 1024 777.570462 1024c14.808615 0 29.538462-4.568615 42.220308-13.548308 22.843077-16.541538 34.500923-44.662154 29.932308-72.782769L804.903385 658.510769l193.457231-201.255385C1017.422769 437.326769 1023.960615 408.182154 1015.296 381.715692z" p-id="1398" fill="#f4ea2a"></path></svg>
          </span>
        </span>
      </template>
    </div>
    <div class="content" v-html="narticle.content"/>
    <div class="end">—— End (<span>发布日期：{{ narticle.date }}</span>)</div>
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
  async asyncData ({ params, $axios, redirect, store }) {
    const {status, data: { code, article }} = await $axios.get('/articles/detail', {
      params: {
        aid: params.articleid,
        nickname: params.nickname,
        group: params.groupname
      }
    })
    if (status === 200 && code === 0) {
      return { article }
    } else {
      redirect('/error/err_404')
    }
  },
  async mounted () {
    const data = {
      myself: this.$store.state.user.nickname,
      nickname: this.$route.params.nickname,
      group: this.$route.params.groupname,
      aid: this.$route.params.articleid
    }
    const { status, data: { code, msg, state, hasUser } } = await this.$axios.get('/collections/hasCollection', { params: data })
    if (status === 200 && code === 0) {
      this.collectionState = state
      if (hasUser !== undefined) { this.hasUser = hasUser }
    }
  },
  computed: {
    narticle () {
      const art = this.article
      let date = art.date
      date = DateDeal.datetime(date)
      art.date = date
      return art
    }
  },
  data () {
    return {
      collectionState: false,
      hasUser: true
    }
  },
  methods: {
    async changeCollectionState (data) {
      const hasCollection = !this.collectionState
      if (hasCollection) {
        const { status, data: { code, msg, state } } = await this.$axios.post('/collections/add', data)
        if (status === 200) {
          if (code === 0) {
            this.collectionState = state
            this.$message({ message: msg, type: 'success', duration: 2000 })
          } else {
            this.$message({  message: msg, duration: 2000 })
          }
        } else {
          this.$message({ message: status, type: 'error' })
        }
      } else {
        const { status, data: { code, msg, state } } = await this.$axios.post('/collections/delete', data)
        if (status === 200) {
          if (code === 0) {
            this.collectionState = state
            this.$message({ message: msg, type: 'success', duration: 2000 })
          } else {
            this.$message({  message: msg, duration: 2000 })
          }
        } else {
          this.$message({ message: status, type: 'error' })
        }
      }
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/user/_nickname/groups/_groupname/articles/detail/_articleid/index.scss';
</style>
