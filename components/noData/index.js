const app = getApp()

Component({
  data: {
    noDataImg: '../../images/asset/img_zanwushuju.png'
  },
  methods: {
    linkHome() {
      wx.switchTab({
        url: '/pages/index/index'
      })
      wx.setNavigationBarTitle({
        title: '推荐' 
      })
    }
  },
  attached(options) {
  }
})