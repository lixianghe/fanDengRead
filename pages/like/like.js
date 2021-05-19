import { albumFavoriteCancel,albumFavoriteAdd,mediaFavoriteCancel,mediaFavoriteAdd } from '../../utils/httpOpt/api'
const app = getApp()
Page({
  mixins: [require('../../developerHandle/like')],
  data: {
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    screen: app.globalData.screen,
    noContent: '/images/nullContent.png',
    info: '',
    currentTap: 0,
    scrollLeft: 0,
    mainColor: app.globalData.mainColor,
    showNonet: false
  },
  screen: app.globalData.screen,
 
  onLoad(options) {
    // 检测网络
    // let that = this
    // app.getNetWork(that)
  },
  scrollRight() {
    // wx.showToast({
    //   title: '已经到底了',
    //   icon: 'none'
    // })
  },
  aaa() {

  },
  onShow() {},
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  }
})