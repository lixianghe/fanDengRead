// import {getData} from '../../utils/httpOpt/http'
// const { getData } = require('../../utils/https')

const app = getApp()
import btnConfig from '../../utils/pageOtpions/pageOtpions'
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
    mainColor: btnConfig.colorOptions.mainColor
  },
  // login () {
  //   wx.login({
  //     success(res) {
  //       console.log('微信code: '+JSON.stringify(res.code))
  //       wx.getSystemInfo({
  //         success(dev) {
  //           console.log('型号'+JSON.stringify(dev))
  //         },
  //         fail() {

  //         }
  //       })
  //       wx.getUserInfo({
  //         success(user) {
  //           console.log(user)
  //           console.log('rawData: '+JSON.stringify(user.rawData))
  //           console.log('encryptedData: '+JSON.stringify(user.encryptedData))
  //           console.log('iv: '+JSON.stringify(user.iv))
  //           console.log('signature: '+JSON.stringify(user.signature))
  //           console.log('getUserInfo全部信息: '+JSON.stringify(user))
  //         },
  //         fail(fail) {
  //           console.log(fail)
  //         }
  //       })
  //     },
  //     fail(err) {
  //       console.log(err)
  //     }
  //   })
  // },
  onLoad(options) {
  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  }
})