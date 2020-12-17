// pages/mine/pay.js
//获取应用实例
const app = getApp()
import { signature, getPayQrCode, buyResult } from '../../utils/httpOpt/api'

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
    console.log(1111)
    this.createOrder()
  },
  backTap(){
    wx.navigateBack()
  },

  async createOrder(){
    getPayQrCode().then(res => {
      let { totalPrice, payUrl } = res
      console.log('buy')
      console.log(res)
      this.setData({
        totalPrice,
        codeUrl: payUrl
      })
    }).catch((error) => {
      console.log('errorbuy')
      console.log(error)
    })
  }
})