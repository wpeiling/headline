<template>
  <div class="artitem-container" @click="$router.push('/article/'+artId)">
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{article.title}}</span>
          <!-- 单张图片 -->
          <img v-if="article.cover.type === 1" v-lazy="article.cover.images[0]" alt="" class="thumb">
        </div>
        <!-- 三张图片 -->
        <div class="thumb-box" v-if="article.cover.type === 3">
          <img alt="" class="thumb" v-for="(item, index) in article.cover.images" :key="index" v-lazy="item">
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <span>作者:{{article.aut_name}}{{article.cover.type}} &nbsp;&nbsp; {{article.comm_count}}评论 &nbsp;&nbsp;
            发布日期:{{article.pubdate |
            dateFormate}}</span>
          <!-- 关闭按钮 -->
          <van-icon name="cross" @click.stop="show = true" v-if="closable" />
        </div>
      </template>
    </van-cell>

    <van-action-sheet v-model="show" :closeable="false" cancel-text="取消" get-container="body">
      <!-- 一级反馈 -->
      <div v-if="isFirst">
        <van-cell class="center-title" clickable :title="item.name" v-for="item in actions" :key="item.name"
          @click="onCellClick(item.name)"></van-cell>
      </div>
      <!-- 二级反馈 -->
      <div v-else>
        <van-cell title="返回" clickable class="center-title" @click="isFirst = true"></van-cell>
        <van-cell :title="item.label" clickable class="center-title" v-for="item in reports" :key="item.type"
          @click="reportArticle(item.type)">
        </van-cell>
      </div>
    </van-action-sheet>

  </div>
</template>

<script>
import reports from '@/api/reports'
import { dislikeArticleAPI, reportsArticleAPI } from '@/api/homeAPI.js'

export default {
  name: 'ArtItem',
  props: {
    // 文章的信息对象
    article: {
      type: Object,
      required: true
    },
    // 是否展示关闭按钮
    closable: {
      type: Boolean,
      // 默认值为 true，表示展示关闭按钮
      default: true
    }
  },
  computed: {
    artId () {
      return this.article.art_id.toString()
    }
  },
  data () {
    return {
      // 是否展示反馈面板
      show: false,
      actions: [
        { name: '不感兴趣' },
        { name: '反馈垃圾内容' },
        { name: '拉黑作者' }
      ],
      // 是否展示第一个反馈面板
      isFirst: true,
      reports
    }
  },
  methods: {
    async onCellClick (name) {
      if (name === '不感兴趣') {
        this.show = false
        try {
          const { data: res } = await dislikeArticleAPI(this.artId)
          if (res.message === 'OK') {
            // TODO：炸楼的操作，触发自定义的事件，将文章 id 发送给父组件
            this.$emit('remove-article', this.artId)
          }
        } catch (err) {
          if (err.response.data.message === '用户未认证') {
            this.$emit('remove-article', this.artId)
          }
        }
      } else if (name === '拉黑作者') {
        this.show = false
      } else if (name === '反馈垃圾内容') {
        // 开启二级面板
        this.isFirst = false
      }
    },
    // 举报文章
    async reportArticle (type) {
      try {
        const { data: res } = await reportsArticleAPI(this.artId, type)
        if (res.message === 'OK') {
          this.$emit('remove-article', this.artId)
          this.show = false
        }
      } catch (err) {
        if (err.response.data.message === 'OK') {
          this.$emit('remove-article', this.artId)
          this.show = false
        }
      } finally {
        this.$emit('remove-article', this.artId)
        this.show = false
      }
    }
  }

}
</script>

<style lang="less" scoped>
.artitem-container {
  margin-bottom: 4px;
}

.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.thumb {
  // 矩形黄金比例：0.618
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.thumb-box {
  display: flex;
  justify-content: space-between;
}

.center-title {
  text-align: center;
}
</style>
