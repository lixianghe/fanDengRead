import { layout, bookCategory, freeBook } from '../../utils/httpOpt/api'
const app = getApp()
let pageNo = 1
Page({
  data: {
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    screen: app.globalData.screen,
    mainColor: app.globalData.mainColor,
    confirm: '',
    currentTap: 0,
    scrollLeft: 0,
    isFixed: false,
    // 开发者注入模板页面数据
    info: [],
    // 开发者注入模板标签数据
    labels: {
      show: true,
      data: []
    },
    allData: {
      suggest:[],
      freeBooks: [],
      recentNewBooks: []
    },
    // 封面图片形状 rect矩形，square，正方形
    shape: 'rect',
    // 数量图片
    countPic: '/images/asset/erji.png',
    // 播放图片
    playPic: '/images/asset/playing.png',
    // 频道列表，内容列表数据标志变量
    reqS: true,
    reqL: false,
    showNonet: false,
    scrollLeft: 0,
    lowerThreshold: 500
  },
  onLoad(options) {
    pageNo = 1
    // 检测网络
    let that = this
    app.getNetWork(that)
    // 默认近期新书
    let params = {
      page: 1,
      pageSize: 10,
      categoryId: 0
    }
    this._getList(params, bookCategory)
  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
    this.selectComponent('#miniPlayer').watchPlay()

    // 卡片组件onshow
    let playingId = wx.getStorageSync('songInfo').id
    this.story = this.selectComponent(`#story${playingId}`)
    if (this.story) {
      this.story._onshow()
    }
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()

    // 清空上一首播放态
    let playingId = wx.getStorageSync('songInfo').id
    this.story = this.selectComponent(`#story${playingId}`)
    if (this.story) {
      this.story.clearPlay()
    }
  },
  selectTap(e) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({lowerThreshold: 500})
    pageNo = 1
    const index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.groupid
    this.setData({
      currentTap: index,
      id: id
    })
    // 清空上一首播放态
    let playingId = wx.getStorageSync('songInfo').id
    this.story = this.selectComponent(`#story${playingId}`)
    if (this.story) {
      this.story.clearPlay()
    }
    // 这里可以自定义传值传到_getList中
    if (id == "freeBooks") {
      this._getList({ page: 1, pageSize: 100,}, freeBook)
    } else {
      let params = {
        page: 1,
        pageSize: 10,
        categoryId: id
      }
      this._getList(params, bookCategory)
    }
    this.setData({
      scrollLeft: 0
    })
    this.story = this.selectComponent(`#story${playingId}`)
    if (this.story) {
      this.story._onshow()
    }
  },

  _getList(params, api, scrollLoad = false) {
    
    // 给tab赋值
    let categoryLabels = wx.getStorageSync('categoryLabels')
    this.setData({
      'labels.data': categoryLabels
    })
    api(params).then((res) => {
      let data = res.books
      data.map(v => {
        v.id = v.id
        v.src = v.imageUrl
        v.title = v.title,
        v.count = v.readCount
      })
      this.setData({
        info: !scrollLoad ? data : this.data.info.concat(data),
        totalCount: res.totalCount
      }, () => {
        if (res.totalCount <= 10) this.setData({lowerThreshold: 50})
        let playingId = wx.getStorageSync('songInfo').id
        this.story = this.selectComponent(`#story${playingId}`)
        if (this.story) {
          this.story._onshow()
        }
      })
      wx.hideLoading()
    }).catch(err =>{
      this.setData({
        info: [],
        totalCount: 0
      })
      wx.hideLoading()
    })
  },
  bindscrolltolower(e) {
    let maxPageNo = Math.ceil(this.data.totalCount / 10)
    pageNo++
    if (pageNo == maxPageNo) this.setData({lowerThreshold: 50})
    if (pageNo > maxPageNo) {
      wx.showToast({
        title: '已经到底了！',
        icon: 'none'
      })
      return
    } 
    let params = {
      page: pageNo,
      pageSize: 10,
      categoryId: this.data.id
    }
    this._getList(params, bookCategory, true)
  },
  // 跳转到播放详情界面
  linkAbumInfo(e) {
    let id = e.currentTarget.dataset.id
    const src = e.currentTarget.dataset.src
    const title = e.currentTarget.dataset.title
    wx.setStorageSync('img', src)

    if (!app.globalData.latelyListenId.includes(id)) {
      app.globalData.latelyListenId.push(id)
    }
    wx.setStorageSync('allList', this.data.info)
    let url = `../playInfo/playInfo?id=${id}&title=${title}&src=${src}`
    wx.navigateTo({
      url: url
    })
  }
})