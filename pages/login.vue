<template>
  <div class="page-login">
    <div class="login-wrapper">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="60px">
        <el-form-item label="方式" prop="mode">
          <el-radio-group v-model="ruleForm.mode" @change="modeChange">
            <el-radio label="账号"></el-radio>
            <el-radio label="邮箱" disabled></el-radio>
            <el-radio label="手机" disabled></el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email" v-if="ruleForm.mode === '邮箱'" class="pc-input-box">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone" v-else-if="ruleForm.mode === '手机'" class="pc-input-box">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="nickname" v-else class="pc-input-box">
          <el-input v-model="ruleForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass" class="pc-input-box">
          <el-input type="password" autocomplete="off" v-model="ruleForm.pass"></el-input>
        </el-form-item>

        <el-form-item class="pc-input-box error-info-box">
          <span :class="['error-info', errMsg != ''? 'error-info-active' : '']">{{ errMsg }}</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button @click="resetForm('ruleForm')">全部清除</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import CryptoJs from 'crypto-js'
import Cookie from 'js-cookie'
export default {
  layout: 'account',
  async fetch ({store, params, $axios}) {
    const {status, data: { code, user }} = await $axios.get('/users/baseUser')
    if (status === 200 && code === 0) {
      store.commit('getUser', user)
    }
  },
  data () {
    var validateEmail = (rule, value, callback) => {
      const patt = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (value === '') { callback(new Error('邮箱不能为空')) }
      setTimeout(() => {
        patt.test(value)? callback() : callback(new Error('请输入正确的邮箱'))
      }, 100)
    }
    var validatePhone = (rule, value, callback) => {
      const patt = /^1[3|4|5|7|8][0-9]{9}$/
      if (value === '') { callback(new Error('手机号不能为空')) }
      setTimeout(() => {
        patt.test(value)? callback() : callback(new Error('请输入正确的手机号'))
      }, 100);
    }

    var validatePass = (rule, value, callback) => {
      const patt = /^\w{6,18}$/
      if (value === '') { callback(new Error('密码不能为空')) }
      setTimeout(() => {
        patt.test(value)? callback() : callback(new Error('密码格式错误'))
      }, 100)
    }

    return {
      ruleForm: {
        mode: '账号',
        nickname: '',
        email: '',
        phone: '',
        pass: ''
      },
      rules: {
        mode: [{ required: true, message: '请选择登录方式', trigger: 'change' }],
        nickname: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 - 8 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 - 18 个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      errMsg: ''
    }
  },
  methods: {
    modeChange () {
      let self = this
      const option = self.ruleForm.mode
      self.$refs['ruleForm'].resetFields()
      for (let key in self.ruleForm) {
        key === 'mode'? self.ruleForm['mode'] = self.ruleForm[key] : self.ruleForm[key] = '' 
      }
      self.ruleForm.mode = option
    },
    submitForm (formName) {
      let self = this
      let account = '', pass = '', mode = '';
      self.$refs[formName].validate((valid) => {
        if (valid) {
          for (let key in self.ruleForm) {
            switch (key) {
              case 'mode': 
                mode = self.ruleForm[key]
                break
              case 'pass':
                pass = self.ruleForm[key]
                break
              default:
                if (self.ruleForm[key]) {
                  account = self.ruleForm[key]
                }
                break
            }
          }
          // 提交表单并与数据库校正账户密码，并设置登录cookie
          self.$axios.post('/users/signin', {
            nickname: account,
            pass: CryptoJs.MD5(pass).toString()
          }).then(({ status, data }) => {
            if (status === 200) {
              if (data && data.code === 0) {
                Cookie.set('limitNumber', data.limitNumber)
                this.$router.replace({ path: '/user/' + data.user.nickname })
              }
              else {
                this.errMsg = data.msg
                setTimeout(() => {
                  this.errMsg = ''
                }, 1500)
              }
            } else {
              console.log('网络请求错误，请稍后尝试')
            }
          })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/public/login.scss';
</style>
