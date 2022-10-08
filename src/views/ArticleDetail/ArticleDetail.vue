<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />

    <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{article.title}}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="article.aut_name" :label="article.pubdate | dateFormate">
        <template #icon>
          <!-- 头像 -->
          <img alt="" :src="article.aut_photo" class="avatar">
        </template>
        <template #default>
          <div>
            <!-- 是否关注了作者 -->
            <van-button type="info" size="mini" v-if="article.is_followed" @click="setUnfollow">已关注</van-button>
            <van-button icon="plus" type="info" size="mini" plain v-else @click="setFollow">关注</van-button>
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="article.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>
      <!-- 点赞 -->
      <div class="like-box">
        <van-button icon="good-job" type="danger" size="small" v-if="article.attitude === 1" @click="setDislike">已点赞
        </van-button>
        <van-button icon="good-job-o" type="danger" plain size="small" v-else @click="setLike">点赞</van-button>
      </div>
    </div>

    <!-- 评论 -->
    <art-cmt :art-id="id"></art-cmt>
  </div>
</template>

<script>
import { getArticleDetailAPI, followUserAPI, unfollowUserAPI, addLikeAPI, delLikeAPI } from '@/api/articleAPI'
import ArtCmt from '@/components/ArtCmt/ArtCmt.vue'
export default {
  name: 'ArticleDetail',
  props: ['id'],
  components: {
    ArtCmt
  },
  data () {
    return {
      article: ''
    }
  },
  created () {
    this.initArticle()
  },
  methods: {
    async initArticle () {
      const { data: res } = await getArticleDetailAPI(this.id)
      if (res.message === 'OK') {
        this.article = res.data
      }
    },
    // 关注作者
    async setFollow () {
      try {
        const { data: res } = await followUserAPI(this.article.aut_id.toString())
        console.log(res)
        if (res.message === 'OK') {
          console.log('111')
          this.$toast('关注用户成功')
          this.article.is_followed = true
        }
      } catch (err) {
        if (err.response.data.message === 'token超时或者未传token') {
          this.$toast('关注用户成功')
          this.article.is_followed = true
        }
      }
    },
    // 取关作者
    async setUnfollow () {
      const res = await unfollowUserAPI(this.article.aut_id.toString())
      if (res.status === 204) {
        this.$toast.success('取关成功！')
        this.article.is_followed = false
      }
    },
    // 文章点赞
    async setLike () {
      try {
        const { data: res } = await addLikeAPI(this.id)
        if (res.message === 'OK') {
          this.$toast.success('点赞成功！')
          this.article.attitude = 1
        }
      } catch (err) {
        if (err.response.data.message === '用户未认证') {
          this.$toast.success('点赞成功！')
          this.article.attitude = 1
        }
      }
    },
    // 取消点赞
    async setDislike () {
      try {
        const res = await delLikeAPI(this.id)
        if (res.status === 204) {
          this.$toast.success('取消点赞成功！')
          this.article.attitude = -1
        }
      } catch (err) {
        if (err.response.data.message === '用户未认证') {
          this.$toast.success('取消点赞成功！')
          this.article.attitude = -1
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-container {
  padding: 10px;
  margin-top: 46px;
}

.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
}

.van-cell {
  padding: 5px 0;

  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
</style>
