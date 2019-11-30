<template>
  <dl class="publish-news">
    <dt class="htitle">新闻撰写</dt>
    <dd class="item">
      <el-input v-model="title" placeholder="请输入新闻标题"/>
    </dd>
    <dd class="item">
      <el-input type="textarea" v-model="content" placeholder="请输入新闻内容"/>
    </dd>
    <dd class="item-btns">
      <el-button size="medium" @click="clearinput">取消</el-button>
      <el-button type="primary" size="medium" @click="publish">发布</el-button>
    </dd>
  </dl>
</template>

<script>
export default {
  head () { return { title: '新闻发布' } },
  validate ({ params, redirect }) {
    const bool = /account.xiaoyimi/.test(params.type)
    if (bool) { return true }
    else { redirect('/error/err_401') }
  },
  data () {
    return {
      title: '',
      content: ''
    }
  },
  computed: {

  },
  methods: {
    clearinput () {
      this.title = ''
      this.content = ''
    },
    async publish () {
      let content = this.content
      content = content.replace(/\r\n/g, '<br/>')
      content = content.replace(/\n/g, '<br/>')
      content = content.replace(/\s/g, ' ')
      const { status, data: { code, msg }} = await this.$axios.post('/news/publish', {
        title: this.title,
        content
      })
      if (status === 200) {
        code === 0 ? 
        this.$message({ message: msg, type: 'success', duration: 2000 })
        : this.$message({ message: msg, duration: 2000 })
      } else {
        this.$message({ message: '网络请求出错,请稍后尝试', type: 'error' })
      }
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/news/index.scss';
</style>
