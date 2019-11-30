<template>
  <div class="blog-aside">
    <dl class="blog-type-wrapper">
      <dt class="blog-type-title">博文分类</dt>
      <dd class="blog-type-item" v-for="(item, idx) of $store.state.user.groups" :key="idx">
        <nuxt-link :to="'/user/' + $store.state.user.nickname + '/groups/' + item.name">{{ item.name }} ({{ item.count }})</nuxt-link>
      </dd>
    </dl>

    <dl class="blog-user-wrapper">
      <dt class="blog-user-name">博主信息</dt>
      <dd class="blog-user-info">昵称：{{ $store.state.user.nickname || '' }}</dd>
      <dd class="blog-user-info">成长：{{ joinAge }} 年</dd>
      <dd class="blog-user-info">发表：{{ counts }} 条</dd>
      <dd class="blog-user-info">职业：{{ $store.state.user.occupation || ''}}</dd>
      <dd class="blog-user-info">城市：{{ positions }}</dd>
      <dd class="blog-user-info">邮箱：{{ $store.state.user.contacts.email || ''}}</dd>
      <dd class="blog-user-info">兴趣：{{ hobby || '未知' }}</dd>
    </dl>

    <dl class="blog-contact-wrapper">
      <dt class="blog-contact-title">联系博主</dt>
      <div class="contact-info">
        <dd class="blog-contact-item">
          <el-tooltip class="blog-contact-tip" effect="dark" :content="$store.state.user.contacts.wechat || ''" placement="bottom">
            <span class="blog-contact-wechat"/>
          </el-tooltip>
        </dd>
        <dd class="blog-contact-item">
          <el-tooltip class="blog-contact-tip" effect="dark" :content="$store.state.user.contacts.weibo || ''" placement="bottom">
            <span class="blog-contact-weibo"/>
          </el-tooltip>
        </dd>
        <dd class="blog-contact-item">
          <el-tooltip class="blog-contact-tip" effect="dark" :content="$store.state.user.contacts.qq || ''" placement="bottom">
            <span class="blog-contact-qq"/>
          </el-tooltip>
        </dd>
        <dd class="blog-contact-item">
          <el-tooltip class="blog-contact-tip" effect="dark" :content="$store.state.user.contacts.phone || ''" placement="bottom">
            <span class="blog-contact-phone"/>
          </el-tooltip>
        </dd>
        <dd class="blog-contact-item">
          <el-tooltip class="blog-contact-tip" effect="dark" :content="$store.state.user.contacts.email || ''" placement="bottom">
            <span class="blog-contact-email"/>
          </el-tooltip>
        </dd>
      </div>
    </dl>

  </div>
</template>

<script>
export default {
  computed: {
    joinAge () {
      const date = this.$store.state.user.date
      if (date === '') {
        return 0
      } else {
        const now = new Date()
        const join = new Date(date)
        return now.getFullYear() - join.getFullYear()
      }
    },
    positions () {
      return this.$store.state.user.province.name + ' ' + this.$store.state.user.city.name
    },
    hobby () {
      return this.$store.state.user.hobby.join(' · ')
    },
    counts () {
      const groups = this.$store.state.user.groups
      if (groups.length <= 0) {
        return 0
      } else {
        let res = 0
        for (let i=0; i<groups.length; i++) {
          res += groups[i].count
        }
        return res
      }
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/public/aside.scss';
</style>
