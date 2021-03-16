
import btnConfig from '../../utils/pageOtpions/pageOtpions'
const app = getApp()
Page({
  mixins: [require('../../developerHandle/personalCenter')],
  data: {
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    screen: app.globalData.screen,
    avatar: '',
    userName: '',
    withCredentials: true,
    // userInfo: null,
    debugLog: '',
    songInfo: {},
    mainColor: btnConfig.colorOptions.mainColor,
    showNonet: false,
  },
  agreement() {
    wx.navigateTo({
      url: '../userAgree/userAgree'
    })
  },
  onLoad(options) {
    // 检测网络
    // let that = this
    // app.getNetWork(that)
  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  },
  imgError() {
    this.setData({
      'userInfo.avatar': 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2719292398,3645159946&fm=26&gp=0.jpg'
    })
  }
})