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
    const app = getApp()
    // 拿到歌曲的id: options.id
    let getInfoParams = {fragmentId: options.id || app.globalData.songInfo.id}
    this.getMedia(getInfoParams).then(() => {
      console.log('play')
      this.play() 
    })
  },
  async getMedia(params, that = this) {  
    const app = getApp()
    // 模拟请求数据  
    let data = (await albumMedia(params)).data
    let songInfo = {}
    songInfo.src = data.mediaUrls[0]                                  // 音频地址
    songInfo.title = data.title                                       // 音频名称
    songInfo.id = data.fragmentId                                     // 音频Id
    songInfo.dt = tool.formatduration(data.duration, 'second')        // 音频时常
    songInfo.coverImgUrl = data.titleImageUrl                // 音频封面
    songInfo.existed = data.isFavorite
    app.globalData.songInfo = Object.assign({}, songInfo)
    that.setData({ songInfo: songInfo, existed: data.isFavorite })
    wx.setStorageSync('songInfo', songInfo)
    // 添加播放历史
    let opt = {
      fragmentType: '2',
      finished: 0,
      fragmentId: data.fragmentId,
      duration: data.duration
    }
    saveHistory(opt).then(res => {
      console.log('addHistory' + JSON.stringify(res))
    }).catch((err) =>{
      console.log('erraddHistory' + JSON.stringify(err))
    })  
  },
  // 收藏和取消收藏,playInfo和minibar用到这里
  like(that = this) {
    const app = getApp()
    let params = {
      appId: "2001",
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
    if (that.data.existed) {
      albumFavoriteCancel(params).then(res => {
        wx.showToast({ icon: 'none', title: '取消收藏成功' })
        that.setData({
          existed: false
        })
      })
    } else {
      albumFavoriteAdd(params).then(res => {
        wx.showToast({ icon: 'none', title: '收藏成功' })
        that.setData({
          existed: true
        })
      })
    }
  }
}