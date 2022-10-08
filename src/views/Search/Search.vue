<template>
  <div>
    <div class="search-header">
      <van-icon name="arrow-left" color="white" size="18" class="goback" @click="$router.back()" />
      <van-search ref="searchIptRef" v-model.trim="kw" placeholder="请输入搜索关键词" background="#007BFF" shape="round"
        @input="onInput" />
    </div>
    <!-- 搜索建议 -->
    <div class="sugg-list" v-if="kw.length !== 0">
      <div class="sugg-item" v-for="(item, i) in suggestlist" :key="i" v-html="item.title" @click="gotoSearchResult">
      </div>
    </div>

    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="history = []" />
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span class="history-item" v-for="(tag, i) in history" :key="i" @click="gotoSearchResult">{{tag}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { getSuggestListAPI } from '@/api/homeAPI'
export default {
  name: 'Search',
  data () {
    return {
      // 搜索关键词
      kw: '',
      timeId: null,
      // 搜索建议列表
      suggestlist: [],
      // 搜索历史
      history: JSON.parse(localStorage.getItem('history') || [])
    }
  },
  created () {

  },
  methods: {
    async initSuggestList () {
      const { data: res } = await getSuggestListAPI(this.kw)
      if (res.message === 'OK') {
        this.changeColor(res.data.results)
        this.suggestlist = res.data.results
        // 把搜索关键词加入到搜索历史中
        const newHistory = this.history.filter(x => x !== this.kw)
        newHistory.unshift(this.kw)
        this.history = newHistory
      }
    },

    onInput () {
      clearTimeout(this.timeId)

      if (this.kw.length === 0) {
        this.suggestlist = []
        return
      }
      this.timeId = setTimeout(() => {
        this.initSuggestList()
      }, 500)
    },
    // 高亮搜索关键词的方法，形参中的 arr 是搜索建议的数组
    changeColor (result) {
      // result为接口返回的数据
      result.map((item, index) => {
        if (this.kw) {
          /**
           * 使用正则表达式进行全文匹配关键词
           * ig : 表示 全文查找 ,忽略大小写
           *  i : 忽略大小写
           *  g : 全文查找
           *
           * 使用字符串的replace方法进行替换
           * stringObject.replace('被替换的值',替换的值)
           */
          const replaceReg = new RegExp(this.kw, 'ig')
          const replaceString = `<span style="color: #ed4014">${this.kw}</span>`
          result[index].title = item.title.replace(replaceReg, replaceString)
        }
      })
      this.records = result
    },
    // 跳转到搜索结果页
    gotoSearchResult (e) {
      const kw = e.currentTarget.innerText
      this.$router.push({ path: `/search/ ${kw}`, query: { kw } })
    }
  },
  mounted () {
    const ipt = document.querySelector('input[type=search]')
    ipt && ipt.focus()
  },
  watch: {
    history (newValue) {
      localStorage.setItem('history', JSON.stringify(newValue))
    }
  }
}
</script>
<style lang="less" scoped>
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;

  // 后退按钮
  .goback {
    padding-left: 14px;
  }

  // 搜索组件
  .van-search {
    flex: 1;
  }
}

.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;

  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
