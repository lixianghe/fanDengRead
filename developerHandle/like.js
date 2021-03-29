/**
 * @name: like
 * 开发者编写的最近收听like,配置（labels）的类型，通过切换（selectTap）获取不同类型列表
 * 这里开发者必须提供的字段数据(数据格式见听服务小场景模板开发说明文档)：
 * labels: {
 *     show: true,
 *     data: [{
 *       name: '专辑',
 *       value: 'album'
 *     },
 *     {
 *       name: '故事',
 *       value: 'media'
 *     }],
 *   },
 *  可选内容，当show为false时不显示分类列表
 * 2、_getList函数，这里我们给开发者提供labels对应点击的的值，其余参数开发者自行添加；
 *    _getList函数获取的list最终转换为模板需要的字段，并setData给info。
 * 3、由于模板内的字段名称可能和后台提供不一样，在获取list后重新给模板内的字段赋值：如下以本页列表数据为例
 * list.map((item, index) => {
      item.title = item.mediaName                               // 歌曲名称
      item.id = item.mediaId                                    // 歌曲Id
      item.src = item.coverUrl                                  // 歌曲的封面
      item.contentType = 'album'                                // 类别（例如专辑或歌曲）
      item.isVip = true                                         // 是否是会员
    })
 * 4、likePic: ['/images/info_like.png', '/images/info_like_no.png'],
 * 收藏和取消收藏图片
 */
const app = getApp()
import { albumFavorite } from '../utils/httpOpt/api'
module.exports = {
  data: {
    info: [],
    showModal: false,
    req: false,
    likePic: ['/images/info_like.png', '/images/info_like_no.png'],
    // 播放图片
    playPic: '/images/asset/playing.png',
    labels: {
      show: false,
      data: [{
        name: '专辑',
        value: 'album'
      },
      {
        name: '故事',
        value: 'media'
      }],
    },
    shape: 'rect'
  },
  onShow() {
    // 卡片组件onshow
    let playingId = wx.getStorageSync('songInfo').id
    this.story = this.selectComponent(`#story${playingId}`)
    if (this.story) {
      this.story._onshow()
    }
    this._getList('专辑')
  },
  onLoad(options) {
    
  },
  onHide() {
    // 清空上一首播放态
    let playingId = wx.getStorageSync('songInfo').id
    this.story = this.selectComponent(`#story${playingId}`)
    if (this.story) {
      this.story.clearPlay()
    }
  },
  // 跳转到播放详情界面
  linkAbumInfo (e) {
    // 清空上一首播放态
    let playingId = wx.getStorageSync('songInfo').id
    this.story = this.selectComponent(`#story${playingId}`)
    if (this.story) {
      this.story.clearPlay()
    }

    let id = e.currentTarget.dataset.id
    const src = e.currentTarget.dataset.src
    const title = e.currentTarget.dataset.title
    wx.setStorageSync('img', src)

    wx.setStorageSync('allList', this.data.info)
    let url= `../playInfo/playInfo?id=${id}&title=${title}&src=${src}`
    
    wx.navigateTo({
      url: url
    })
  },
  selectTap(e) {
    const index = e.currentTarget.dataset.index
    const name = e.currentTarget.dataset.name
    this.setData({
      currentTap: index,
      retcode: 0
    })
    wx.showLoading({
      title: '加载中',
    })
    this._getList(name)
  },
  _getList(name) {
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      "appId": "2001",
      "id": 0,
      "token": "20201209DDG0nnhhpPjhXkNZTwa"
     }
    albumFavorite(params).then(res => {
      console.log(res)
      console.log('likelikelike')
      let info = res.data.books.map(v => {
        let obj = {}
        obj.id = v.fragmentId ? v.fragmentId : ''
        obj.src = v.coverUrl ? v.coverUrl : ''
        obj.title = v.bookName ? v.bookName : ''
        return obj
      })

      this.setData({
        req: true,
        info: info
      }, () => {
        let playingId = wx.getStorageSync('songInfo').id
        this.story = this.selectComponent(`#story${playingId}`)
        if (this.story) {
          this.story._onshow()
        }
      })
      if (info.length === 0) {
        this.setData({
          showModal: true
        })
      }

      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })

  },
  // 添加/取消收藏函数
  like (e) {
    console.log(e.detail.contentType)     //类型
    console.log(e.detail.flag)    		// 状态（添加/取消）
    console.log(e.detail.typeid)    		// 内容id
  },
  close() {
    this.setData({showModal: false})
  },

}