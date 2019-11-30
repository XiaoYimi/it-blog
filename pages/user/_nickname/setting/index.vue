<template>
  <div class="user-setting">
    <user-nav/>
    <dl class="user-item-wrapper">
      <dt class="user-item-title">基本信息</dt>
      <dd class="user-item-info">
        <div class="title">注册邮箱</div>
        <div class="content">
          <span class="value">{{ $store.state.user.contacts.email }}</span>
          <span class="tip">(注册来源，无法更改)</span>
        </div>
      </dd>

      <dd class="user-item-info">
        <div class="title">昵称</div>
        <div class="content">
          <span class="value">{{ $store.state.user.nickname }}</span>
          <span class="tip">(用户唯一标识)</span>
        </div>
      </dd>

      <dd class="user-item-info">
        <div class="title">
          <span class="title-span">博文分组</span>
          <el-button size="mini" round @click="groupPop = true">创建分组</el-button>
        </div>
        <div class="content-groups">
          <div v-for="(item, gid) of $store.state.user.groups" :key="gid" class="content-groups-item">
            <span class="pop-switch">
              {{ item.name + ' (' + item.count + ')'}}
              <div class="pop" v-if="item.name !== 'default'">
                <span @click="openPopDeleteGroup(item.name)" class="btn">删除</span>
              </div>
            </span>
          </div>
        </div>
      </dd>

      <dd class="user-item-info">
        <div class="title">
          <span class="title-span">联系方式</span> 
          <el-button size="mini" round @click="openPopChangeContacts($store.state.user.contacts)">修改</el-button>
        </div>
        <div class="content-groups">
          <div class="content-groups-item">
            <span class="key">微信: </span>
            <span class="value"> {{ $store.state.user.contacts.wechat? $store.state.user.contacts.wechat : '空' }}</span>
          </div>
          <div class="content-groups-item">
            <span class="key">Q  Q : </span>
            <span class="value"> {{ $store.state.user.contacts.qq? $store.state.user.contacts.qq : '空' }}</span>
          </div>
          <div class="content-groups-item">
            <span class="key">微博: </span>
            <span class="value"> {{ $store.state.user.contacts.weibo? $store.state.user.contacts.weibo : '空' }}</span>
          </div>
          <div class="content-groups-item">
            <span class="key">邮箱: </span>
            <span class="value"> {{ $store.state.user.contacts.email? $store.state.user.contacts.email : '空' }}</span>
          </div>
          <div class="content-groups-item">
            <span class="key">手机号: </span>
            <span class="value"> {{ $store.state.user.contacts.phone? $store.state.user.contacts.phone : '空' }}</span>
          </div>
        </div>
      </dd>

      <dd class="user-item-info">
        <div class="title">所在地</div>
        <div class="content">
          <el-select v-model="province" placeholder="请选择省份" size="medium" @change="selectProvince">
            <el-option
              v-for="(item, pid) in provinces"
              :key="pid"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
          <el-select v-model="city" placeholder="请选择城市" size="medium" @change="selectCity">
            <el-option
              v-for="(item, cid) in cities"
              :key="cid"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </div>
      </dd>

      <dd class="user-item-info">
        <div class="title">兴趣</div>
        <div class="content">
          <el-tag v-for="(tag, tid) of hobbys" closable 
            :key="tid"
            @close="deleteTag(tid)" class="tag">
            {{tag}}
          </el-tag>
          <el-input v-if="newtagState" v-model="newtag"
            ref="saveTagInput" size="small"
            @keyup.enter.native="createTag"
            @input="newtagValidate"
            @blur="createTag"
            class="tag new-tag"
          />
          <el-button v-else class="tag" size="small" @click="newtagStateShowing" v-show="hobbys.length < 3">添加标签</el-button>
          <span class="new-tag-tip" v-show="newtagTig">标签不能超过 6 个字符</span>
        </div>
      </dd>
    </dl>

    <dl class="user-item-wrapper">
      <dt class="user-item-title">账户管理</dt>
      <dd class="user-item-info">
        <div class="title">注销账户</div>
        <div class="content">
          <span class="warn">注销账户将会完全删除所有关于您的数据,请谨慎考虑该行为</span>
          <el-button size="mini" round class="cancellation-btn"
            @click="popCancellation = true">账户注销</el-button>
        </div>
      </dd>
    </dl>

    <el-dialog title="创建博文分组" :visible.sync="groupPop" :before-close="closeGroupPop"
    class="wrapper-pop create-group">
      <div class="wrapper-pop-item">
        <el-input v-model="newgroup"></el-input>
      </div>
      <div class="wrapper-pop-btns">
        <el-button size="medium" @click="closeGroupPop">取消</el-button>
        <el-button size="medium" type="primary" @click="createNewGroup">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="设置" :visible.sync="popCancellation" width="30%" :before-close="closePopCancellation"
    class="wrapper-pop cancellation-user">
      <span>
        是否注销账户?<br/>
        <span style="color: #ff2929; font-size: 10px;">若注销账户将会完全删除所有关于您的数据</span>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="popCancellation = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="toCancellation($store.state.user.nickname)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="联系方式设置" :visible.sync="formPop"
    class="wrapper-pop change-contacts">
      <el-form :model="form" :rules="rules" ref="form" class="wrapper-pop-form">
        <el-form-item label="微信" prop="wechat">
          <el-input v-model="form.wechat" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="form.qq" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="微博" prop="weibo">
          <el-input v-model="form.weibo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="form.code" autocomplete="off">
            <el-button slot="append" @click="getCode" class="code-btn">{{ timercount }}</el-button>
          </el-input>
        </el-form-item>
        <el-form-item >
          <div class="timertip">{{ timertip }}</div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="formPop = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="formSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="删除博文分组"
      :visible.sync="popDeleteGroup"
      width="30%"
      :before-close="closePopDeleteGroup"
      class="wrapper-pop delete-group">
      <span>
        是否删除当前组?<br/>
        <span style="color: #ff2929; font-size: 10px;">若删除当前组将会完全销毁该组的所有博文</span>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="popDeleteGroup = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="deleteGroup(deleteGroupName)">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import UserNav from '@/components/user/nav'
