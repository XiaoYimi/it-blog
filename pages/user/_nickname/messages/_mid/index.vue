<template>
  <div class="message-detail">
    <user-nav/>
    <div class="header-wrapper">
      <div class="title">标题： <span>{{ nmessage.title }}</span></div>
      <div class="from">发送者： <span>{{ nmessage.from }}</span></div>
      <div class="date">日期： <span>{{ nmessage.date }}</span></div>
    </div>
    <div class="content"> {{ nmessage.content }}</div>
  </div>
</template>

<script>
import Datedeal from '@/server/interface/utils/date_iso_to_ch'
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
    const { status, data: { message } } = await $axios.get('/messages/detail', { params })
    return message? { message } : { message: {} }
  },
  computed: {
    nmessage () {
      const msg = this.message
      let date = msg.date
      date = Datedeal.datetime(date)
      msg.date = date
      return msg
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/user/_nickname/messages/_mid/index.scss';
</style>
