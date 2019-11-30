<template>
  <div class="user-detail">
    <h3 class="user">{{ user.nickname }}</h3>
    <dl class="block">
      <dt class="block-title">博文分组</dt>
      <dd v-for="(item,gid) of user.groups" :key="gid" class="block-item-group">
        <nuxt-link :to="'/user/' + user.nickname + '/detail/' + item.name">
          {{ item.name + ' (' + item.count + ')' }}
        </nuxt-link> 
      </dd>
    </dl>
    <dl class="block">
      <dt class="block-title">基本信息</dt>
      <dd class="block-item-user">
        <div class="key">博龄</div>
        <div class="value">:  {{ user.date }}</div>
      </dd>
      <dd class="block-item-user">
        <div class="key">职业</div>
        <div class="value">:  {{ user.occupation }}</div>
      </dd>
      <dd class="block-item-user">
        <div class="key">城市</div>
        <div class="value">: {{ user.province.name + ' ' + user.city.name }}</div>
      </dd>
      <dd class="block-item-contacts">
        <div class="item">
          <div class="key">邮箱</div>
          <div class="value">: {{ user.contacts.email || '空' }}</div>
        </div>
        <div class="item">
          <div class="key">微信</div>
          <div class="value">: {{ user.contacts.wechat || '空' }}</div>
        </div>
        <div class="item">
          <div class="key">Q Q</div>
          <div class="value">: {{ user.contacts.qq || '空' }}</div>
        </div>
        <div class="item">
          <div class="key">手机</div>
          <div class="value">: {{ user.contacts.phone || '空' }}</div>
        </div>
        <div class="item">
          <div class="key">微博</div>
          <div class="value">: {{ user.contacts.weibo || '空' }}</div>
        </div>
      </dd>
      <dd class="block-item-user">
        <div class="key">爱好</div>
        <div class="value">: {{ user.hobby.join(' ') }}</div>
      </dd>
    </dl>

  </div>
</template>

<script>
export default {
  async fetch ({store, params, $axios}) {
    const {status, data: { code, user }} = await $axios.get('/users/baseUser')
    if (status === 200 && code === 0) {
      store.commit('getUser', user)
    }
  },
  async asyncData ({ $axios, params }) {
    const { status, data: {code, msg, user } } = await $axios.get('/users/detail', {
      params: { nickname: params.nickname }
    })
    if (status === 200 && code ===0) {
      return { user }
    } else {
      return {}
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/user/_nickname/detail/index.scss';
</style>