import CountDown from '@/server/interface/utils/countdown'
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
  async asyncData ({ $axios }) {
    let provinces = [], cities = []
    const res_provinces = await $axios.get('/position/provinces')
    if (res_provinces.status === 200 && res_provinces.data.code === 0) {
      provinces = res_provinces.data.provinces
    }
    return { provinces, cities }
  },
  async created () {
    this.province = this.$store.state.user.province.code
    const { status, data: { cities } } = await this.$axios.post('/position/cities', {
      pcode: this.province, nickname: this.$store.state.user.nickname
    })
    this.cities = cities
    this.city = this.$store.state.user.city.code
  },
  data () {
    var validateEmail = (rule, value, callback) => {
      const patt = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (value === '') { callback(new Error('邮箱不能为空')) }
      else {
        setTimeout(() => {
          patt.test(value)? callback() : callback(new Error('请输入正确的邮箱'))
        }, 100)
      }
    }
    var validateMobile = (rule, value, callback) => {
      const patt = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (value === '') { callback() }
      else {
        setTimeout(() => {
          patt.test(value)? callback() : callback(new Error('请输入正确的手机号'))
        }, 100)
      }
    }
    return {
      province: '',
      city: '',
      popCancellation: false,
      formPop: false,
      form: {
        wechat: '',
        qq: '',
        weibo: '',
        email: '',
        phone: '',
        code: '',
      },
      timercount: '获取验证码',
      timertip: '',
      rules: {
        email: [
          { required: true, message: `邮箱不能为空`, trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        phone: [{ validator: validateMobile, trigger: 'blur'  }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      newtagState: false,
      newtag: '',
      newtagTig: false,
      groupPop: false,
      newgroup: '',
      deleteGroupName: '',
      popDeleteGroup: false
    }
  },
  computed: {
    hobbys () {
      return this.$store.state.user.hobby
    }
  },
  methods: {
    async selectProvince () {
      const { status, data: { code, msg, cities, province } } = await this.$axios.post('/position/cities', {
        pcode: this.province,
        nickname: this.$store.state.user.nickname
      })
      if (status === 200 && code === 0) {
        this.cities = cities
        this.city = cities[0].code
        this.$store.dispatch('updatePositions', { province, city: cities[0] })
      } else {
        console.log(status, code, msg)
      }
    },
    async selectCity () {
      const { status, data: { code, msg, city } } = await this.$axios.post('/position/updateCity', {
        code: this.city,
        nickname: this.$store.state.user.nickname
      })
      if (status === 200 && code === 0) {
        this.$store.dispatch('updateCity', { city })
        console.log(status, code, city)
      } else {
        console.log(status, code, city)
      }
    },
    getCode () {
      this.$axios.post('/contacts/verify', {
        email: this.$store.state.user.contacts.email,
        nickname: this.$store.state.user.nickname
      }).then(({ status, data }) => {
        if (this.timer) { return }
        if (status === 200 && data && data.code === 0) {
          this.timertip = data.msg
          CountDown.oneMinute(this)
        } else {
          this.timertip = '网络请求出错，请稍后重试'
        }
      })
    },
    openPopChangeContacts (contacts) {
      this.form.wechat = contacts.wechat
      this.form.qq = contacts.qq
      this.form.weibo = contacts.weibo
      this.form.email = contacts.email
      this.form.phone = contacts.phone
      this.form.code = ''
      this.formPop = true
    },
    async formSubmit () {
      const { wechat, qq, weibo, email, phone, code } = this.form
      const nickname = this.$store.state.user.nickname
      const { status, data } = await this.$axios.post('/contacts/changeContacts', {
        nickname, wechat, qq, weibo, email, phone, code
      })
      if (status === 200 && data.code === 0) {
        this.formPop = false
        await this.$store.dispatch('updateContacts', { wechat, qq, weibo, email, phone })
        this.$notify({
          title: '修改联系方式',
          message: data.msg
        })
      } else {
        this.$notify({
          title: '修改联系方式',
          message: '修改失败, 错误码: ' + data.code + ', ' + data.msg 
        })
      }
    },
    closePopCancellation (done) { done() },
    async toCancellation (nickname) {
      this.popCancellation = false
      const { status, data: { code, msg } } = await this.$axios.post('/users/cancellation', { nickname })
      if (status === 200 && code === 0) {
        console.log(status, msg)
        this.$router.push('/')
      } else { 
        console.log(status, code, msg)
      }
    },

    async deleteTag (tid) {
      const tag = this.hobbys[tid]
      const { status, data: { code, msg, res }} = await this.$axios.post('/users/deleteTag', {
        tag,
        nickname: this.$store.state.user.nickname
      })
      if (status === 200 && code === 0) {
        this.$store.dispatch('deleteTag', { tag })
        this.newtagTig = false
      } else {
        console.log(status, code, msg)
      }
    },
    newtagStateShowing () {
      this.newtagState = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      })
    },
    newtagValidate () {
      if (this.newtag.length > 6) { this.newtagTig = true }
      else { this.newtagTig = false }
    },
    async createTag () {
      const newtag = this.newtag
      if (newtag) {
        const { status, data: { code, msg, hobby } } = await this.$axios.post('/users/createTag', {
          newtag,
          nickname: this.$store.state.user.nickname
        })
        if (status === 200 && code === 0) {
          this.$store.dispatch('createTag', { hobby })
        } else {
          console.log(status, code, msg, 111)
        }
      }
      this.newtagState = false
      this.newtag = ''
    },
    closeGroupPop () {
      this.groupPop = false
      this.newgroup = ''
    },
    async createNewGroup () {
      const newgroup = this.newgroup
      if (/^[A-Za-z]+$/.test(newgroup)) {
        const { status, data: { code, msg, groups } } = await this.$axios.post('/groups/createGroup', {
          newgroup,
          nickname: this.$store.state.user.nickname
        })
        if (status === 200) {
          if (code === 0) {
            this.$store.dispatch('createGroup', { groups })
            this.newgroup = ''
            this.groupPop = false
            this.$message({ message: msg, type: 'success', duration: 2000 })
          } else {
            this.$message({ message: msg, duration: 2000 })
          }
        } else {
          this.$message({ message: status, type: 'error' })
        }
      } else {
        this.$message({ message: '博文分组名只能由英文字符构成' })
      }
    },
    openPopDeleteGroup (group) {
      this.deleteGroupName = group
      this.popDeleteGroup = true
    },
    closePopDeleteGroup (done) { done() },
    async deleteGroup () {
      const { status, data: { code, msg, groups } } = await this.$axios.post('/groups/deleteGroup', {
        group: this.deleteGroupName,
        nickname: this.$store.state.user.nickname
      })
      if (status === 200) {
        if (code === 0) {
          this.$store.dispatch('deleteGroup', { groups })
          this.popDeleteGroup = false
          this.$message({ message: msg, type: 'success', duration: 2000 })
        } else {
          this.$message({ message: msg, duration: 2000 })
        }
      } else {
        this.$message({ message: status, type: 'error' })
      }
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/user/_nickname/common.scss';
</style>
