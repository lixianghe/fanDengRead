
const app = getApp()
import tool from '../../utils/util'
import btnConfig from '../../utils/pageOtpions/pageOtpions'
import { songsUrl } from '../../utils/httpOpt/api'
import { logoutTap2 } from "../../utils/login";
Page({
  mixins: [require('../../developerHandle/playInfo')],
  data: {
    songInfo: {},
    playing: false,
    drapType: false,
    percent: 0,
    drapPercent: 0,
    playtime: '00:00',
    showList: false,
    currentId: null,
    showNonet:false,
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
    isDrag: '',
    barWidth: 0,
    currentTime: 0,
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
  onReady: function () {
    this.animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear'
    })
  },
  async onLoad(options) {
    // 根据分辨率设置样式
    this.setStyle()
    // 获取歌曲列表
    if(!Object.keys(options).length && wx.canIUse('getPlayInfoSync')){
      await this.continuationPlay()
      return false
    }
    const canplay = wx.getStorageSync('allList')
    let abumInfoName = wx.getStorageSync('abumInfoName')
    const songInfo = app.globalData.songInfo
    this.setData({
      songInfo: songInfo,
      canplay: canplay,
      noPlay: options.noPlay || null,
      abumInfoName: options.abumInfoName || '',
      loopType: wx.getStorageSync('loopType') || 'listLoop'
    })
    // 把abumInfoName存在缓存中，切歌的时候如果不是专辑就播放同一首
    wx.setStorageSync('abumInfoName', options.abumInfoName)
    const nativeList = wx.getStorageSync('nativeList') || []
    let that = this;
    if (!nativeList.length || abumInfoName !== options.abumInfoName) {
      wx.setStorageSync("nativeList", canplay);
      let [ids, urls] = [[], []],bookIdList = [];
      if(canplay && canplay.length && !options.hasOwnProperty('fragmentId'))canplay.forEach((n) => {ids.push(n.id2)});
      const ArrayIndex = [
        ...Array.from({
          length: Math.ceil(tool.floatDiv(ids.length, 10)),
        }).keys(),
      ];
      let funArray = ArrayIndex.map((n, i) =>
        songsUrl({
          bookIds: ids.slice(tool.floatMul(i, 10), tool.floatMul(i + 1, 10)),
        })
      );
      if (options.fragmentId) {
        this.data.playInfoBtns.splice(this.data.playInfoBtns.length - 1, 1)
        this.setData({
          playInfoBtns: this.data.playInfoBtns,
          outPush: true,
          playing:true
        })
        options.id = options.fragmentId
        app.globalData.songInfo = {}
      }
      if (!options.id || options.id == app.globalData.songInfo.id) {
        this.noplay()
        return
      }
      Promise.all(funArray)
        .then((res) => {
          res.map((items) => {
            this.setData({
              showNonet:false
            })
            if (items.status == "0000" && items.data.length) {
              items.data.forEach((item) => {
                urls.push({
                  title: item.bookName,
                  coverImgUrl: item.coverImage,
                  dataUrl: item.mediaUrl,
                  bookId:item.bookId,
                });
                bookIdList.push(item.bookId);
              });
            } else {
              wx.showToast({
                title: "获取播放列表失败，请稍后重试",
                icon: "none",
                duration: 1500,
                mask: false,
              });
            }
          });
          wx.setStorageSync("bookIdList", bookIdList);
          wx.setStorageSync("urls", urls);
          tool.initAudioManager(app, that);
          let getInfoParams = {fragmentId: options.id || app.globalData.songInfo.id}
            this.getMedia(getInfoParams).then(() => {
              if(options.fragmentId){
                let cardSingle = wx.getStorageSync('songInfo') || []
                wx.setStorageSync('allList',[cardSingle])
                wx.setStorageSync('urls',[
                  {
                    bookId:cardSingle.bookId,
                    coverImgUrl: cardSingle.coverImgUrl,
                    dataUrl: cardSingle.src,
                    title:cardSingle.title,
                  }
                ])
                wx.setStorageSync('nativeList',[
                  {
                    id: cardSingle.id,
                    id2: cardSingle.bookId,
                    src: cardSingle.coverImgUrl,
                    title: cardSingle.title
                  }
                ])
                wx.setStorageSync("bookIdList", {
                  bookId:cardSingle.bookId
                });
              }
            let bookIdList = wx.getStorageSync('bookIdList') || []
            let urls=  wx.getStorageSync('urls') || []
            if (urls.length && JSON.stringify(bookIdList) != JSON.stringify(app.globalData.bookIdList)) {
                let song = wx.getStorageSync('songInfo')
                if(urls && urls.length){
                  urls.forEach(item=>{
                    if(item.bookId==song.bookId){
                      song.src = item.dataUrl
                    }
                  })
                }
                app.globalData.songInfo = Object.assign({}, song)
                this.setData({ songInfo: song })
                wx.setStorageSync('songInfo', song)
              };
              if(options.fragmentId) tool.initAudioManager(app, that)
              if (app.globalData.songInfo.src) this.play() 
            }).catch(err => {
              wx.showToast({
                icon: 'none',
                title: '网络错误，请稍后重试~',
                duration: 1500,
                mask: false,
                })
            })
        })
        .catch((err) => {
          let { data } = err
          if(!data){
            this.setData({
              showNonet:true
            })
          }else{
            wx.showToast({
              title: "接口请求错误，请稍后重试",
              icon: "none",
              duration: 1500,
              mask: false,
            });
            tool.initAudioManager(app, that);
          }
        });
    }
    if (options.noPlay !== 'true') {
      let song = {
        title: options.title,
        coverImgUrl: options.src,
        id: options.id
      }
      song = Object.assign({}, app.globalData.songInfo, song)
      this.setData({songInfo: song})
      if (app.globalData.songInfo.id != options.id) wx.showLoading({ title: '加载中...', mask: true })
    }
    
  },
  onShow: function () {
    const that = this;
    const playing = wx.getStorageSync('playing')
    that.setData({playing: playing})
    this.queryProcessBarWidth()
    // 监听歌曲播放状态，比如进度，时间
    tool.playAlrc(that, app);
    if(app.globalData.songInfo && app.globalData.songInfo.id){
      this.logoutTap2 = logoutTap2.bind(this)
      if(wx.canIUse('onTaiAccountStatusChange')){
        wx.onTaiAccountStatusChange((res)=>{
          if(!res.isLoginUser){
            that.logoutTap2()
            wx.setStorageSync('taiLogin', false)
            that.setData({
              taiLogin: false
            })
          }
        })
      }
    }
  },
  imgOnLoad() {
    this.setData({ showImg: true })
  },
  play() {
    let that = this
    that.setData({
      playtime: app.globalData.playtime || '00:00',
      percent: app.globalData.percent || 0,

    })
    app.playing(null, that)
    // app.playing(app.audioManager.currentTime, that)
  },
  noplay() {
    this.setData({
      playtime: app.globalData.playtime || '00:00',
      percent: app.globalData.percent || 0
    })
    tool.EventListener(app,this)
  },
  btnsPlay(e) {
    const type = e.currentTarget.dataset.name
    if (type) this[type]()
  },
  // 上一首
  pre() {
    const that = this
    app.cutplay(that, -1)
  },
  // 下一首
  next() {
    const that = this
    app.cutplay(that, 1)
  },
  // 切换播放模式
  loopType() {
    const canplay = wx.getStorageSync('allList')
    let nwIndex = this.data.typelist.findIndex(n => n === this.data.loopType)
    let index = nwIndex < 2 ? nwIndex + 1 : 0
    app.globalData.loopType = this.data.typelist[index]
    // 根据播放模式切换currentList
    const list = this.checkLoop(this.data.typelist[index], canplay)
    wx.setStorageSync('allList', canplay)
    this.setData({
      loopType: this.data.typelist[index],
      canplay: list
    })
  },
  // 判断循环模式
  checkLoop(type, list) {
    wx.setStorageSync('loopType', type)
    wx.showToast({ title: this.data.typeName[type], icon: 'none' })
    let loopList;
    // 列表循环
    if (type === 'listLoop') {
      let nativeList = wx.getStorageSync('nativeList') || []
      loopList = nativeList        
    } else if (type === 'singleLoop') {
      // 单曲循环
      loopList = [list[app.globalData.songInfo.episode]]
    } else {
      // 随机播放
      loopList = this.randomList(list)
    }
    return loopList
  },
  // 打乱数组
  randomList(arr) {
    let len = arr.length;
    while (len) {
        let i = Math.floor(Math.random() * len--);
        [arr[i], arr[len]] = [arr[len], arr[i]];
    }
    return arr;
  },
  // 暂停/播放
  toggle() {
    const that = this
    tool.toggleplay(that, app)
  },
  // 播放列表
  more() {
    setTimeout(()=> {
      this.setScrollTop()
    }, 100)
    let allPlay = wx.getStorageSync('allList')
    this.setData({
      showList: true,
      currentId: this.data.currentId || Number(this.data.songInfo.id),
      canplay: allPlay
    })
    // 显示的过度动画
    this.animation.translate(0, 0).step()
    this.setData({
      animation: this.animation.export()
    })
    // setTimeout(() => {
    //   this.setData({
    //     noTransform: 'noTransform'
    //   })
    // }, 300)
  },
  closeList() {
    this.setData({
      showList: false,
      // noTransform: ''
    })
    // 显示的过度动画
    this.animation.translate('-180vh', 0).step()
    this.setData({
      animation: this.animation.export()
    })
  },
  // 在播放列表里面点击播放歌曲
  async playSong(e) {
    // 如果没有网
    tool.noNet(this.playSongDo, e)
  },
  async playSongDo(e) {
    let that = this
    const songInfo = e.currentTarget.dataset.song
    app.globalData.songInfo = songInfo
    songInfo.coverImgUrl = songInfo.src
    this.setData({
      songInfo: songInfo,
      currentId: app.globalData.songInfo.id,
      playing: true
    })
    // 获取歌曲详情
    let params = {fragmentId: app.globalData.songInfo.id}
    await this.getMedia(params)
    
    app.playing(null, that)
  },
  // 开始拖拽
  dragStartHandle(event) {
    this.setData({
      isDrag: 'is-drag',
      _offsetLeft: event.changedTouches[0].pageX,
      _posLeft: event.currentTarget.offsetLeft
    })
  },
  // 拖拽中
  touchmove(event) {
    let offsetLeft = event.changedTouches[0].pageX
    let process = (offsetLeft - this.data._offsetLeft + this.data._posLeft) / this.data.barWidth
    if (process < 0) {
        process = 0
    } else if (process > 1) {
        process = 1
    }
    let percent = (process * 100).toFixed(3)
    // let currentTime = process * tool.formatToSend(app.globalData.songInfo.dt)
    let currentTime = process * app.audioManager.duration
    let playtime = currentTime ? tool.formatduration(currentTime * 1000) : '00:00'
    this.setData({
      percent,
      currentTime,
      playtime
    })
  },
  // 拖拽结束
  dragEndHandle(event) {
    wx.seekBackgroundAudio({
      position: this.data.currentTime
    })
    setTimeout(() => {
      this.setData({isDrag: ''})
    }, 500)
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
    })
  },

  // 用slider拖拽
  sliderchange(e) {
    const percent = e.detail.value / 100
    const currentTime = percent * tool.formatToSend(app.globalData.songInfo.dt)
    wx.seekBackgroundAudio({
      position: currentTime
    })
    setTimeout(() => {
      this.setData({
        isDrag: ''
      })
    }, 500)
  },
  sliderchanging(e) {
    const percent = e.detail.value / 100
    const currentTime = percent * tool.formatToSend(app.globalData.songInfo.dt)
    const playtime = currentTime ? tool.formatduration(currentTime * 1000) : '00:00'
    this.setData({
      playtime
    })
    this.setData({
      isDrag: 'is-drag'
    })
  },
  // ******按钮点击态处理********/
  btnstart(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      btnCurrent: index

    })
  },
  btend() {
    setTimeout(()=> {
      this.setData({
        btnCurrent: null
      })
    }, 150)
  },
   // ******按钮点击态处理********/
   
  // 根据分辨率判断显示哪种样式
  setStyle() {
    // 判断分辨率的比列
    const windowWidth =  wx.getSystemInfoSync().screenWidth;
    const windowHeight = wx.getSystemInfoSync().screenHeight;
    // 如果是小于1/2的情况
    if (windowHeight / windowWidth >= 0.41) {
      this.setData({
        bigScreen: false,
        leftWith: windowWidth * 0.722 + 'px',
        leftPadding: '0vh 9.8vh 20vh',
        btnsWidth: '140vh',
        imageWidth: windowWidth * 0.17 + 'px'
      })
    } else {
      // 1920*720
      this.setData({
        bigScreen: true,
        leftWith: '184vh',
        leftPadding: '0vh 12.25vh 20vh',
        btnsWidth: '165vh',
        imageWidth: '49vh'
      })
    }
  },
  // 处理scrollTop的高度
  setScrollTop() {
    let index = this.data.canplay.findIndex(n => Number(n.id) === Number(this.data.songInfo.id))
    let query = wx.createSelectorQuery();
    query.select('.songList').boundingClientRect(rect=>{
      let listHeight = rect.height;
      this.setData({
        scrolltop: index > 2 ? listHeight / this.data.canplay.length * (index - 2)- 10 : 0
      })
    }).exec();
  }
})