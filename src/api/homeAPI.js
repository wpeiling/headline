import request from '@/utils/request'

// 请求用户频道列表数据的 API
export const getUserChannelAPI = () => {
  return request.get('/v1_0/user/channels')
}

// 根据频道 Id 请求频道下的文章列表数据
export const getArtListAPI = (id, time) => {
  return request.get('/v1_0/articles', {
    params: {
      channel_id: id,
      timestamp: time
    }
  })
}

// 设置文章不喜欢
export const dislikeArticleAPI = (id) => {
  return request.post('/v1_0/article/dislikes', {
    target: id
  })
}

// 举报文章
export const reportsArticleAPI = (id, type) => {
  return request.post('/v1_0/article/reports', {
    target: id,
    type
  })
}

// 获取所有频道列表
export const getAllchannelAPI = () => {
  return request.get('/v1_0/channels')
}

// 更新用户频道列表数据
export const updateUserChannelAPI = channels => {
  return request.put('/v1_0/user/channels', {
    channels
  })
}

// 获取搜索结果
export const getSuggestListAPI = kw => {
  return request.get('/v1_0/search', {
    params: {
      q: kw
    }
  })
}
