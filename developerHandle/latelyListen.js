/**
 * @name: latelyListen
 * 开发者编写的最近收听latelyListen,配置（labels）的类型，通过切换（selectTap）获取不同类型列表
 * 这里开发者必须提供的字段数据(数据格式见听服务小场景模板开发说明文档)：
 * labels: {
 *     show: true,
 *     data: [{
 *       name: '专辑',
 *       value: 'album'
 *     },
 *     {
 *       name: '故事',
 *       value: 'media'
 *     }],
 *   },
 *  可选内容，当show为false时不显示分类列表
 * 2、_getList函数，这里我们给开发者提供labels对应点击的的值，其余参数开发者自行添加；
 *    _getList函数获取的list最终转换为模板需要的字段，并setData给info。
 * 3、由于模板内的字段名称可能和后台提供不一样，在获取list后重新给模板内的字段赋值：如下以本页列表数据为例
 * list.map((item, index) => {
      item.title = item.mediaName                               // 歌曲名称
      item.id = item.mediaId                                    // 歌曲Id
      item.src = item.coverUrl                                  // 歌曲的封面
      item.contentType = 'album'                                // 类别（例如专辑或歌曲）
      item.isVip = true                                         // 是否是会员
    })
 */
const app = getApp();
import { logOutCallback } from "../utils/login";
import { history } from "../utils/httpOpt/api";
module.exports = {
  data: {
    showModal: false,
    req: false,
    countPic: "/images/media_num.png",
    // 播放图片
    playPic: "/images/asset/playing.png",
    // 开发者注入模板标签数据
    labels: {
      show: false,
      data: [
        {
          name: "专辑",
          value: "album",
        },
        {
          name: "故事",
          value: "media",
        },
      ],
    },
    // 开发者注入模板页面数据
    info: [],
    // 封面图片形状 rect矩形，square，正方形
    shape: "rect",
    // 登录过期模态框组件
    bgConfirm: {
      title: "-",
      content: "您的登录信息已过期，请先重新登录。",
      background: 'url("/images/asset/bg_popup.png")',
      color: "#fff",
      button: [
        {
          bgColor: app.globalData.mainColor,
          color: "#1f1f1f",
          btnName: "确定",
          btnType: "confirm",
        },
      ],
    },
  },
  onShow() {
    // 卡片组件onshow
    let playingId = wx.getStorageSync("songInfo").id;
    this.story = this.selectComponent(`#story${playingId}`);
    if (this.story) {
      this.story._onshow();
    }
  },
  onLoad(options) {
    this.logOutCallback = logOutCallback.bind(this);
    this._getList("专辑");
  },
  onHide() {
    // 清空上一首播放态
    let playingId = wx.getStorageSync("songInfo").id;
    this.story = this.selectComponent(`#story${playingId}`);
    if (this.story) {
      this.story.clearPlay();
    }
  },
  // 跳转到播放详情界面
  linkAbumInfo(e) {
    // 清空上一首播放态
    let playingId = wx.getStorageSync("songInfo").id;
    this.story = this.selectComponent(`#story${playingId}`);
    if (this.story) {
      this.story.clearPlay();
    }
    let id = e.currentTarget.dataset.id;
    const src = e.currentTarget.dataset.src;
    const title = e.currentTarget.dataset.title;
    wx.setStorageSync("img", src);
    wx.setStorageSync("allList", this.data.info);
    let url = `../playInfo/playInfo?id=${id}&title=${title}&src=${src}`;
    wx.navigateTo({
      url: url,
    });
  },
  selectTap(e) {
    const index = e.currentTarget.dataset.index;
    const name = e.currentTarget.dataset.name;
    this.setData({
      currentTap: index,
      retcode: 0,
    });
    wx.showLoading({
      title: "加载中",
    });
    this._getList(name);
  },
  _getList(name) {
    let params = { pageSize: 8, resourceType: [1] };
    console.log(params);
    console.log("historyhistory");
    history(params)
      .then((res) => {
        console.log("hist");
        console.log(res);
        let info = res.data.playRecords.map((v) => {
          let obj = {};
          obj.id2 = v.bookId
          obj.id = v.fragmentId ? v.fragmentId : "";
          obj.src = v.iconUrl ? v.iconUrl : "";
          obj.title = v.bookTitle ? v.bookTitle : "";
          return obj;
        });
        console.log(params);
        console.log("historyList=====104");
        this.setData(
          {
            req: true,
            info: info,
          },
          () => {
            // 卡片组件onshow
            let playingId = wx.getStorageSync("songInfo").id;
            this.story = this.selectComponent(`#story${playingId}`);
            if (this.story) {
              this.story._onshow();
            }
          }
        );
        if (info.length === 0) {
          this.setData({
            showModal: true,
          });
        }
        wx.hideLoading();
        console.log(res);
      })
      .catch((err) => {
        wx.hideLoading();
        this.setData({ req: true }, () => {
          this.logOutCallback({
            detail: { type: "open", text: "登录过期", btnTxt: "确定" },
          });
        });
      });
  },
  close() {
    this.setData({
      showModal: false,
    });
  },
};
