<template>
  <div class="user-collection">
    <user-nav/>
    <dl class="user-item-wrapper">
      <dt class="user-item-title">我的收藏</dt>
      <dd class="user-item-child" v-for="(item, cid) of collections" :key="cid">
        <div @click="toDetail('/user/' + item.nickname + '/groups/' + item.group + '/articles/detail/' + item.aid)" class="title">{{ item.title }}</div>
        <div class="date">2019-12-12 18:00:00</div>
      </dd>
      <dd v-if="collectionslen" class="no-data">暂无数据 ...</dd>
    </dl>
  </div>
</template>

<script>
import UserNav from '@/components/user/nav'
export default {
  layout: 'user',
  components: { UserNav },
  async fetch ({store, params, $axios}) {
    const {status, data: { code, user }} = await $axios.get('/users/baseUser')
    if (status === 200 && code === 0) {
      store.commit('getUser', user)
    }
  },
  async asyncData ({ $axios, params }) {
    const { status, data: { code, msg, collections } } = await $axios.get('/collections/all', {
      params: { nickname: params.nickname }
    })
    if (status === 200 && code === 0) {
      return collections ? { collections } : { collections: [] }
    } else {
      console.log(status)
      return {}
    }
  },
  computed: {
    collectionslen () {
      return this.collections.length <= 0
    }
  },
  methods: {
    toDetail (src) { this.$router.push(src) }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/user/_nickname/common.scss';
</style>
