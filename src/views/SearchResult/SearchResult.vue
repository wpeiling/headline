<template>
  <div class="search-result-container">
    <!-- 点击实现后退效果 -->
    <van-nav-bar title="搜索结果" left-arrow @click-left="$router.back()" fixed />
    <!-- 上拉加载 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
    </van-list>
    <!-- 文章的 Item 项 -->
    <art-item v-for="item in searchlist" :key="item.art_id" :article="item" :closable="false"></art-item>
  </div>
</template>

<script>
import { getSearchResultAPI } from '@/api/searchAPI'
import ArtItem from '@/components/ArtItem/ArtItem.vue'
export default {
  name: 'SearchResult',
  data () {
    return {
      page: 1,
      searchlist: [],
      // 上拉加载
      loading: false,
      finished: false
    }
  },
  components: {
    ArtItem
  },
  created () {
    this.initSearchList()
  },
  methods: {
    async initSearchList () {
      const { data: res } = await getSearchResultAPI(this.$route.params.kw, this.page)
      if (res.message === 'OK') {
        this.searchlist = [...this.searchlist, ...res.data.results]
        this.loading = false
        // if (res.data.results.length === 0) {
        //   this.finished = true
        // }
        this.page += 1
      }
    },
    onLoad () {
      this.initSearchList()
    }
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}

/deep/.van-nav-bar .van-icon {
  color: #f5f5f5;
}
</style>
