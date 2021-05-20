// import { albumFavoriteAdd } from '../../utils/httpOpt/api'
const app = getApp()

Page({
  mixins: [require('../../developerHandle/index')],
  data: {
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    screen: app.globalData.screen,
    mainColor: app.globalData.mainColor,
    confirm: '',
    currentTap: 0,
    scrollLeft: 0,
    isFixed: false,
    showNonet: false
  },
  scrollhandle(e) {
    if (e.detail.scrollLeft > 230) {
      this.setData({
        isFixed: true
      })
    } else {
      this.setData({
        isFixed: false
      })
    }
    
  },
  scrollRight() {
    // 提示导致ZBE卡顿暂时去掉
    // wx.showToast({
    //   title: '已经到底了',
    //   icon: 'none',
    //   duration: 1500,
    //   mask: false,
    // })
  },
  onLoad(options) {
    this.selectComponent('#miniPlayer').getPlayInfo()
  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  }
})