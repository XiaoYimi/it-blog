<template>
  <div class="page-register">
    <div class="register-wrapper">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
        
        <el-form-item label="用户名" prop="nickname" class="pc-input-box">
          <el-input v-model="ruleForm.nickname"/>
        </el-form-item>

        <el-form-item label="邮箱" prop="signup" class="pc-input-box">
          <el-input v-model="ruleForm.signup"/>
        </el-form-item>

        <el-form-item label="密码" prop="pass" class="pc-input-box">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"/>
        </el-form-item>

        <el-form-item label="确认密码" prop="checkPass" class="pc-input-box">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"/>
        </el-form-item>

        <el-form-item label="职业" prop="occupation">
          <el-select v-model="ruleForm.occupation" placeholder="请选择您的职业">
            <el-option label="Web前端工程师" value="Web前端工程师"></el-option>
            <el-option label="PHP工程师" value="PHP工程师"></el-option>
            <el-option label="Java工程师" value="Java工程师"></el-option>
            <el-option label="Python工程师" value="Python工程师"></el-option>
            <el-option label="系统分析师" value="系统分析师"></el-option>
            <el-option label="系统架构设计师" value="系统架构设计师"></el-option>
            <el-option label="数据库管理员" value="数据库管理员"></el-option>
            <el-option label="信息系统安全师" value="信息系统安全师"></el-option>
            <el-option label="软件测试师" value="软件测试师"></el-option>
            <el-option label="软件项目管理师" value="软件项目管理师"></el-option>
            <el-option label="计算机操作员" value="计算机操作员"></el-option>
            <el-option label="其它" value="其它"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="验证码" prop="code" class="pc-input-box">
          <el-input v-model="ruleForm.code" maxlength="4">
            <el-button slot="append" @click="getCode" class="btn-code">获取验证码</el-button>
          </el-input>
        </el-form-item>

        <el-form-item class="pc-input-box">
          <span class="code-msg">{{ msg }}</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
          <el-button @click="resetForm('ruleForm')">全部清除</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import CryptoJs from 'crypto-js'
export default {
  layout: 'account',
  async fetch ({store, params, $axios}) {
    const {status, data: { code, user }} = await $axios.get('/users/baseUser')
    if (status === 200 && code === 0) {
      store.commit('getUser', user)
    }
  },
  data() {
    var validateEmail = (rule, value, callback) => {
      const patt = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (value === '') { callback(new Error('邮箱不能为空')) }
      else {
        setTimeout(() => {
          patt.test(value)? callback() : callback(new Error('请输入正确的邮箱'))
        }, 100)
      }
    }
    var validateName = (rule, value, callback) => {
      const  patt = /^\w{3,8}$/
      if (value === '') {
        callback(new Error('用户名不能为空'))
      } else {
        setTimeout(() => {
          patt.test(value)? callback() : callback(new Error('请输入正确格式用户名'))
        })
      }
    }
    var validatePass = (rule, value, callback) => {
      const patt = /^\w{6,18}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (patt.test(value)) {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass')
          }
          callback();
        } else {
          callback(new Error('密码格式错误'))
        }
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }

    return {
      ruleForm: {
        signup: '',
        nickname: '',
        pass: '',
        checkPass: '',
        occupation: '',
        code: ''
      },
      msg: '',
      rules: {
        signup: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        occupation: [
          { required: true, message: '请选择您的职业', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getCode (e) {
      let self = this
      let namePass
      let emailPass
      let span = e.target.nodeName.toLowerCase() === 'span'? e.target : e.target.children[0]

      if (self.timerId) { return }
      self.$refs['ruleForm'].validateField('nickname', (valid) => {
        namePass = valid
      })
      self.$refs['ruleForm'].validateField('signup', (valid) => {
        emailPass = valid
      })

      if (!namePass && !emailPass) {
        this.$axios.post('/users/verify', {
          signup: self.ruleForm.signup,
          nickname: self.ruleForm.nickname
        }).then(({ status, data}) =>{
          if (status === 200 && data && data.code === 0) {
            self.msg = data.msg
            let count = 60
            self.timerId = setInterval(() => {
              span.innerText =  `${--count} s`
              if (count === 0) {
                clearInterval(self.timerId)
                self.timerId = null
                span.innerText = '获取验证码'
                self.msg = '验证码超时，请重新获取'
              }
            }, 1000)
          } else {
            self.msg = '网络请求出错，请稍后尝试'
          }
        })
      }
    },
    submitForm(formName) {
      let self = this
      self.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单并写入数据库
          self.$axios.post('/users/signup', {
            nickname: self.ruleForm.nickname,
            signup: self.ruleForm.signup,
            pass: CryptoJs.MD5(self.ruleForm.pass).toString(),
            occupation: self.ruleForm.occupation,
            code: self.ruleForm.code
          }).then(({ status, data }) => {
            if (status === 200) {
              if (data && data.code === 0) {
                self.msg = data.msg
                setTimeout(() => {
                  location.href = '/login'
                }, 1200)
              } else {
                self.msg = data.msg
              }
            } else {
              self.msg = '网络请求出错，请稍后尝试'
            }
            setTimeout(() => {
              self.msg = ''
            }, 1500)
          })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/public/register.scss';
</style>
