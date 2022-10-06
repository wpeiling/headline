<template>
  <div>
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" :disabled="finished">
      <!-- 上拉加载 -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
        <!-- 文章列表 -->
        <art-item v-for="(item,index) in artlist" :key="index" :article="item" @remove-article="removeArticle">
        </art-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArtListAPI } from '@/api/homeAPI'
import ArtItem from '@/components/ArtItem/ArtItem.vue'
export default {
  // 大驼峰命名法：每个单词的首字母大写
  name: 'ArtList',
  props: {
    // 频道Id
    channelId: {
      type: Number,
      required: true
    }
  },
  components: {
    ArtItem
  },
  data () {
    return {
      // 文章列表的数组
      artlist: [],
      // 时间戳。初始的默认值为当前的时间戳
      timestamp: Date.now(),
      // 上拉加载
      loading: false,
      finished: false,
      // 下拉刷新
      refreshing: false
    }
  },
  created () {
    this.initArtList()
  },
  methods: {
    // 初始化文章的列表数据
    async initArtList (isRefresh) {
      const { data: res } = await getArtListAPI(this.channelId, this.timestamp)
      if (res.message === 'OK') {
        this.timestamp = res.data.pre_timestamp
        if (isRefresh) {
          this.artlist = [...res.data.results, ...this.artlist]
          this.refreshing = false
        } else {
          this.artlist = [...this.artlist, ...res.data.results]
          this.loading = false
        }
        //  判断所有的数据是否已加载完毕
        if (res.data.pre_timestamp === null) {
          this.finished = true
        }
      }
    },
    onLoad () {
      this.initArtList()
    },
    onRefresh () {
      this.$toast('刷新成功')
      this.initArtList(true)
    },
    removeArticle (id) {
      this.artlist = this.artlist.filter(o => o.art_id.toString() !== id)
      if (this.artlist.length < 10) {
        this.initArtList()
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
