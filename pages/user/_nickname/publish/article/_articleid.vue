<template>
  <div class="publish-article">
    <user-nav/>
    <div class="user-item-wrapper">
      <div class="user-item-title">博文发布</div>
      <div class="user-item-form">
        <div class="user-item-form-item">
          <el-input v-model="title" maxlength="60" placeholder="请输入内容标题"/>
        </div>
        <div class="user-item-form-item">
          <el-select v-model="group" placeholder="请选择分组" class="publish-group">
          <el-option
              v-for="item in groups"
              :key="item._id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </div>
        <div class="user-item-form-item">
          <el-input type="textarea" v-model="content" maxlength="1500" placeholder="请输入内容描述"/>
          <div class="chars-length">{{ charsLen }}</div>
        </div>
        <div class="user-item-form-item">
          <el-button size="medium" class="el-button--primary" @click="articlePublish">发布</el-button>
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
      group: '',
      content: ''
    }
  },
  computed: {
    groups () {
      return this.$store.state.user.groups
    },
    nickname () {
      return this.$store.state.user.nickname
    },
    charsLen () {
      return '(缩进请自行空格,换行采用回车键)  ' + this.content.length + '/1500'
    }
  },
  methods: {
    async articlePublish () {
      let self = this
      let content = self.content.replace(/\r\n/g, '<br/>')
      content = content.replace(/\n/g, '<br/>')
      content = content.replace(/\s/g, ' ')
      const data = {
        nickname: self.nickname,
        group: self.group,
        title: self.title,
        content: content
      }
      const { status, data: { code, msg, article } } = await self.$axios.post('/articles/publishArticle', data)
      if (status === 200) {
        if (code === 0) {
          this.title = ''
          this.content = ''
          this.$message({ message: `《${data.title}》 于 ${DateDeal.datetime(new Date())} 成功发布`, type: 'success', duration: 2000 })
          setTimeout(() => {
            this.$router.push('/user/'+ article.nickname + '/groups/' + article.group +'/articles/detail/' + article.aid)
          }, 2000)
        } else {
          this.$message({ message: msg, duration: 2000 })
        }
      } else {
        this.$message({ message: code, type:'error' })
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
  @import '@/assets/css/user/_nickname/common.scss';
</style>
