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

import { layoutGroup } from '../utils/httpOpt/api'
import { btnCallback, openVip, renewalVip } from '../utils/login'
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
          islogin: false
        },
        {
          icon: '/images/icon_collect.png',
          title: "我的收藏",
          name: 'like',
          islogin: false
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
    // 封面图片形状 rect矩形，square，正方形
    shape: 'rect',
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
    let playingId = wx.getStorageSync('songInfo').id
    this.story = this.selectComponent(`#story${playingId}`)
    if (this.story) {
      this.story._onshow()
    }
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
    layoutGroup({}).then((res) => {
      // 推荐  suggest
      console.log(res.likedBookGroup.books)
      let suggest = res.likedBookGroup.books.map(v => {
        let obj = {}
        obj.id = v.fragmentId
        obj.src = v.coverImage
        obj.title = v.title,
        obj.count = v.readCount
        return obj
      })
      this.setData({
        info: suggest,
        // info: [{id: 123, title: '学习之路',src:'https://cdn-ali-images-test.dushu.io/159497393574fdef1c18a2ecf2e22fb4672c5a8930u2ne8e',count: 1000}],
        reqL: true
      }, () => {
        // setTimeout(() => {
          let playingId = wx.getStorageSync('songInfo').id
          this.story = this.selectComponent(`#story${playingId}`)
          if (this.story) {
            this.story._onshow()
          }
        // },1000)
      })
      
      wx.hideLoading()
    }).catch(err => {
      console.log(err)
      this.setData({
        // info: suggest,
        info: [{id: 123, title: '学习之路',src:'https://cdn-ali-images-test.dushu.io/159497393574fdef1c18a2ecf2e22fb4672c5a8930u2ne8e'},
        {id: 123, title: '学习之路',src:'https://cdn-ali-images-test.dushu.io/159497393574fdef1c18a2ecf2e22fb4672c5a8930u2ne8e'}],
        reqL: true
      })
      wx.hideLoading()
    })
  },
  // 跳转到快捷入口页面
  tolatelyListen(opt) {
    console.log(opt.detail.islogin)
    if(opt.detail.islogin) {
      wx.showToast({
        title: '请先登录后在操作',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: `../${opt.detail.page}/${opt.detail.page}`
    })
  },
  // 跳转到播放详情界面
  linkAbumInfo(e) {
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
    wx.setStorageSync('allList', this.data.info)
    let url = `../playInfo/playInfo?id=${id}`
    wx.navigateTo({
      url: url
    })
  }
}