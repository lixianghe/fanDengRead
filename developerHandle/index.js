/**
 * @name: index
 * 开发者编写的首页index,配置（labels）的类型，通过切换（selectTap）获取不同类型列表
 * 这里开发者必须提供的字段数据(数据格式见听服务小场景模板开发说明文档)：
 * labels: {
 *     show: false,
 *     data: [{
 *       "name": "推荐",
 *       "id": 1
 *     }, {
 *       "name": "精品",
 *       "id": 2
 *     }, {
 *       "name": "潮流",
 *       "id": 3
 *     }]
 *   },
 * 可选内容，当show为false时不显示分类列表
 * 2、_getList函数，这里我们给开发者提供labels对应点击的的值，其余参数开发者自行添加；
 *    _getList函数获取的list最终转换为模板需要的字段，并setData给info。
 * 3、由于模板内的字段名称可能和后台提供不一样，在获取list后重新给模板内的字段赋值：如下以本页列表数据为例
 * list.map((item, index) => {
 *     item.title = item.mediaName                               // 歌曲名称
 *     item.id = item.mediaId                                    // 歌曲Id
 *     item.src = item.coverUrl                                  // 歌曲的封面
 *     item.contentType = 'album'                                // 类别（例如专辑或歌曲）
 *     item.isVip = true                                         // 是否是会员
 *   })
 * 这里做了下数据字段的转换
 * 
 * 4、配置页面的快捷入口
 * lalyLtn：[
 *     {icon: '/images/zjst.png', title: "最近收听", name: 'latelyListen', islogin:false},
 *   ]
 *  可选内容，当show为false时不显示分类列表,数量 1~2个
 */

import { layoutGroup, feed,songsUrl} from '../utils/httpOpt/api'
import { btnCallback, openVip, renewalVip } from '../utils/login'
import { getMedia } from '../developerHandle/playInfo'
import tool from '../utils/util'
const app = getApp()

