import { onShow } from '../../developerHandle/search'
// components/loginCard/loginCard.js
import {agree, login, getUserInfo, logout} from '../../utils/login'
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    quickEnter: { 
      type: Object,
      value: {}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    mainColor: app.globalData.mainColor,
    background: 'url("/images/asset/bg_loginCard.png")',
    userInfo: app.globalData.userInfo,
    // 登录标志
    isLogin: app.globalData.isLogin,
    // vip标志
    isVip: app.globalData.isVip,
    // 同意协议
    isAgree: app.globalData.isAgree
  },

  /**
   * 组件的方法列表
   */
  methods: {
    link(e) {
     let islogin = e.currentTarget.dataset.islogin
     let page = e.currentTarget.dataset.page
      this.triggerEvent('callback', {islogin: islogin,page:page});
    },
    //加载图片失败
    loadImgError: function (res) {
      this.setData({
        'item.coverUrl': app.sysInfo.defaultImg
      })
    },
    _onshow() {
      this.setData({
        isAgree: app.globalData.isAgree,
        userInfo: app.globalData.userInfo,
        isLogin: app.globalData.isLogin,
        isVip: app.globalData.isVip
      })
    },
    agreement() {
      wx.navigateTo({
        url: '../../pages/userAgree/userAgree'
      })
    },
    confirmHandle(e) {
      let obj = {type: e.currentTarget.dataset.type}
      this.triggerEvent('confirm', obj);
    }
  },

  attached: function () {
    console.log(this.data.quickEnter)
    // 定义登录相关事件处理函数
    this.agree = agree.bind(this)
    this.login = login.bind(this)
    this.getUserInfo = getUserInfo.bind(this)
    this.logout = logout.bind(this)
    // this.openVip = openVip.bind(this)
    // this.renewalVip = renewalVip.bind(this)
  }
})
