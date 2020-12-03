
const app = getApp()
import tool from '../../utils/util'
import btnConfig from '../../utils/pageOtpions/pageOtpions'
// const { getData } = require('../../utils/https')

var timer = null

Page({
  data: {
    songInfo: {},
    playing: false,
    drapType: false,
    percent: 0,
    drapPercent: 0,
    playtime: '00:00',
    showList: false,
    currentId: null,
    // 开发者不传默认的按钮
    defaultBtns: [
      {
        name: 'toggle',                                          // 播放/暂停
        img: {
          stopUrl: '/images/stop2.png' ,                         // 播放状态的图标
          playUrl: '/images/play2.png'                           // 暂停状态的图标
        }
      },
    ],
    btnCurrent: null,
    noTransform: '',
    typelist: ['listLoop', 'singleLoop', 'shufflePlayback'],
    typeName: {
      "listLoop": '循环播放',
      "singleLoop": '单曲循环',
      "shufflePlayback": '随机播放',
    },
    loopType: 'listLoop',   // 默认列表循环
    likeType: 'noLike',
    total: 0,
    scrolltop: 0,
    currentTime: 0,
    barWidth: 0,
    mainColor: btnConfig.colorOptions.mainColor,
    percentBar: btnConfig.percentBar,
    showImg: false,
    bigScreen: app.globalData.PIbigScreen,
    abumInfoName: null,
    existed: false,
    mainColor: btnConfig.colorOptions.mainColor,
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    screen: app.globalData.screen
  },
  // 播放器实例
  audioManager: null,
  async onLoad(options) {

    const songInfo = {
      title: "示例歌曲一",
      id: 1481657185,
      src: "https://music.163.com/song/media/outer/url?id=1481657185.mp3",
      // singer: "傲七爷",
      coverImgUrl: "http://p4.music.126.net/cIR63lyPGgQ4mAyuOTg8lA==/109951165109878587.jpg",
      dt: '02:39'
    }
    app.globalData.songInfo = songInfo
    this.setData({
      songInfo: songInfo,
    },() => {
      // app.playing()
    })
  },
  onShow: function () {
    this.queryProcessBarWidth()
    const that = this;
    // 监听歌曲播放状态，比如进度，时间
    tool.playAlrc(that, app);
    timer = setInterval(function () {
      tool.playAlrc(that, app);
    }, 1000);
    let list = [{
      title: "示例歌曲一",
      id: 1481657185,
      src: "https://music.163.com/song/media/outer/url?id=1481657185.mp3",
      // singer: "傲七爷",
      coverImgUrl: "http://p4.music.126.net/cIR63lyPGgQ4mAyuOTg8lA==/109951165109878587.jpg",
      dt: '02:39'
    }]
    this.audioManager = wx.getBackgroundAudioManager()
    this.audioManager.playInfo = {playList: list};
    this.audioManager.onTimeUpdate((res) => {  //监听音频播放进度
      console.log(this.audioManager)
    })
  },
  onUnload: function () {
    clearInterval(timer);
  },
  onHide: function () {
    clearInterval(timer)
  },
  imgOnLoad() {
    this.setData({ showImg: true })
  },
  btnsPlay(e) {
    const type = e.currentTarget.dataset.name
    if (type) this[type]()
  },
  // 上一首
  pre() {
    let loopType = wx.getStorageSync('loopType')
    if (loopType !== 'singleLoop') this.setData({ showImg: false })
    const that = this
    app.cutplay(that, -1)
  },
  // 下一首
  next() {
    let loopType = wx.getStorageSync('loopType')
    if (loopType !== 'singleLoop') this.setData({ showImg: false })
    const that = this
    app.cutplay(that, 1)
  },
  // 暂停/播放
  toggle() {
    const that = this
    clearInterval(timer)
    // if (!this.data.playing) {
      timer = setInterval(function () {
        tool.playAlrc(that, app);
      }, 1000);
    // }
    tool.toggleplay(this, app)
  },
  // 开始拖拽
  dragStartHandle(event) {
    console.log('event.currentTarget.offsetLeft', event.currentTarget.offsetLeft)
    this.setData({
      isDrag: 'is-drag',
      _offsetLeft: event.changedTouches[0].pageX,
      _posLeft: event.currentTarget.offsetLeft
    })
  },
  // 拖拽中
  touchmove(event) {
    let offsetLeft = event.changedTouches[0].pageX
    // let duration = musicTime.duration && musicTime.duration != '00:00' ? musicTime.durationSecond : mediaDuration;
    let process = (offsetLeft - this.data._offsetLeft + this.data._posLeft) / this.data.barWidth
    if (process < 0) {
        process = 0
    } else if (process > 1) {
        process = 1
    }
    let percent = (process * 100).toFixed(3)
    let currentTime = process * tool.formatToSend(app.globalData.songInfo.dt)
    this.setData({
      percent,
      currentTime
    })
  },
  // 拖拽结束
  dragEndHandle(event) {
    console.log('play2')
    // app.playing()
    wx.seekBackgroundAudio({
        position: this.data.currentTime
    })
  },

  // 查询processBar宽度
  queryProcessBarWidth() {
    var query = this.createSelectorQuery();
    query.selectAll('.process-bar').boundingClientRect();
    query.exec(res => {
      try {
        this.setData({
          barWidth: res[0][0].width
        })
      } catch (err) {
      }
    });
  },
  // 点击改变进度, 拖拽结束
  setPercent(e) {
    console.log('拖拽结束')
    // if (this.data.playing) wx.showLoading({ title: '加载中...', mask: true })
    clearInterval(timer)
    wx.pauseBackgroundAudio();
    const that = this
    // 传入当前毫秒值
    const time = e.detail.value / 100 * tool.formatToSend(app.globalData.songInfo.dt)
    app.globalData.currentPosition = time
    console.log(that.data.playing, app.globalData.songInfo.dt)
    if (app.globalData.songInfo.dt) {
      if (that.data.playing) {
        app.playing(time)
        timer = setInterval(function () {
          tool.playAlrc(that, app);
        }, 1000);
      }
      that.setData({
        percent: e.detail.value
      })
    }
  },
  // 拖拽改变进度
  dragPercent(e) {
    const that = this
    clearInterval(timer)
    tool.playAlrc(that, app, e.detail.value);
    that.setData({
      percent: e.detail.value
    })
  }
})