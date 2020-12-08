import {validationAuthorize} from '../../utils/httpOpt/api'
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
    mainColor: btnConfig.colorOptions.mainColor
  },
  login () {
    wx.login({
      success(res) {
        console.log('微信code: '+JSON.stringify(res.code))
        wx.getUserInfo({
          success(user) {
            console.log(user)
            console.log('rawData: '+JSON.stringify(user.rawData))
            console.log('encryptedData: '+JSON.stringify(user.encryptedData))
            console.log('iv: '+JSON.stringify(user.iv))
            console.log('signature: '+JSON.stringify(user.signature))
            console.log('getUserInfo全部信息: '+JSON.stringify(user))

            // 进行微信权限验证
            let params = {
              code: res.code,
              sessionId: '',
              rawData: user.rawData,
              signature: user.signature,
              type: 'wecar',
              encryptedData: user.encryptedData,
              iv: user.iv
            }
            console.log(params)
            validationAuthorize(params).then(auth => {
              console.log(JSON.stringify(auth)+'进行微信权限验证--成功回调')
            }).catch(err => {
              console.log(JSON.stringify(err)+'进行微信权限验证--错误回调')
            })
          },
          fail(fail) {
            console.log(fail)
          }
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  onLoad(options) {
  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  }
})