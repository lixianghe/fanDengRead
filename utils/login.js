import { albumMedia } from '../utils/httpOpt/api'
  
  /**
   * 登录
   */
  const app = getApp()
  import {
    validationAuthorize,
    createOrUpdateWeChatUser,
    authLogin,
    logout,
    userInfo
  } from '../utils/httpOpt/api'




  const {
    timestampToTime,
    isVipEnd
  } = require('./util')
  export const agree = function () {
    app.globalData.isAgree = !app.globalData.isAgree
    this.setData({
      isAgree: app.globalData.isAgree
    })
  }

  export const login = function () {
    // 先勾选协议
    if (!app.globalData.isAgree) {
      wx.showToast({
        title: '请同意服务协议',
        icon: 'none'
      })
      return
    } else {
      let that = this
      wx.login({ // 1
        success(res) {
          that.setData({
            taiLogin: true
          })
          wx.setStorageSync('taiLogin', true)
          validationAuthorize({
            code: res.code
          }).then(auth => {
            let newAuth = {
              openId: auth.data.openId,
              unionId: auth.data.unionId,
              sessionId: auth.data.sessionId
            }

            app.globalData.auth = newAuth
            wx.setStorageSync('auth', newAuth)
          }).catch(err => {
            console.log(JSON.stringify(err) + '进行微信权限验证--错误回调')
          })
        },
        fail(err) {
          console.log(err)
        }
      })
    }
  }
  export const getPhoneNumber = function (num) {
    console.log('==========电话号码')
    console.log(wx.getStorageSync('auth'))
    this.next(num)
  }
  export const next = function (num) {
    let that = this
    app.globalData.auth = wx.getStorageSync('auth')
    wx.getUserInfo({ // 3
      success(user) {
        // 创建用户信息验证
        let params = {
          sessionId: app.globalData.auth.sessionId,
          openId: app.globalData.auth.openId,
          unionId: app.globalData.auth.unionId,
          rawData: user.rawData,
          signature: user.signature,
          type: 'wecar',
          encryptedData: user.encryptedData,
          iv: user.iv,
          encryptedPhoneData: num.detail.encryptedData,
          phoneIv: num.detail.iv
        }
        // let test = params

        // that.setData({
        //   test: test,
        //   testJson: JSON.stringify(test)
        // })
        console.log(JSON.stringify(params) + '创建用户信息----参数')
        createOrUpdateWeChatUser(params).then(cauth => { //4
          console.log(JSON.stringify(cauth) + '创建用户信息验证--成功回调')
          console.log(cauth, '创建用户信息验证--成功回调22222222222')
          let authLogParam = {
            mobile: cauth.data.phoneNumber,
            openId: cauth.data.openId,
            unionId: cauth.data.unionId ? cauth.data.unionId : '',
            sessionId: app.globalData.auth.sessionId, // 新加登录加密信息
            encryptedPhoneData: num.detail.encryptedData, // 新加登录加密信息
            phoneIv: num.detail.iv  // 新加登录加密信息
          }
          let avatarUrl = cauth.data.avatarUrl
          console.log('创建用户后的登录接口---------------' + JSON.stringify(authLogParam))
          console.log(555)
          authLogin(authLogParam).then(login => {
            console.log(login)
            console.log(JSON.stringify(login) + '登录--成功回调')
            // 本地存储登录凭证
            wx.setStorageSync('token', login.data.token)
            let obj = {
              avatar: avatarUrl,
              nickname: login.data.userName,
              vipState: login.data.isVip ? isVipEnd(login.data.vipEndTime.toString(), Date.now().toString()) : 0, // 0 非会员， 1 会员快过期（不到一个月）， 2 会员有效
              vipEndTime: timestampToTime(login.data.vipEndTime.toString().substr(0, 10))
            }

            that.setData({
              userInfo: obj,
              isLogin: true,
              isVip: obj.vipState
            })

            wx.setStorageSync('avatarU', obj.avatar)
            wx.setStorageSync('nickname', obj.nickname)
            wx.setStorageSync('vipState', obj.vipState)
            wx.setStorageSync('vipEndTime', obj.vipEndTime)
            wx.setStorageSync('isLogin', true)
            wx.setStorageSync('isVip', obj.vipState)

            app.globalData.isVip = obj.vipState
            app.globalData.isLogin = true
            app.globalData.userInfo = obj
            // 重新设置收藏状态
            isFavorited()
          }).catch(err => console.log(JSON.stringify(err) + '登录--错误回调'))


        }).catch(err => {
          wx.showToast({
            title: '登录失败,请重新登录',
            icon: 'none',
            duration:1000
          })
          expireTaiLogin()
        })
      },
      fail(fail) {
        console.log(fail)
      }
    })
  }

  // ===============

  export const logoutTap = function () {

    logout().then(res => {
      console.log(JSON.stringify(res) + '退出登录--成功回调')
      if (res.data) {
        let obj = {
          avatar: '/images/asset/mine_no_login.png',
          nickname: '未登录',
          vipState: 0, // 0 非会员， 1 会员快过期（不到一个月）， 2 会员有效
          vipEndTime: ''
        }
        this.setData({
          userInfo: obj,
          isLogin: false,
          isVip: false
        })
        // 登录信息清空

        wx.setStorageSync('token', '')
        wx.setStorageSync('avatarU', obj.avatarUrl)
        wx.setStorageSync('nickname', obj.nickname)
        wx.setStorageSync('vipState', obj.vipState)
        wx.setStorageSync('vipEndTime', obj.vipEndTime)
        wx.setStorageSync('isLogin', '')
        wx.setStorageSync('isVip', '')

        app.globalData.isVip = false
        app.globalData.isLogin = false
        app.globalData.userInfo = obj
        // 重新设置收藏状态
        isFavorited()
      }
    }).catch(err => {
      wx.showToast({
        title: '退出失败',
        icon: 'none'
      })
      console.log(JSON.stringify(err) + '退出登录--错误回调')
    })
  }              

  export const logoutTap2 = function () {
    let obj = {
      avatar: '/images/asset/mine_no_login.png',
      nickname: '未登录',
      vipState: 0, // 0 非会员， 1 会员快过期（不到一个月）， 2 会员有效
      vipEndTime: ''
    }
    this.setData({
      userInfo: obj,
      isLogin: false,
      isVip: false
    })
    // 登录信息清空
    wx.setStorageSync('token', '')
    wx.setStorageSync('avatarU', obj.avatarUrl)
    wx.setStorageSync('nickname', obj.nickname)
    wx.setStorageSync('vipState', obj.vipState)
    wx.setStorageSync('vipEndTime', obj.vipEndTime)
    wx.setStorageSync('isLogin', '')
    wx.setStorageSync('isVip', '')

    app.globalData.isVip = false
    app.globalData.isLogin = false
    app.globalData.userInfo = obj
    // 重新设置收藏状态
    isFavorited()
  }

  export const userInfoUpdate = function () {
    userInfo().then(res => {
      console.log(res)
      console.log('用户信息获取成功')

      app.globalData.vipState = res.data.is_vip ? isVipEnd(res.data.expire_time.toString(), Date.now().toString()) : 0, // 0 非会员， 1 会员快过期（不到一个月）， 2 会员有效
      app.globalData.vipEndTime = timestampToTime(res.data.expire_time.toString().substr(0, 10))
      app.globalData.isVip = app.globalData.vipState
      
      wx.setStorageSync('isVip', app.globalData.vipState)
      wx.setStorageSync('vipState', app.globalData.vipState)
      wx.setStorageSync('vipEndTime', app.globalData.vipEndTime)
      // 重新设置收藏状态
      isFavorited()
    }).catch(err => {
      console.log(err)
      console.log('用户信息获取失败')
    })
  }

  // 开通VIP
  export const openVip = function () {
    console.log('开通VIP')
  } 
  // 立即续费
  export const renewalVip = function () {
    console.log('立即续费')

  }

  // 模态框回调函数
  export const btnCallback = function (opt) {
    console.log(opt.detail.type)
    if (opt.detail.type === 'open') { // 打开模态框
      // 动态设置模态框标题文字
      let item = 'bgConfirm.title'
      let btnname = 'bgConfirm.button[' + 0 + '].btnName'
      this.setData({
        [item]: opt.detail.text,
        [btnname]: opt.detail.btnTxt,
        bgShow: true
      })
      app.globalData.bgShow = true
    } else if (opt.detail.type === 'confirm') { // 模态框确认
      app.globalData.bgShow = false
      this.setData({
        bgShow: false
      },()=>{
        setTimeout(() => {          
          wx.navigateTo({
            url: '/pages/member/pay'
          })
        }, 200);
      })
    } else if (opt.detail.type === 'cancle') { // 模态框关闭
      this.setData({
        bgShow: false
      })
      app.globalData.bgShow = false
    }
  }
  export const logOutCallback = function (opt) {
    if (opt.detail.type === 'open') {
      let item = 'bgConfirm.title'
      let btnname = 'bgConfirm.button[' + 0 + '].btnName'
      this.setData({
        [item]: opt.detail.text,
        [btnname]: opt.detail.btnTxt,
        bgShow: true
      })
    } else if (opt.detail.type === 'confirm') { 
      this.setData({
        bgShow: false
      })
      app.globalData.logout = true
      wx.reLaunch({
        url: '/pages/personalCenter/personalCenter'
      })
    }
  }
  export const expireTaiLogin = ()=>{
    let taiLogin = wx.getStorageSync('taiLogin')
    if(taiLogin && !app.globalData.isLogin){
      wx.login({
        success(res) {
          validationAuthorize({
            code: res.code
          }).then(auth => {
            let newAuth = {
              openId: auth.data.openId,
              unionId: auth.data.unionId,
              sessionId: auth.data.sessionId
            }
            app.globalData.auth = newAuth
            wx.setStorageSync('auth', newAuth)
          }).catch(err => {})
        },
        fail(err) {
          console.log(err)
        }
      })
    }
  }
  // 登录和退出登录都调这里，用来判断歌曲的收藏状态
  async function isFavorited() {
    if(app.globalData.songInfo && app.globalData.songInfo.id){
      let params = {fragmentId: app.globalData.songInfo.id}
      let info = await albumMedia(params)
      app.globalData.songInfo.existed = info.data.isFavorite
      wx.setStorageSync('songInfo', app.globalData.songInfo)
      const pages = getCurrentPages()
      pages[pages.length - 1].setData({
        songInfo: app.globalData.songInfo 
      })
      let miniPlayer = pages[pages.length - 1].selectComponent('#miniPlayer')
      miniPlayer.setData({ songInfo: app.globalData.songInfo })
    }
  }