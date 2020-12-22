import { layout, layoutGroup } from '../../utils/httpOpt/api'
const app = getApp()

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
    scrollLeft: 0
  },
  onLoad(options) {
    // 检测网络
    let that = this
    app.getNetWork(that)
    this._getList()
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
    const index = e.currentTarget.dataset.index
    this.setData({
      currentTap: index
    })
    // 清空上一首播放态
    let playingId = wx.getStorageSync('songInfo').id
    this.story = this.selectComponent(`#story${playingId}`)
    if (this.story) {
      this.story.clearPlay()
    }
    // 这里可以自定义传值传到_getList中
    this.setData({
      info: this.data.allData[index],
      scrollLeft: 0
    })

    

    this.story = this.selectComponent(`#story${playingId}`)
    if (this.story) {
      this.story._onshow()
    }
  },

  _getList() {
    wx.showLoading({
      title: '加载中',
    })
    layoutGroup({}).then((res) => {
      let labels = [
        {
          "name": "近期新书",
          "id": 'recentNewBooks'
        }, {
          "name": "免费体验",
          "id": 'freeBooks'
        }
      ]
      console.log(res)
      let allData = []
      res.freeBooks = {categoryBooks: res.freeBooks}
      let data = [res.recentNewBooks, res.freeBooks, ...res.categories]
      for (let n of res.categories) {
        labels.push({name: n.name, id: n.id})
      }
      for (let n of data) {
        n.categoryBooks.map(v => {
          v.id = v.fragmentId
          v.src = v.coverImage
          v.title = v.title,
          v.count = v.readCount
        })
        allData.push(n.categoryBooks)
      }
      this.setData({
        'labels.data': labels,
        allData: allData,
        info: allData[0]
      }, () => {
        let playingId = wx.getStorageSync('songInfo').id
        this.story = this.selectComponent(`#story${playingId}`)
        if (this.story) {
          this.story._onshow()
        }
      })
      wx.hideLoading()
    }).catch(err =>{
      this.setData({
        allData: [],
        info: []
      })
      wx.hideLoading()
    })
  },
  bindscrolltolower(e) {
    wx.showToast({
      title: '已经到底了！',
      icon: 'none'
    })
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