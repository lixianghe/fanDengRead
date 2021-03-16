/**
 * @name: playInfo
 * 开发者编写的播放中,通过歌曲id获取歌曲的uel相关信息，id在onLoad的options.id取
 * 这里开发者需要：
 * 1、通过歌曲id获取歌曲详情，由于模板内的字段名称可能和后台提供不一样，在获取歌曲详情后重新给模板内的字段赋值：如下
 *  songInfo.src = data.mediaUrl                          // 音频地址
 *  songInfo.title = data.mediaName                       // 音频名称
 *  songInfo.id = params.mediaId                          // 音频Id
 *  songInfo.dt = data.timeText                           // 音频时常
 *  songInfo.coverImgUrl = data.coverUrl                  // 音频封面
 * 2、重新赋值后setData给songInfo，并且存在Storage缓存中
 * 3、赋值后执行this.play()来播放歌曲
 * 4、其他模板外的功能开发者在这个文件自行开发
 */
const app = getApp()
import { albumMedia, albumFavoriteAdd, albumFavoriteCancel, saveHistory } from '../utils/httpOpt/api'
import tool from '../utils/util'

module.exports = {
  data: {
    showModal: false,               // 控制弹框
    content: '该内容为会员付费内容，您需要先成为会员后再购买此内容就可以收听精品内容啦',
    // 播放详情页面按钮配置
    pictureWidth: 90,
    pictureHeight: 90,
    playInfoBtns: [
      {
        name: 'pre',                                             
        img: '/images/asset/icon_last_song_big.png',                                 
      },
      {
        name: 'toggle',                                          
        img: {
          stopUrl: '/images/asset/icon_pause_big.png' ,                         
          playUrl: '/images/asset/icon_play_big.png'                           
        }
      },
      {
        name: 'next',                                            
        img: '/images/asset/icon_next_song_big.png'                                 
      },
      {
        name: 'like',                                                       // 收藏
        img: {
          noLike: '/images/asset/icon_collect_big.png' ,                    // 未收藏的图标
          liked: '/images/asset/icon_collected_big.png'                     // 已收藏的图标
        }
      },
      {
        name: 'more',                                             
        img: '/images/asset/icon_play_list_big.png'                                  
      }
    ],
    // 封面图片形状 rect矩形，square，正方形
    shape: 'rect'
  },
  onLoad(options) {
    // 进入详情先赋值部分字段
    const app = getApp()
    // 拿到歌曲的id: options.id
    let getInfoParams = {fragmentId: options.id || app.globalData.songInfo.id}
    // console.log(options.id, app.globalData.songInfo.id)
    if (!options.id || options.id == app.globalData.songInfo.id) {
      this.noplay()
      return
    }
    this.getMedia(getInfoParams).then(() => {
      if (app.globalData.songInfo.src) this.play() 
    })
  },
  async getMedia(params, that = this) {  
    const app = getApp()
    // 模拟请求数据  
    try {
      
      let info = await albumMedia(params)
      let songInfo = Object.assign({}, that.data.songInfo)
      songInfo.src = info.data.mediaUrls[0]                                  // 音频地址
      // songInfo.title = info.data.title                                       // 音频名称
      songInfo.id = info.data.fragmentId                                     // 音频Id
      songInfo.dt = info.data.trial ? tool.formatduration(info.data.trialDuration, 'second') : tool.formatduration(info.data.duration, 'second')        // 音频时常
      // songInfo.coverImgUrl = info.data.titleImageUrl                          // 音频封面
      songInfo.existed = info.data.isFavorite
      songInfo.trial = info.data.trial
      songInfo.singer = info.data.bookAuthorName
      app.globalData.songInfo = Object.assign({}, songInfo)
      that.setData({ songInfo: songInfo })
      wx.setStorageSync('songInfo', songInfo)
      // 添加播放历史
      let isLogin = wx.getStorageSync('isLogin')
      if (!isLogin) return
      let isVip = wx.getStorageSync('isVip')
      let opt = {
        bookId: info.data.bookId,
        fragmentId: info.data.fragmentId,
        trial: !isVip,
        playHistoryType: 1
      }
      saveHistory(opt).then(res => {
        // console.log(res)
        // console.log('resresresresres')
      }).catch(err => {
        console.log(err)
        console.log('errerrerrerrerr')
      })
    } catch (error) {
      console.log('error', error)
      wx.hideLoading()
      app.audioManager.pause()
      app.globalData.songInfo.id = that.data.songInfo.id
      app.globalData.songInfo.src = null
      wx.showToast({ icon: 'none', title: '该书籍无法播放，请换本书籍吧~' })
      
    }
    
  },
  // 收藏和取消收藏,playInfo和minibar用到这里
  like(that = this) {
    const app = getApp()
    let params = {
      id: app.globalData.songInfo.id,
      sourceType: 1,
      resourceType: 1,
      fragmentId: app.globalData.songInfo.id
    }
    let isLogin = wx.getStorageSync('isLogin')
    if (!isLogin) {
      wx.showToast({ icon: 'none', title: '请登录后进行操作' })
      return;
    }
    if (that.data.songInfo.existed) {
      albumFavoriteCancel(params).then(res => {
        wx.showToast({ icon: 'none', title: '取消收藏成功' })
        that.setData({
          'songInfo.existed': false
        })
        app.globalData.songInfo.existed = false
        wx.setStorageSync('songInfo', app.globalData.songInfo)
      })
    } else {
      albumFavoriteAdd(params).then(res => {
        wx.showToast({ icon: 'none', title: '收藏成功' })
        that.setData({
          'songInfo.existed': true
        })
        app.globalData.songInfo.existed = true
        wx.setStorageSync('songInfo', app.globalData.songInfo)
      })
    }
  },
  linkLogin() {
    console.log('linkLogin')
    let url = '/pages/personalCenter/personalCenter'
    wx.switchTab({
      url: url
    })
  }
}