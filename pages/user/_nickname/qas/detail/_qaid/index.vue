<template>
  <div class="box-wrapper">
    <div class="qa-wrraper">
      <div class="title">问题: {{ nqa.title }}</div>
      <div class="content">
        <span class="content-span">描述: </span>
        <div class="desc" v-html="nqa.content" />
      </div>
      <div class="info">
        <span class="info-item"><nuxt-link to="/">{{ nqa.nickname }}</nuxt-link></span>
        <span class="info-item date">提问于 {{ nqa.date }}</span>
        <span class="info-item reading"><i class="el-icon-reading"/>阅读({{ nqa.reading }})</span>
      </div>
    </div>

    <dl class="want-answer">
      <dt class="title">我要回答</dt>
      <dd class="form">
        <el-input type="textarea" v-model="content" maxlength="500" placeholder="请输入回答内容" class="form-textarea"/>
        <span class="char-legnth">{{ contentlen }}</span>
        <div class="btns">
          <el-button size="medium" @click="content = ''">取消</el-button>
          <el-button size="medium" type="primary" @click="send">发送</el-button>
        </div>
      </dd>
    </dl>

    <dl class="answer-wrapper">
      <dt class="answer-title">所有回答<small> ({{ answerslen }})</small></dt>

      <dd v-for="(item, idx) of nanswers" :key="idx" class="answer-item">
        <div class="content">{{ item.content }}  </div>
        <div class="info">
          <span class="info-item commenter">{{ item.answer }}</span>
          <span class="opearator"> | </span>
          <span class="info-item date">{{ item.date }}</span>
        </div>
      </dd>

      <dd v-if="!answerslen" class="answer-item no-data">暂无回答 ...</dd>

    </dl>
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
  async asyncData ({ $axios, params }) {
    const { status, data: { code, msg, qa, answers } } = await $axios.get('/qas/detail', {
      params: { nickname: params.nickname, qid: params.qaid }
    })
    if (status === 200) {
      if (code === 0) {
        return { qa, answers }
      } else {
        return {}
        console.log(code, msg)
      }
    } else {
      console.log(status)
    }
  },
  computed: {
    nqa () {
      const qa = this.qa
      let date = qa.date
      date = DateDeal.datetime(date)
      qa.date = date
      return qa
    },
    nanswers () {
      const answers = this.answers.map(item => {
        item.date = DateDeal.datetime(item.date)
        return item
      })
      return answers
    },
    answerslen () {
      return this.answers.length
    },
    contentlen () {
      return '(缩进请自行空格) ' + this.content.length + '/500'
    }
  },
  data () {
    return {
      content: ''
    }
  },
  methods: {
    async send () {
      const data = {
        nickname: this.$route.params.nickname,
        qid: this.$route.params.qaid,
        answer: this.$store.state.user.nickname,
        content: this.content
      }
      if (!data.nickname) { this.$message({ message: '请登录后再来评论', duration: 2000 }); return }
      const { status, data: { code, msg, answers } } = await this.$axios.post('/qas/answer', data)
      if (status === 200) {
        if (code === 0) {
          this.answers = answers
          this.content = ''
          this.$message({ message: msg, type: 'success', duration: 2000 })
        } else {
          this.$message({ message: msg, duration: 2000 })
        }
      } else {
        this.$message({ message: '网络请求出错(' + status + '), 请稍后尝试' })
      }
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/user/_nickname/qas/detail/_qaid/index.scss';
</style>
