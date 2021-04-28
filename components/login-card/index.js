import { onShow } from '../../developerHandle/search'
// components/loginCard/loginCard.js
import {agree, login, getPhoneNumber, next, logoutTap2,  openVip, renewalVip,btnCallback} from '../../utils/login'
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
    // 开发者注入模板用户信息
    userInfo: app.globalData.userInfo,
    // tai登录标志
    taiLogin: false,
    // 登录标志
    isLogin: app.globalData.isLogin,
    // vip标志
    isVip: app.globalData.isVip,
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
      let that = this
      if(wx.canIUse('checkSession')){
        wx.checkSession({
          success: (res) => {
          },
          fail: (err) => {
            that.logoutTap2()
            wx.setStorageSync('taiLogin', false)
            that.setData({
              taiLogin: false
            })
          },
        });
      }
      if(wx.canIUse('onTaiAccountStatusChange')){
        wx.onTaiAccountStatusChange((res)=>{
          if(!res.isLoginUser){
            that.logoutTap2()
            wx.setStorageSync('taiLogin', false)
            console.log('taiouttaiouttaiouttaiouttaiout')
            that.setData({
              taiLogin: false
            })
          }
        })
      }

      this.setData({
        isAgree: app.globalData.isAgree,
        userInfo: app.globalData.userInfo,
        isLogin: app.globalData.isLogin,
        taiLogin: wx.getStorageSync('taiLogin'),
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
    // 定义登录相关事件处理函数
    this.agree = agree.bind(this)
    this.login = login.bind(this)
    this.getPhoneNumber = getPhoneNumber.bind(this)
    this.next = next.bind(this)
    this.btnCallback = btnCallback.bind(this)
    this.logoutTap2 = logoutTap2.bind(this)
  }
})
