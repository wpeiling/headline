<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="userProfile.photo" @click="$refs.fileRef.click()" />
          <!-- 文件选择框 -->
          <input type="file" accept="image/*" @change="onFileChange" v-show="false" ref="fileRef" />
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="userProfile.name" @click="onNameCellClick" />
      <van-cell title="生日" is-link :value="userProfile.birthday" @click="onBirthCellClick" />
    </van-cell-group>

    <!-- 修改用户名称 -->
    <van-dialog v-model="showNameDialog" title="修改名称" show-cancel-button :before-close="beforeClose">
      <van-field v-model.trim="name" input-align="center" placeholder="请输入用户名" maxlength="12" ref="nameRef" />
    </van-dialog>

    <!-- 修改生日 -->
    <van-action-sheet v-model="showBirthSheet" :value="userProfile.birthday">
      <van-datetime-picker v-model="currentDate" type="date" title="选择出生日期" :min-date="minDate" :max-date="maxDate"
        @cancel="showBirthSheet = false" @confirm="updateBirthday" />
    </van-action-sheet>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { updateUserProfileAPI, updateUserAvatarAPI } from '@/api/userAPI'
import dayjs from 'dayjs'
export default {
  name: 'UserEdit',
  data () {
    return {
      // 是否展示修改姓名的对话框
      showNameDialog: false,
      // 用户填写的姓名
      name: '',
      // 是否展示修改生日的对话框
      showBirthSheet: false,
      // 最小可选日期（0 表示 1月份）
      minDate: new Date(1900, 0, 1),
      // 最大可选日期（11 表示 12月份）
      maxDate: new Date(2050, 11, 31),
      // 当前日期
      currentDate: new Date()
    }
  },
  created () {
    this.initUserProfile()
  },
  methods: {
    ...mapActions(['initUserProfile']),
    onNameCellClick () {
      this.name = this.userProfile.name
      this.showNameDialog = true
      this.$nextTick(() => {
        this.$refs.nameRef.focus()
      })
      this.updateName()
    },
    // Dialog 关闭前的处理函数
    beforeClose (action, done) {
      // 取消按钮
      if (action === 'cancel') return done()
      if (this.name === '' || this.name.length > 12) {
        this.$notify({ type: 'warning', message: '名称的长度为1-12个字符', duration: 2000 })
        this.$refs.nameRef.focus()
        //  阻止对话框关闭
        return done(false)
      }
      this.updateName(done)
    },
    // 更新名字
    async updateName (done) {
      try {
        const { data: res } = await updateUserProfileAPI({ name: this.name })
        if (res.message === 'OK') {
          done()
          this.initUserProfile()
          this.$notify({ type: 'success', message: '名称更新成功', duration: 1000 })
        }
      } catch (err) {
        if (err.response.status === 409) {
          this.$notify({ type: 'warming', message: '名称被占用，请更换后重试！', duration: 1000 })
          done(false)
          this.$refs.nameRef.focus()
        } else {
          done()
          this.$notify({ type: 'warming', message: '名称更新失败！', duration: 1000 })
        }
      }
    },
    onBirthCellClick () {
      this.currentDate = this.userProfile.birthday ? new Date(this.userProfile.birthday) : new Date()
      this.showBirthSheet = true
    },
    // 更改生日
    async updateBirthday (value) {
      this.showBirthSheet = false
      const dateStr = dayjs(value).format('YYYY-MM-DD')
      const { data: res } = await updateUserProfileAPI({ birthday: dateStr })
      if (res.message === 'OK') {
        this.initUserProfile()
        this.$notify({ type: 'success', message: '生日修改成功', duration: 1000 })
      }
      console.log(value)
    },
    // 选中的文件发生了变化
    async onFileChange (e) {
      // 获取到用户选择的文件列表
      const files = e.currentTarget.files
      if (files.length === 0) return
      const fd = new FormData()
      fd.append('photo', files[0])
      const { data: res } = await updateUserAvatarAPI(fd)
      if (res.message === 'OK') {
        this.initUserProfile()
        this.$notify({ type: 'success', message: '头像修改成功', duration: 600 })
      }
    }

  },
  computed: {
    ...mapState(['userProfile'])
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
}

.user-edit-container {
  padding-top: 46px;

  .avatar {
    width: 50px;
    height: 50px;
  }
}

/deep/.van-nav-bar .van-icon {
  color: #f5f5f5;
}
</style>
