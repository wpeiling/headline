<template>
  <div>
    <router-view></router-view>

    <van-tabbar v-model="active" route>
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Main',
  data () {
    return {
      active: 0
    }
  }
}
</script>

<style lang="less" scoped>

</style>
