const app = getApp()

Component({
  data: {
    noDataImg: '../../images/asset/img_zanwushuju.png'
  },
  methods: {
    linkHome() {
      wx.navigateBack()
    }
  },
  attached(options) {
  }
})