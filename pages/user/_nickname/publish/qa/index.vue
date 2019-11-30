<template>
  <div>
    <user-nav/>
    <div class="user-item-wrapper">
      <div class="user-item-title">我要提问</div>
      <div class="user-item-form">
        <div class="user-item-form-item">
          <el-input v-model="title" maxlength="20" placeholder="请输入内容标题"/>
        </div>
        <div class="user-item-form-item">
          <el-input type="textarea" v-model="content" maxlength="1000" placeholder="请输入内容描述"/>
          <div class="chars-length">{{ charsLen }}</div>
        </div>
        <div class="user-item-form-item">
          <el-button size="medium" class="el-button--primary" @click="qaPublish">发布</el-button>
          <el-button size="medium" @click="inputAllEmpty">全部清空</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserNav from '@/components/user/nav'
import DateDeal from '@/server/interface/utils/date_iso_to_ch'
export default {
  layout: 'user',
  components: { UserNav },
  middleware: 'userToken',
  async fetch ({store, params, $axios}) {
    const {status, data: { code, user }} = await $axios.get('/users/baseUser')
    if (status === 200 && code === 0) {
      store.commit('getUser', user)
    }
  },
  data () {
    return {
      title: '',
      content: ''
    }
  },
  computed: {
    charsLen () {
      return '(缩进请自行空格,换行采用回车键)  ' + this.content.length + '/1000'
    },
    nickname () {
      return this.$store.state.user.nickname
    },
  },
  methods: {
    async qaPublish () {
      let self = this
      let content = this.content.replace(/\r\n/g, '<br/>')
      content = content.replace(/\n/g, '<br/>')
      content = content.replace(/\s/g, ' ')
      const data = {
        nickname: this.nickname,
        title: this.title,
        content: content
      }
      if (data.nickname !== '' && data.content !== '') {
        const { status, data: { code, msg, qa } } = await self.$axios.post('/qas/publishQa', data)
        if (status === 200) {
          if (code === 0) {
            self.title = ''
            self.content = ''
            this.$message({ message: `您的博问 ?? '${data.title}' ?? 于 ${DateDeal.datetime(new Date())} 成功发布`, type: 'success', duration: 2000 })
            setTimeout(() => {
              this.$router.push('/user/'+ qa.nickname + '/qas/detail/' + qa.qid)
            }, 2000)
          } else {
            this.$message({ message: msg, duration:2000 })
          }
        } else {
          this.$message({ message: '网络请求出错,请稍后尝试', type: 'error' })
        }
      } else {
        this.$message({ message: '博问发布的标题或内容不能为空', duration: 2000 })
      }
    },
    inputAllEmpty () {
      let self = this
      self.title = ''
      self.content = ''
    }
  }
}
</script>

<style lang="scss">
  // @import '@/assets/css/user/_nickname/publish/index.scss';
  @import '@/assets/css/user/_nickname/common.scss';
</style>
