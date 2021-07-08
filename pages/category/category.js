import { layoutGroup, bookCategory, freeBook } from '../../utils/httpOpt/api'
import tool from '../../utils/util'
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
    lowerThreshold: 500,
    id: 0
  },
  async onLoad(options) {
    let params = { page: 1, pageSize: 10, categoryId: options.hasOwnProperty('groupId') ? options.groupId : 0 }
    pageNo = 1
    await this.voicePath(options)
    this._getList(params, bookCategory)
  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
    this.selectComponent('#miniPlayer').watchPlay()
    // 卡片组件onshow
    setTimeout(() => {
      let playing = wx.getStorageSync("playing");
      if (playing) {
        let playingId = wx.getStorageSync('songInfo').id
        this.story = this.selectComponent(`#story${playingId}`)
        if (this.story) {
          this.story._onshow()
        }
      }
    }, 600);
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
    console.log(this.story)
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
  },

  _getList(params, api, scrollLoad = false) {
    
    // 给tab赋值
    let categoryLabels = wx.getStorageSync('categoryLabels')
    this.setData({
      'labels.data': categoryLabels
    })
    // 如果是近期新书
    if (params.categoryId == 0) {
      let data = wx.getStorageSync('recentNewBooks')
      data.map(v => {
        // v.id = v.fragmentId
        v.src = v.coverImage
        v.title = v.title,
        v.count = v.readCount
        v.id2 = v.id
        for(let n of v.contents) {
          if (n.type == 2) {
            v.id = n.fragmentId
            return
          }
        }
      })
      this.setData({
        info: data,
        totalCount: data.length 
      }, () => {
        // 卡片组件onshow
        setTimeout(() => {
          let playing = wx.getStorageSync("playing");
          if (playing) {
            let playingId = wx.getStorageSync('songInfo').id
            this.story = this.selectComponent(`#story${playingId}`)
            if (this.story) {
              this.story._onshow()
            }
          }
        }, 600);
      })
      wx.hideLoading()
      return
    }
    api(params).then((res) => {
      let data = res.books
      data.map(v => {
        v.id2 = v.id
        v.src = v.imageUrl
        v.title = v.title,
        v.count = v.readCount
        for(let n of v.contents) {
          if (n.type == 2) {
            v.id = n.fragmentId
            return
          }
        }
      })
      this.setData({
        info: !scrollLoad ? data : this.data.info.concat(data),
        totalCount: res.totalCount
      }, () => {
        if (res.totalCount <= 10) this.setData({lowerThreshold: 50})
      // 卡片组件onshow
      setTimeout(() => {
        let playing = wx.getStorageSync("playing");
        if (playing) {
          console.log('333333333333333333');
          let playingId = wx.getStorageSync('songInfo').id
          this.story = this.selectComponent(`#story${playingId}`)
          if (this.story) {
            this.story._onshow()
          }
        }
      }, 600);
      })
      wx.hideLoading()
    }).catch(err =>{
      // this.setData({
      //   info: [],
      //   totalCount: 0
      // })
      wx.hideLoading()
    })
  },
  bindscrolltolower(e) {
    let maxPageNo = Math.ceil(this.data.totalCount / 10)
    pageNo++
    if (pageNo == maxPageNo) this.setData({lowerThreshold: 50})
    if (pageNo > maxPageNo) {
      // wx.showToast({
      //   title: '已经到底了',
      //   icon: 'none'
      // })
      return
    } 
    let params = {
      page: pageNo,
      pageSize: 10,
      categoryId: this.data.id
    }
    console.log(params)
    if (params.categoryId != 0) this._getList(params, bookCategory, true)
  },
  // 跳转到播放详情界面
  linkAbumInfo(e) {
    // 如果没有网
    tool.noNet(this.linkDo, e)
  },
  linkDo(e) {
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
  },
  // 语音直达功能
  async voicePath(options){
    if (options.hasOwnProperty('groupId')) {
      try {
        let res = await layoutGroup()
        const { categories, recentNewBooks: { categoryBooks } } = res
        let categoryLabels = [
          { "name": "近期新书", "id": '0' }, { "name": "免费体验", "id": 'freeBooks' },
          ...categories.map(item => { return { name: item.name, id: item.id } }) || []
        ]
        let currentTap = categoryLabels.findIndex(item => item.id == options.groupId)
        if (currentTap > -1) {
          this.setData({
            currentTap,
            id: options.groupId
          })
        }
        wx.setStorageSync('recentNewBooks', categoryBooks)
        wx.setStorageSync('categoryLabels', categoryLabels)
      } catch (error) {
        let { data } = error
        if (!data) {
          this.setData({
            showNonet: true
          })
          return
        }
        wx.showToast({ icon: 'none', title: '接口请求错误请稍后重试' })
      }
    }
  }
})