<template>
  <div class="login-container">
    <van-nav-bar title="西瓜头条 - 登录" fixed />

    <!-- 登录的表单 -->
    <van-form @submit="login">
      <van-field v-model="form.mobile" type="tel" label="手机号码" placeholder="请输入手机号码" required :rules="rules.mobile">
      </van-field>
      <van-field v-model="form.code" type="password" label="登录密码" placeholder="请输入登录密码" required :rules="rules.code">
      </van-field>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { loginAPI } from '@/api/userAPI'
import { mapMutations } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      form: {
        mobile: '13888888123',
        code: '246810'
      },
      rules: {
        // 手机号的校验规则
        mobile: [
          { required: true, message: '请填写您的手机号', trigger: 'onBlur' },
          { pattern: /^1\d{10}$/, message: '请填写正确的手机号', trigger: 'onBlur' }
        ],
        // 密码的校验规则
        code: [
          { required: true, message: '请填写您的密码', trigger: 'onBlur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['updataTokenInfo']),
    async login () {
      const { data: res } = await loginAPI(this.form)
      if (res.message === 'OK') {
        this.$toast('登录成功')
        // 登录后操作
        this.updataTokenInfo(res.data)
        // this.$router.push('/')
        console.log(this.$route.query.pre)
        const navPath = this.$route.query.pre || '/'
        this.$router.push(navPath)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  padding-top: 46px;
}
</style>
