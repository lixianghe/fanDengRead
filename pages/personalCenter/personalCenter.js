import {validationAuthorize, testNew} from '../../utils/httpOpt/api'
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
  // login () {
  //   wx.login({      // 1
  //     success(res) {

  //       wx.getSetting({     // 2
  //         success (res1){
  //           if (res1.authSetting['scope.userInfo']) {

  //             wx.getUserInfo({   // 3
  //               success(user) {    
  //                 // 进行微信权限验证
  //                 let params = {
  //                   code: res.code,
  //                   sessionId: '',
  //                   rawData: user.rawData,
  //                   signature: user.signature,
  //                   type: 'wecar',
  //                   encryptedData: user.encryptedData,
  //                   iv: user.iv
  //                 }
  //                 console.log(params)
  //                 validationAuthorize(params).then(auth => {
  //                   console.log(JSON.stringify(auth)+'进行微信权限验证--成功回调')
  //                 }).catch(err => {
  //                   console.log(JSON.stringify(err)+'进行微信权限验证--错误回调')
  //                 })
  //               },
  //               fail(fail) {
  //                 console.log(fail)
  //               }
  //             })
  //           }
  //         },
  //         fail (err) {
  //           console.log(err)
  //         }
  //       })
  //     },
  //     fail(err) {
  //       console.log(err)
  //     }
  //   })
  // },

  // login () {
  //   wx.login({      // 1
  //     success(res) {

  //       wx.getSetting({     // 2
  //         success (res1){
  //           if (res1.authSetting['scope.userInfo']) {

  //             wx.getUserInfo({   // 3
  //               success(user) {    
  //                 // 进行微信权限验证
  //                 let params = {
  //                   code: res.code,
  //                   sessionId: 'as',
  //                   rawData: 'asda',
  //                   signature: 'ss',
  //                   type: 'ss',
  //                   encryptedData: 'asd',
  //                   iv: 'fds'
  //                 }
  //                 console.log(params)
  //                 validationAuthorize(params).then(auth => {
  //                   console.log(JSON.stringify(auth)+'进行微信权限验证--成功回调')
  //                   // let params2 = {
  //                   //   sessionId: auth.sessionId,
  //                   //   rawData: user.rawData,
  //                   //   signature: user.signature,
  //                   // }
  //                   // testNew(params2).then(auth2 => {
  //                   //   console.log(JSON.stringify(auth2)+'进行微信权限验证--成功回调1111')
  //                   // }).catch(err => {
  //                   //   console.log(JSON.stringify(err)+'进行微信权限验证--错误回调1111')
  //                   // })

  //                 }).catch(err => {
  //                   console.log(JSON.stringify(err)+'进行微信权限验证--错误回调')
  //                 })
  //               },
  //               fail(fail) {
  //                 console.log(fail)
  //               }
  //             })
  //           }
  //         },
  //         fail (err) {
  //           console.log(err)
  //         }
  //       })
  //     },
  //     fail(err) {
  //       console.log(err)
  //     }
  //   })
  // },


  // login() {
  //   wx.login({      // 1
  //     success(res) {
  //       validationAuthorize({code: res.code}).then(auth => {
  //         console.log(JSON.stringify(auth)+'进行微信权限验证--成功回调')
          
  //         wx.getSetting({   
  //           success(res1) {  
  //             if (res1.authSetting['scope.userInfo']) {
  //               wx.getUserInfo({ 
  //                 success(user) {    
  //                   //                 // 进行微信权限验证
  //                     let params = {
  //                       sessionId: auth.sessionId,
  //                       rawData: user.rawData,
  //                       signature: user.signature,
  //                       type: 'wecar',
  //                       encryptedData: user.encryptedData,
  //                       iv: user.iv
  //                     }
  //                     console.log(params)
  //                     testNew(params).then(auth => {
  //                       console.log(JSON.stringify(auth)+'进行微信权限验证--成功回调')
  //                     }).catch(err => {
  //                       console.log(JSON.stringify(err)+'进行微信权限验证--错误回调')
  //                     })
  //                   },
  //                   fail(fail) {
  //                     console.log(fail)
  //                   }
      
  //                 })
  //             }
  //            }
  //           })
         
          



  //       }).catch(err => {
  //         console.log(JSON.stringify(err)+'进行微信权限验证--错误回调')
  //       })
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