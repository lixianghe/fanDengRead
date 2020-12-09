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
    background: 'url("/images/asset/bg_loginCard.png")',
    userInfo: {
      avatar: '/images/asset/mine_no_login.png',
      nickname: '无昵称默认用户编号',
      vipState: 0, // 0 非会员， 1 会员快过期（不到一个月）， 2 会员有效
      vipEndTime: ''
    },
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
