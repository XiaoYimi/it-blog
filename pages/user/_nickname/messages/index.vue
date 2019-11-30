<template>
  <div class="user-messages">
    <user-nav/>
    <div class="user-item-wrapper">
      <div class="user-item-title">消息发布</div>
      <div class="user-item-form">
        <div class="user-item-form-item">
          <el-input
            v-model="keyword"
            placeholder="请输入用户名或邮箱账户"
            @focus="isfocus = true"
            @blur="inputBlur"/>
          <div class="pop-users" v-show="popUsers">
            <div class="user-item pop-users-item"
              v-for="(item, idx) of nuser"
              :key="idx"
              @click="selectUser(item.nickname + ' @' + item.contacts[0].email)">
              <span class="options">{{ item.nickname }}</span>
              <span class="options email"> @{{ item.contacts[0].email }}</span>
            </div>
            <div class="pop-users-item no-data" v-show="nodataState">搜索不到匹配用户</div>
          </div>
        </div>
        <div class="user-item-form-item">
          <el-input v-model="title" placeholder="请输入内容标题"/>
        </div>
        <div class="user-item-form-item">
          <el-input type="textarea" v-model="content" placeholder="请输入信息内容" />
        </div>
        <div class="user-item-form-item">
          <el-button size="medium" @click="cancel">取消</el-button>
          <el-button type="primary" size="medium" @click="send">发送</el-button>
        </div>
      </div>
    </div>
    
    <dl class="user-item-wrapper">
      <dt class="user-item-title">我的消息</dt>
      <dd class="user-item-child"
        v-for="(item, idx) of nmessages"
        :key="idx"
        @click="toDetail('/user/' + $store.state.user.nickname + '/messages/' + item.mid)">
        <div class="from">{{ item.from }}</div>
        <div class="title">{{ item.title }}</div>
        <div class="date">{{ item.date }}</div>
      </dd>
      <dd v-if="messageslen" class="no-data">暂无数据 ...</dd>
    </dl>
  </div>
</template>

<script>
import UserNav from '@/components/user/nav'
import DateDeal from '@/server/interface/utils/date_iso_to_ch'
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
    const data = {}
    const users_find = await $axios.get('/users/all')
    const messages_find = await $axios.get('/messages/all', { 
      params: { nickname: params.nickname }
    })
    if (users_find.status === 200) {
      if (users_find.data.code === 0) {
        data.users = users_find.data.users
      } else {
        console.log(users_find.status, users_find.code, users_find.msg)
      }
    } else {
      console.log(users_find.status)
    }
    if (messages_find.status === 200 && messages_find.data.code === 0) {
      data.messages = messages_find.data.messages
    } else {
      console.log(messages_find.status)
    }
    return data
  },
  computed: {
    popUsers () {
      let bool = false
      let isfocus = this.isfocus
      if (isfocus) {
        let users = this.users.filter(item => { return item.nickname !== this.$store.state.user.nickname })
        users = users.map(item => { return item.nickname + ' @' + item.contacts[0].email })
        const hasuser = users.some(item => { return item === this.keyword })
        bool = hasuser || this.keyword === '' ? false : true
        return bool && isfocus
      } else {
        return bool && isfocus
      }
    },
    nmessages () {
      const nmessages = this.messages.map(item => {
        item.date = DateDeal.datetime(item.date)
        return item
      })
      return nmessages
    },
    messageslen () {
      return this.messages.length <= 0
    },
    nuser () {
      let users = this.users.filter(item => {
        return item.nickname.indexOf(this.keyword) >= 0 || item.contacts[0].email.indexOf(this.keyword) >= 0
      })
      users = users.filter(item => { return item.nickname !== this.$store.state.user.nickname })
      return users
    },
    nodataState () {
      let users = this.users.filter(item => {
        return item.nickname.indexOf(this.keyword) >= 0 || item.contacts[0].email.indexOf(this.keyword) >= 0
      })
      users = users.filter(item => { return item.nickname !== this.$store.state.user.nickname })
      return users.length <= 0 ? true : false
    },
  },
  data () {
    return {
      keyword: '',
      title: '',
      content: '',
      isfocus: false
    }
  },
  methods: {
    selectUser (user_email) {
      this.keyword = user_email
      this.isok = true
    },
    inputBlur () {
      setTimeout(() => { this.isfocus = false }, 500)
    },
    cancel () {
      this.keyword = ''
      this.content = ''
    },
    async send () {
      const atIndex = this.keyword.indexOf(' @')
      const data = {
        from: this.$store.state.user.nickname,
        to: '',
        title: '',
        content: ''
      }
      if (atIndex > 0) {
        data.to = this.keyword.slice(0, atIndex)
      } else {
        this.$message({ message: '请通过搜索匹配选择接收方账户', duration: 2000 })
        return false
      }
      if (this.title !== ''){
        data.title = this.title
      } else {
        this.$message({ message: '内容标题不能为空', duration: 2000 })
        return false
      }
      let content = this.content.replace(/\r\n/g, '<br/>')
      content = content.replace(/\n/g, '<br/>')
      content = content.replace(/\s/g, ' ')
      if (content !== '') {
        data.content = content
      } else {
        this.$message({ message: '信息内容不能为空', duration: 2000 })
        return false
      }
      const { status, data: { code, msg } } = await this.$axios.post('/messages/sendMsg', data )
      if (status === 200) {
        if (code === 0) {
          this.$message({ message: msg, type: 'success', duration: 2000 })
          this.keyword = ''
          this.title = ''
          this.content = ''
        } else {
          this.$message({ message: msg, duration: 2000 })
        }
      } else {
        this.$message({ message: status, type: 'error'})
      }
    },
    toDetail (src) {
      this.$router.push(src)
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/user/_nickname/common.scss';
</style>
