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
import { layout, layoutGroup } from '../utils/httpOpt/api'
const app = getApp()

module.exports = {
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
          islogin: true
        }
      ],
    },
    // 开发者注入模板页面数据
    info: [],
    // 开发者注入模板标签数据
    labels: {
      show: false,
      data: [{
        "name": "推荐",
        "id": 'suggest'
      }, {
        "name": "近期新书",
        "id": 'recentNewBooks'
      }, {
        "name": "免费体验",
        "id": 'freeBooks'
      }]
    },
    // 模态框组件
    bgConfirm: {
      title: '立即续费',
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
    bgShow: false,
    allData: {
      suggest: [],
      freeBooks: [],
      recentNewBooks: []
    },
    // 封面图片形状 rect矩形，square，正方形
    shape: 'rect',
    // 数量图片
    countPic: '/images/media_num.png',
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

  },
  onLoad(options) {
    // 初始化加载数据
    this._getList()
  },
  onReady() {

  },
  // 模态框回调函数
  btnCallback(opt){
    if(opt.detail.type === 'confirm') {

    } else if (opt.detail.type === 'cancle') {
      this.setData({
        bgShow: false
      })
    }
  },

  selectTap(e) {
    const index = e.currentTarget.dataset.index
    const groupid = e.currentTarget.dataset.groupid
    this.setData({
      currentTap: index
    })
    
    // 这里可以自定义传值传到_getList中
    // this._getList(groupid)
    this.setData({
      info: this.data.allData[groupid]
    })
  },

  _getList() {
    wx.showLoading({
      title: '加载中',
    })
    layout({}).then(res => {
      // 推荐  suggest
      let suggest = res.data.map(v => {
        let obj = {}
        obj.id = v.fragmentId
        obj.src = v.coverImage
        obj.title = v.title,
        obj.count = v.readCount
        return obj
      })
      this.setData({
        info: suggest,
        reqL: true
      })
      wx.hideLoading()
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
    // Promise.all([layoutGroup().catch(err => console.log(err)), layout({}).catch(err => console.log(err))]).then(res => {
    //   console.log(res)
    //   let allData = {}
    //     // 近期新书
    //     let recentNewBooks = res[0].recentNewBooks.categoryBooks.map(v => {
    //       let obj = {}
    //       obj.id = v.fragmentId
    //       obj.src = v.coverImage
    //       obj.title = v.title,
    //       obj.count = v.readCount
    //       return obj
    //     })

    //     // 免费体验
    //     let freeBooks = res[0].freeBooks.map(v => {
    //       let obj = {}
    //       obj.id = v.fragmentId
    //       obj.src = v.coverImage
    //       obj.title = v.title,
    //       obj.count = v.readCount
    //       return obj
    //     })

    //     // 推荐  suggest
    //     let suggest = res[1].data.map(v => {
    //       let obj = {}
    //       obj.id = v.fragmentId
    //       obj.src = v.coverImage
    //       obj.title = v.title,
    //       obj.count = v.readCount
    //       return obj
    //     })

    //     allData.recentNewBooks = recentNewBooks
    //     allData.freeBooks = freeBooks
    //     allData.suggest = suggest
    //     console.log(allData.suggest)
    //     this.setData({
    //       allData: allData,
    //       info: allData.suggest,
    //       reqL: true
    //     })
    //     wx.hideLoading()
    // }).catch(err => {
    //   console.log(err)
    //   wx.hideLoading()
    // })
    
    // layoutGroup({}).then(res => {
    // })
  },
  // 跳转到快捷入口页面
  tolatelyListen(e) {
    let page = e.currentTarget.dataset.page
    wx.navigateTo({
      url: `../${page}/${page}`
    })
  },
  // 跳转到播放详情界面
  linkAbumInfo(e) {
    let id = e.currentTarget.dataset.id
    const src = e.currentTarget.dataset.src
    const title = e.currentTarget.dataset.title
    wx.setStorageSync('img', src)

    if (!app.globalData.latelyListenId.includes(id)) {
      app.globalData.latelyListenId.push(id)
    }
    let url = `../playInfo/playInfo?id=${id}`
    wx.navigateTo({
      url: url
    })
  }
}