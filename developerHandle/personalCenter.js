/**
 * @name: personalCenter
 * 开发者编写的最近收听latelyListen,配置（labels）的类型，通过切换（selectTap）获取不同类型列表
 * 这里开发者必须提供的字段数据(数据格式见听服务小场景模板开发说明文档)：
 * 1、userInfo: {
 *     avatar: '',
 *     nickname: '',
 *  }
 *  用户信息，模板只列出头像和昵称，开发者可自行根据需要新增参数
 * 2、data: [{
 *     method: 'order',
 *     icon: '/images/my_buy.png',
 *     title: '开通/续费会员'
 *   }, {
 *     method: 'like',
 *     icon: '/images/mine_like.png',
 *     title: '我喜欢的' 
 *   }]
 *  其他入口，配置入口点击事件方法名，入口图标，入口名称；入口数量开发者根据项目需要配置
 */
const app = getApp()


module.exports = {
  data: {
    // 开发者注入模板用户信息
    userInfo: {
      avatar: '/images/asset/mine_no_login.png',
      nickname: '未登录',
      vipState: 0, // 0 非会员， 1 会员快过期（不到一个月）， 2 会员有效
      vipEndTime: ''
    },
    // 登录标志
    isLogin: app.globalData.isLogin,
    // vip标志
    isVip: app.globalData.isVip,
    // 开发者注入模板其他入口
    data: [{
      method: 'latelyListen',
      icon: '/images/asset/icon_history_me.png',
      title: '最近播放' 
    }, {
      method: 'like',
      icon: '/images/asset/icon_collect_me.png',
      title: '我的收藏' 
    }]
  },
  onShow() {

  },
  onLoad(options) {
  },
  onReady() {

  },

  /**
   * 登录
   */
  login(event) {
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
  },
  getUserInfo() {
    const that = this
    wx.getUserInfo({
      success: res => {
        // 测试用vip字段
        let vip = 0
        let vipEndTime = '2020.12.21'

        let obj = {
          nickname: res.userInfo.nickName,
          avatar: res.userInfo.avatarUrl,
          vipState: vip,
          vipEndTime: vipEndTime
        }
        console.log(obj)

        that.setData({
          userInfo: obj,
          isLogin: true,
          isVip: (vip === 0) ? false : true
        })

        app.globalData.isVip = (vip === 0) ? false : true
        app.globalData.isLogin = true
      },
      fail: err => {
        console.log('error !'+err)
      }
    })
  },

  logout(){
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
    app.globalData.isVip = false
    app.globalData.isLogin = false
  },
  // 开通VIP
  openVip () {
    console.log('开通VIP')
  },
  // 立即续费
  renewalVip () {
    console.log('立即续费')
  },
  like() {
    if (!app.isLogin) {
      wx.showToast({ icon: 'none', title: '请登录后进行操作' })
      // return;
    }
    wx.navigateTo({ url: '../like/like' })
  },
  latelyListen() {
    if (!app.isLogin) {
      wx.showToast({ icon: 'none', title: '请登录后进行操作' })
      // return;
    }
    wx.navigateTo({ url: '../latelyListen/latelyListen' })
  }
}