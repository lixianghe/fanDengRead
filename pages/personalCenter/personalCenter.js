
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

  onLoad(options) {
    // 检测网络
    let that = this
    app.getNetWork(that)
  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  }
})