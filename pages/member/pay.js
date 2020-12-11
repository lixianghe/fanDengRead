// pages/mine/pay.js
//获取应用实例
const app = getApp()
import { signature, buy, buyResult } from '../../utils/httpOpt/api'

var payTimer = null
Page({
  data: {
    // 系统配色
    colorStyle: '#ffac2d',
    // 系统背景色
    backgroundColor: '#151515',
    // 支付金额
    totalPrice: '',
    // 支付状态
    payStatus: 'pre',
    codeUrl: '/images/asset/erweima.png',
    totalPrice: '35',
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    screen: app.globalData.screen,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

  },
  onShow: function () {
    this.createOrder()
  },
  backTap(){
    wx.navigateBack()
  },

  async createOrder(){
    buy().then(res => {
      let { totalPrice, payResult } = res
      this.setData({
        totalPrice,
        codeUrl: payResult.codeUrl
      })
    })
  }
})