module.exports = {
  mixins: [require('./personalCenter')],
  data: {
    // 开发者注入快捷入口数据
    lalyLtn: {
      show: true,
      containLogin: true,
      data: [{
          icon: '/images/zjst.png',
          title: "最近播放",
          name: 'latelyListen',
          islogin: true
        },
        {
          icon: '/images/icon_collect.png',
          title: "我的收藏",
          name: 'like',
          islogin: true
        }
      ],
    },
    // 登录卡片组件
    loginCard: '',
    // 开发者注入模板页面数据
    info: [],
    // 开发者注入模板标签数据
    labels: {
      show: false,
      data: []
    },
    // 模态框组件
    bgConfirm: {
      title: '-',
      content: '一年VIP，价格365元，持续每周更新一本书籍，继续伴你成长。',
      background: 'url("/images/asset/bg_popup.png")',
      color: '#fff',
      button: [
        {
          bgColor: app.globalData.mainColor,
          color: '#1f1f1f',
          btnName: '续费',
          btnType: 'confirm'
        }, {
          bgColor: '#49494B',
          color: '#E6E6E6',
          btnName: '取消',
          btnType: 'cancle'
        }
      ]
    },
    // 模态框组件控制
    bgShow: app.globalData.bgShow,
    allData: {
      suggest: [],
      freeBooks: [],
      recentNewBooks: []
    },
    // 封面图片形状 rect矩形,rectBig大矩形，square，正方形
    shape: 'rectBig',
    // 数量图片
    countPic: '/images/asset/erji.png',
    // 播放图片
    playPic: '/images/asset/playing.png',
    // 频道列表，内容列表数据标志变量
    reqS: true,
    reqL: false,
  },
  // 页面后台数据(不参与渲染)
  pageData: {
    pageName: 'index',
    pageType: 'tab',
    pageLoaded: false,
    // 各频道列表页码，根据groupId获取
    pageNum: 1,
    hasNext: true,
  },
  onShow() {
    // 登录组件onshow
    this.loginCard = this.selectComponent('#loginCard')
    this.loginCard._onshow()
    // 卡片组件onshow
    setTimeout(() => {
      let playing = wx.getStorageSync("playing");
      if (playing) {
        let playingId = wx.getStorageSync("songInfo").id;
        this.story = this.selectComponent(`#story${playingId}`);
        if (this.story) {
          this.story._onshow()
        }
      }
    }, 600);
  },
  onLoad(options) {
    this.btnCallback = btnCallback.bind(this)
    this.openVip = openVip.bind(this)
    this.renewalVip = renewalVip.bind(this)
    // 初始化加载数据
    this._getList()
  },
  onHide() {
    // 清空上一首播放态
    let playingId = wx.getStorageSync('songInfo').id
    this.story = this.selectComponent(`#story${playingId}`)
    if (this.story) {
      this.story.clearPlay()
    }
  },
  // 处理logincard组件事件响应
  confirmHandle(opt) {
    if(opt.detail.type === 'renewalVip') {
      this.btnCallback({
        detail: {type: 'open', text: '立即续费', btnTxt: '续费'}
      })
    } else if (opt.detail.type === 'openVip') {
      this.btnCallback({
        detail: {type: 'open', text: '开通VIP', btnTxt: '开通'}
      })
    }
  },
  _getList() {
    // wx.showLoading({
    //   title: '加载中',
    // })
    layoutGroup({}).then((result) => {
      // 分类部分
      let categoryLabels = [
        {
          "name": "近期新书",
          "id": '0'
        }, {
          "name": "免费体验",
          "id": 'freeBooks'
        }
      ]
      let res = result
      for (let n of res.categories) {
        categoryLabels.push({name: n.name, id: n.id})
      }
      let recentNewBooks = res.recentNewBooks.categoryBooks
      wx.setStorageSync('recentNewBooks', recentNewBooks)
      wx.setStorageSync('categoryLabels', categoryLabels)
      // 推荐  suggest
      this.getFeed()
      
    }).catch(err => {
      this.setData({
        // info: suggest,
        info: [{id: 123, title: '学习之路',src:'https://cdn-ali-images-test.dushu.io/159497393574fdef1c18a2ecf2e22fb4672c5a8930u2ne8e'},
        {id: 123, title: '学习之路',src:'https://cdn-ali-images-test.dushu.io/159497393574fdef1c18a2ecf2e22fb4672c5a8930u2ne8e'}],
        reqL: true
      })
      wx.hideLoading()
    })
  },
  // 获取首页的书籍
  getFeed() {
    feed().then(res => {
      let suggest = res.data.map(v => {
        let obj = {}
        obj.id = v.fragmentId
        obj.src = v.coverImage
        obj.title = v.title,
        obj.count = v.readCount
        obj.id2 = v.id
        return obj
      })
      this.setData({
        info: suggest,
        // info: [{id: 123, title: '学习之路',src:'https://cdn-ali-images-test.dushu.io/159497393574fdef1c18a2ecf2e22fb4672c5a8930u2ne8e',count: 1000}],
        reqL: true
      }, () => {
          let playingId = wx.getStorageSync('songInfo').id
          this.story = this.selectComponent(`#story${playingId}`)
          if (this.story) {
            this.story._onshow()
          }
          this.voicePath(this)
      })
      wx.hideLoading()
    })
  },
  // 跳转到快捷入口页面
  tolatelyListen(opt) {
    if(opt.detail.islogin && !wx.getStorageSync('isLogin')) {
      wx.showToast({
        title: '请先登录后再操作',
        icon: 'none'
      })
      return
    } else if (wx.getStorageSync('isLogin')) {
      wx.navigateTo({
        url: `../${opt.detail.page}/${opt.detail.page}`
      })
    }
  },
  // 跳转到播放详情界面
  linkAbumInfo(e) {
    // 如果没有网
    tool.noNet(this.linkDo, e)
    
  },
  linkDo(e) {
    // 清空上一首播放态
    let playingId = wx.getStorageSync('songInfo').id
    this.story = this.selectComponent(`#story${playingId}`)
    if (this.story) {
      this.story.clearPlay()
    }

    let id = e.currentTarget.dataset.id
    const src = e.currentTarget.dataset.src
    const title = e.currentTarget.dataset.title
    wx.setStorageSync('img', src)

    if (!app.globalData.latelyListenId.includes(id)) {
      app.globalData.latelyListenId.push(id)
    }
    app.globalData.syncStart = false
    wx.setStorageSync('allList', this.data.info)
    let url = `../playInfo/playInfo?id=${id}&title=${title}&src=${src}`
    wx.navigateTo({
      url: url
    })
  },
  // 语音Path直达播放功能
  voicePath(that) {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length-1];
    if(!currentPage.options.playing) return
    let { info } = that.data
    let [urls, bookIdList] = [[], []]
    let ids = info.map((n) =>n.id2)|| []
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
    Promise.all(funArray)
    .then((res) => {
      res.map((items) => {
        that.setData({
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
      wx.setStorageSync('allList', info)
      wx.setStorageSync("bookIdList", bookIdList);
      wx.setStorageSync("urls", urls);
      getMedia({ fragmentId: info[0].id }, that).then(res => {
        let bookIdList = wx.getStorageSync('bookIdList') || []
        let urls = wx.getStorageSync('urls') || []
        if (urls.length && JSON.stringify(bookIdList) != JSON.stringify(app.globalData.bookIdList)) {
          let song = wx.getStorageSync('songInfo')
          if (urls && urls.length) {
            urls.forEach(item => {
              if (item.bookId == song.bookId) {
                song.src = item.dataUrl
                song.coverImgUrl = item.coverImgUrl
              }
            })
          }
          app.globalData.songInfo = Object.assign({}, song)
          that.setData({ songInfo: song })
          app.globalData.songInfo = song
          wx.setStorageSync('songInfo', song)
        };
        tool.initAudioManager(app, that)
        if (app.globalData.songInfo.src) app.playing(null, that)
      }).catch(err => {
        wx.showToast({
          icon: 'none',
          title: '网络错误，请稍后重试~',
          duration: 1500,
          mask: false,
        })
      })
    }).catch((err) => {
      let { data } = err
      if (!data) {
        that.setData({
          showNonet: true
        })
      } else {
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
}