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
    shape: 'rect',
    outPush: false
  },
  onLoad(options) {
    const app = getApp()
    // if(options.isCard){}
    // 进入详情先赋值部分字段
    // 拿到歌曲的id: options.id
    // options.fragmentId = 3245
    if (options.fragmentId) {
      this.data.playInfoBtns.splice(this.data.playInfoBtns.length - 1, 1)
      this.setData({
        playInfoBtns: this.data.playInfoBtns,
        outPush: true,
        playing:true
      })
      options.id = options.fragmentId
      app.globalData.songInfo = {}
    }
  },
  async getMedia(params, that = this) {  
    const app = getApp()
    // 模拟请求数据  
    try {
      let info = await albumMedia(params)
      let findUrl = app.globalData.cardList.findIndex(item=>item.bookId == info.data.bookId) !=-1
      let songInfo = Object.assign({}, that.data.songInfo)
      if(app.globalData.cardList.length && findUrl){
        songInfo.src = app.globalData.cardList.find(item=>item.bookId == info.data.bookId).dataUrl
        info.data.titleImageUrl = app.globalData.cardList.find(item=>item.bookId == info.data.bookId).coverImgUrl
      }else{
        songInfo.src = info.data.mediaUrls[0]                                  // 音频地址
      }
      songInfo.bookId =  info.data.bookId
      songInfo.title = info.data.title                                       // 音频名称
      songInfo.id = info.data.fragmentId                                     // 音频Id
      songInfo.dt = info.data.trial ? tool.formatduration(info.data.trialDuration, 'second') : tool.formatduration(info.data.duration, 'second')        // 音频时常
      if (this.data && this.data.outPush) {
        songInfo.coverImgUrl = info.data.titleImageUrl
        that.setData({ playing: true })
      }                          // 音频封面
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
      }).catch(err => {
      })
    } catch (error) {
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
      }).catch(err=>{
        wx.showToast({ icon: 'none', title: '取消收藏失败，请稍后重试' })
      })
    } else {
      albumFavoriteAdd(params).then(res => {
        wx.showToast({ icon: 'none', title: '收藏成功' })
        that.setData({
          'songInfo.existed': true
        })
        app.globalData.songInfo.existed = true
        wx.setStorageSync('songInfo', app.globalData.songInfo)
      }).catch(err=>{
        wx.showToast({ icon: 'none', title: '收藏失败，请稍后重试' })
      })
    }
  },
  linkLogin() {
    const app = getApp()
    let url = '/pages/personalCenter/personalCenter'
    app.globalData.isRecharge = true
    wx.switchTab({
      url: url,
    })
  },
  // 断点续播
  async continuationPlay(){
    const app = getApp()
    let res = wx.getPlayInfoSync()
    // let res = {
    //   playList: [
    //     {
    //       title: "谁说商业直觉是天生的",
    //       singer:'',
    //       coverImgUrl:
    //         "https://cdn-ali-images.dushu365.com/1622183456fc20739490f95cfaee34912f6d0636e10is44b",
    //       dataUrl:
    //         "https://cdn-azure-dest.dushu365.com/media/audio/1596706811848960c9f9bf8c0787799fe93e6e6c33m4tvku.mp3",
    //       options:
    //         '{"id":901,"src":"https://cdn-ali-images.dushu365.com/1622183456fc20739490f95cfaee34912f6d0636e10is44b","title":"谁说商业直觉是天生的","count":5274109,"id2":173}',
    //     },
    //     {
    //       title: "基因革命",
    //       singer:'',
    //       coverImgUrl:
    //         "https://cdn-azure-images.dushu365.com/157708840420d756d45a863471f5f084efcf65a4f44bzkiw",
    //       dataUrl:
    //         "https://cdn-azure-dest.dushu365.com/media/audio/15828100992b2fcf9dff616fef071050f184004c8bpi2tzi.mp3",
    //       options:
    //         '{"id":549,"src":"https://cdn-ali-images.dushu365.com/157708840420d756d45a863471f5f084efcf65a4f44bzkiw","title":"基因革命","count":4533530,"id2":182}',
    //     },
    //     {
    //       title: "宽恕",
    //       singer:'',
    //       coverImgUrl:
    //         "https://cdn-azure-images.dushu365.com/1622439809e9a958f541395418ac4d29ac85b7c6efeumvod",
    //       dataUrl:
    //         "https://cdn-azure-dest.dushu365.com/media/audio/158286170312a1f7199597f6b3acb30abad15eef13u2tcqj.mp3",
    //       options:
    //         '{"id":1846,"src":"https://cdn-ali-images.dushu365.com/1622439809e9a958f541395418ac4d29ac85b7c6efeumvod","title":"宽恕","count":6849476,"id2":339}',
    //     },
    //     {
    //       title: "你就是孩子最好的玩具",
    //       singer:'',
    //       coverImgUrl:
    //         "https://cdn-azure-images.dushu365.com/16214098386b6f068e20387ff0154ad74689836300m2klj7",
    //       dataUrl:
    //         "https://cdn-azure-dest.dushu365.com/media/audio/1582861715160ae571cd4be5e4d82d77cb34a4d505ipbe4z.mp3",
    //       options:
    //         '{"id":6,"src":"https://cdn-ali-images.dushu365.com/16214098386b6f068e20387ff0154ad74689836300m2klj7","title":"你就是孩子最好的玩具","count":33257087,"id2":19}',
    //     },
    //     {
    //       title: "让大象飞",
    //       singer:'',
    //       coverImgUrl:
    //         "https://cdn-azure-images.dushu365.com/1622519044083539b11d9b0520787b6a7eb9d97a00pky8uv",
    //       dataUrl:
    //         "https://cdn-azure-dest.dushu365.com/media/audio/15828109286b9608995c3e82a3c881009fcfd6c85a9np74c.mp3",
    //       options:
    //         '{"id":2903,"src":"https://cdn-ali-images.dushu365.com/1622519044083539b11d9b0520787b6a7eb9d97a00pky8uv","title":"让大象飞","count":11023797,"id2":373}',
    //     },
    //     {
    //       title: "养育女孩",
    //       singer:'',
    //       coverImgUrl:
    //         "https://cdn-azure-images.dushu365.com/1624863317d028c749e1b83df2ba2768abf9455c94o5x93b",
    //       dataUrl:
    //         "https://cdn-upyun-dest.dushu365.com/media/audio/1568096967cd78402f4e3d9cb390420aca3c08a68ad7ysf4.mp3",
    //       options:
    //         '{"id":1285,"src":"https://cdn-ali-images.dushu365.com/1624863317d028c749e1b83df2ba2768abf9455c94o5x93b","title":"养育女孩","count":16030782,"id2":320}',
    //     },
    //   ],
    //   playState: {
    //     status: 1,
    //     curIndex: 3,
    //     currentPosition: 360,
    //     duration: 859,
    //   },
    // };
    let playing = res.playState && res.playState.status == 1 ? true : false
    if(res.playList && res.playList.length){
      try {
        let contextList = res.playList.map(item=>JSON.parse(item.options))
        let {currentPosition,duration} = res.playState
        let {src,id} = contextList[res.playState.curIndex]
        wx.setStorageSync('bookIdList',contextList.map(item=>item.id2) ||[])
        // app.globalData.bookIdList = contextList.map(item=>item.id2) ||[]
        wx.setStorageSync('nativeList',contextList)
        wx.setStorageSync('allList',contextList)
        wx.setStorageSync('playing', playing)
        app.globalData.cardList = res.playList.map((item,index)=>{
          return{
            bookId: contextList[index].id2,
            coverImgUrl:item.coverImgUrl,
            dataUrl:item.dataUrl,
            title:item.title,
          }
        })
        wx.setStorageSync('urls',app.globalData.cardList)
        await this.getMedia({fragmentId:id}, this)
        app.globalData.percent = tool.floatMul(tool.floatDiv(currentPosition,duration).toFixed(4), 100);
        app.globalData.currentPosition = currentPosition
        app.globalData.playtime = currentPosition ? tool.formatduration(currentPosition * 1000) : '00:00',
        tool.initAudioManager(app, this,currentPosition)
        let song= wx.getStorageSync('songInfo')
        let songInfo = Object.assign(song,{coverImgUrl:src})
        this.setData({
          songInfo,
          playing: playing,
          playtime: currentPosition ? tool.formatduration(currentPosition * 1000) : '00:00',
          percent: app.globalData.percent || 0
        })
        app.globalData.songInfo = songInfo
        wx.setStorageSync('songInfo',songInfo)
      } catch (error) {
        wx.showToast({ icon: 'none', title: '接口请求错误请稍后重试' })
      }
    }else{
      wx.setStorageSync('songInfo', {})
    }
  }
}