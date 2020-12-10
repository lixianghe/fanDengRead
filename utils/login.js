  /**
* 登录
*/
const app = getApp()

export const agree = function () {
  app.globalData.isAgree = !app.globalData.isAgree
  this.setData({
    isAgree: app.globalData.isAgree
  })
}
export const login = function () {
  if (!app.globalData.isAgree) {
    wx.showToast({
      title: '请同意服务协议',
      icon: 'none'
    })
    return
  }
 wx.login({
   success: (loginRes) => {
     this.getUserInfo()
   },
   fail: (err) => {
     console.log('扫码失败', JSON.stringify(err))
   },
   complete: (res) => {

   }
 })
}

export const getUserInfo = function () {
 const that = this
 wx.getUserInfo({
   success: res => {
     // 测试用vip字段
     let vip = 1
     let vipEndTime = '2020.12.21'

     let obj = {
       nickname: res.userInfo.nickName,
       avatar: res.userInfo.avatarUrl,
       vipState: vip,
       vipEndTime: vipEndTime
     }

     that.setData({
       userInfo: obj,
       isLogin: true,
       isVip: (vip === 0) ? false : true
     })

     app.globalData.isVip = (vip === 0) ? false : true
     app.globalData.isLogin = true
     app.globalData.userInfo = obj
   },
   fail: err => {
     console.log('error !'+err)
   }
 })
}

export const logout = function (){
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
 app.globalData.isVip = false
 app.globalData.isLogin = false
 app.globalData.userInfo = {
   avatar: '/images/asset/mine_no_login.png',
   nickname: '未登录',
   vipState: 0, // 0 非会员， 1 会员快过期（不到一个月）， 2 会员有效
   vipEndTime: ''
 }
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
export const btnCallback = function (opt){
  if (opt.detail.type === 'open') { // 打开模态框
    // 动态设置模态框标题文字
    let item = 'bgConfirm.title'
    let btnname = 'bgConfirm.button['+0+'].btnName'
    this.setData({
      [item]: opt.detail.text,
      [btnname]: opt.detail.btnTxt,
      bgShow: true
    })
    app.globalData.bgShow = true
  } else if(opt.detail.type === 'confirm') {  // 模态框确认

  } else if (opt.detail.type === 'cancle') {  // 模态框关闭
    this.setData({
      bgShow: false
    })
    app.globalData.bgShow = false
  }
}