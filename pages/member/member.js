//index.js
const app = getApp()
let drawQrcode = require("../../utils/wepapp-qrcode")

Page({
  data: {
    text:"(๑′ᴗ‵๑)Ｉ Lᵒᵛᵉᵧₒᵤ❤",
  },
  onLoad() {
    this.ewmChange()
  },

  ewmChange(){
    let size = {}
    size.w = wx.getSystemInfoSync().windowWidth / 750 * 600
    size.h = size.w
    var that = this

    drawQrcode({
      width: size.w,
      height: size.h,
      canvasId: 'myQrcode',
      // ctx: wx.createCanvasContext('myQrcode'),
      text: that.data.text,
      // v1.0.0+版本支持在二维码上绘制图片
    })
  },

  ewmText(e){
    this.setData({
      text: e.detail.value
    })
  },

  searchFn(){
    this.ewmChange()
  }
  
})