// components/loginCard/loginCard.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    mainColor: app.globalData.mainColor,
    background: 'url("/images/asset/bg_login card.png")'
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //加载图片失败
    loadImgError: function (res) {
      this.setData({
        'item.coverUrl': app.sysInfo.defaultImg
      })
    }
  },

  attached: function () {

  }
})
