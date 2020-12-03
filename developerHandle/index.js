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
const app = getApp()

module.exports = {
  data: {
    // 开发者注入快捷入口数据
    lalyLtn: {
      show: true,
      data: [{
          icon: '/images/zjst.png',
          title: "最近收听",
          name: 'latelyListen',
          islogin: false
        },
        {
          icon: '/images/icon_collect.png',
          title: "我喜欢的",
          name: 'like',
          islogin: true
        }
      ],
    },
    // 开发者注入模板页面数据
    info: [],
    // 开发者注入模板标签数据
    labels: {
      show: true,
      data: [{
        "name": "推荐",
        "id": 1
      }, {
        "name": "近期新书",
        "id": 2
      }, {
        "name": "榜单top10",
        "id": 3
      }, {
        "name": "免费体验",
        "id": 4
      }]
    },

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
  selectTap(e) {
    const index = e.currentTarget.dataset.index
    const name = e.currentTarget.dataset.name
    this.setData({
      currentTap: index
    })
    wx.showLoading({
      title: '加载中',
    })
    // 这里可以自定义传值传到_getList中
    this._getList(name)
  },
  _getLabels() {
    
  },
  _getList(name) {
    layoutGroup({}).then(res => {
      console.log(111)
    }).catch(err => {
      console.log(2222)
    })

    setTimeout(() => {
      wx.hideLoading()
      let data = [{
          "bookName": "非暴力沟通", //书籍名称
          "bookTime": 3061, //书籍时长
          "fragmentId": 1686, //音频id
          "imgUrl": "/images/asset/bookTest.png", //封面图片
        },{
          "bookName": "非暴力沟通", //书籍名称
          "bookTime": 3061, //书籍时长
          "fragmentId": 1686, //音频id
          "imgUrl": "/images/asset/bookTest.png", //封面图片
        }
      ]
      let info = data.map(item => {
        let obj = {}
        obj.id = item.fragmentId
        obj.src = item.imgUrl
        obj.title = item.bookName
        return obj
      })
      this.setData({
        reqL: true,
        info: info
      })
    }, 500)
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
    const routeType = e.currentTarget.dataset.contentype

    if (!app.globalData.latelyListenId.includes(id)) {
      app.globalData.latelyListenId.push(id)
    }
    let url
    if (routeType === 'album' || routeType === 'fm') {
      url = `../abumInfo/abumInfo?id=${id}&title=${title}&routeType=${routeType}`
    } else if (routeType === 'media') {
      url = `../playInfo/playInfo?id=${id}`
    }

    wx.navigateTo({
      url: url
    })
  }
}