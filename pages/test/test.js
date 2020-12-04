const app = getApp()


Page({
  data: {
    noDataImg: ''
  },
  audioManager: null,
  ctx: null,
  onReady() {},
  async onLoad(options) {

  },
  onShow() {

  },
  onHide() {

  },

  // 获取网络信息，给出相应操作
  getNetWork(title, cb) {
    const that = this
    // 监听网络状态
    wx.getNetworkType({
      async success(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          that.setData({
            msg: title,
          })
          that.bgConfirm = that.selectComponent('#bgConfirm')
          that.bgConfirm.hideShow(true, 'out', () => {})
        } else {
          setTimeout(() => {
            cb && cb()
          }, 200)
        }
      },
    })
  }
})
