<template>
  <div class="notice-rules-wrapper">
    <h3>注册规则</h3>
    <ul class="notice-rules">
      <li v-for="(item, idx) of registerRules" :key="idx" class="notice-rules-item">
        <div class="title">{{ item.name }}</div>
        <div class="rules">
          <div v-for="(rule,ridx) of item.rules" :key="ridx" v-html="rule" class="rules-item"/>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
    data () {
      return {
        registerRules: [{
          name: '邮箱',
          rules: ['<b>以 QQ 邮箱注册为主</b>', '暂未开通登录模块']
        },{
          name: '手机号',
          rules: ['暂未开通登录模块']
        },{
          name: '昵称',
          rules: [
            '字数不超过 <b>4</b>~<b>8</b> 位数',
            '由<b>英文字符</b>、<b>数字</b>、<b>下划线</b>共同组成',
            '昵称是用户唯一标识，一旦注册便无法修改',
            '<b>暂时以该昵称作为账户登录</b>'
          ]
        },{
          name: '密码',
          rules: [
            '字数 <b>6</b>~<b>18</b> 位',
            '由<b>英文字符</b>、<b>数字</b>、<b>下划线</b>共同组成'
          ]
        }]
      }
    }
}
</script>

<style lang="scss">
  @import '@/assets/css/public/registerrules.scss';
</style>
