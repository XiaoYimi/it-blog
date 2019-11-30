<template>
  <div>
    <user-nav/>
    <div class="publish-wrapper">
      <div class="nav-active">博文修改</div>
      <div class="publish-title">
        <el-input class="l-input" v-model="article.title" maxlength="60" placeholder="请输入内容标题"/>
      </div>
      <el-select v-model="article.group" disabled placeholder="请选择分组" class="publish-group">
      <el-option
          v-for="item in groups"
          :key="item._id"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
      <div class="publish-content">
        <el-input type="textarea" v-model="article.content" maxlength="1500" placeholder="请输入内容描述"/>
        <div class="chars-length">{{ charsLen }}</div>
      </div>
      <div class="publish-btns">
        <el-button class="el-button--primary btn-submit" @click="articleModify">确定</el-button>
        <el-button class="btn-cancel" @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import UserNav from '@/components/user/nav'
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
  async asyncData ({ $axios, params }) {
    const data = {
      nickname: params.nickname,
      group: params.groupname,
      aid: params.articleid
    }
    const { status, data: { code, msg, article }} = await $axios.get('/articles/detail', {
      params: data
    })
    if (status === 200 && code === 0) {
      article.content = article.content.replace(/<br\/>/g, `\r\n`)
      article.content = article.content.replace(/<br\/>/g, `\n`)
      return { article }
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
      return '(缩进请自行空格)  ' + this.article.content.length + '/1500'
    }
  },
  methods: {
    async articleModify () {
      let content = this.article.content.replace(/\r\n/g, '<br/>')
      content = content.replace(/\n/g, '<br/>')
      content = content.replace(/\s/g, ' ')
      this.article.content = content
      this.date = new Date()
      const { status, data: { code, msg }} = await this.$axios.post('/articles/modifyArticle', {
        nickname: this.article.nickname,
        group: this.article.group,
        title: this.article.title,
        content: this.article.content,
        aid: this.article.aid
      })
      if (status === 200) {
        if (code === 0) {
          this.article.title = ''
          this.article.content = ''
          this.$message({ message: msg, type: 'success', duration: 2000 })
          setTimeout(() => {
            this.$router.push('/user/' + this.article.nickname + '/groups/' + this.article.group + '/articles/detail/' + this.article.aid)
          }, 2000)
        } else {
          this.$message({ message: msg, duration: 2000 })
        }
      } else {
        this.$message({ message: status, type: 'error' })
      }
      
    },
    cancel () { this.$router.go(-1) }
  }
}
</script>

<style lang="scss"> 
  @import '@/assets/css/user/_nickname/publish/index.scss';
</style>
