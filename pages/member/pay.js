// pages/mine/pay.js
//获取应用实例
const app = getApp()
import { signature, getPayQrCode, buyResult } from '../../utils/httpOpt/api'
let drawQrcode = require("../../utils/wepapp-qrcode")

console.log(drawQrcode)

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
    codeUrl: '',
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
      let payUrl = res.data.payUrl
      this.setData({
        codeUrl: payUrl
      })
      this.ewmChange(payUrl)
    }).catch((error) => {
      console.log(error)
    })
  },
  ewmChange(url){
    let size = {}
    let query = wx.createSelectorQuery();
    query.select('.myQrcode').boundingClientRect(rect=>{
      let canvasHeight = rect.height - 10;
      console.log(canvasHeight)
      size.w = canvasHeight
      size.h = size.w
      drawQrcode({
        width: size.w,
        height: size.h,
        canvasId: 'myQrcode',
        // ctx: wx.createCanvasContext('myQrcode'),
        text: url,
        // v1.0.0+版本支持在二维码上绘制图片
      })
    }).exec();
  }
})