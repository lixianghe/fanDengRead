/**
 * @name: personalCenter
 * 开发者编写的最近收听latelyListen,配置（labels）的类型，通过切换（selectTap）获取不同类型列表
 * 这里开发者必须提供的字段数据(数据格式见听服务小场景模板开发说明文档)：
 * 1、userInfo: {
 *     avatar: '',
 *     nickname: '',
 *  }
 *  用户信息，模板只列出头像和昵称，开发者可自行根据需要新增参数
 * 2、data: [{
 *     method: 'order',
 *     icon: '/images/my_buy.png',
 *     title: '开通/续费会员'
 *   }, {
 *     method: 'like',
 *     icon: '/images/mine_like.png',
 *     title: '我喜欢的'
 *   }]
 *  其他入口，配置入口点击事件方法名，入口图标，入口名称；入口数量开发者根据项目需要配置
 */
const app = getApp();
import {
  agree,
  login,
  getPhoneNumber,
  next,
  logoutTap,
  logoutTap2,
  userInfoUpdate,
  btnCallback,
} from "../utils/login";
module.exports = {
  data: {
    // 开发者注入模板用户信息
    userInfo: app.globalData.userInfo,
    // tai登录标志
    taiLogin: false,
    // 登录标志
    isLogin: app.globalData.isLogin,
    // vip标志
    isVip: app.globalData.isVip,
    // 开发者注入模板其他入口
    data: [
      {
        method: "latelyListen",
        icon: "/images/asset/icon_history_me.png",
        title: "最近播放",
      },
      {
        method: "like",
        icon: "/images/asset/icon_collect_me.png",
        title: "我的收藏",
      },
    ],
    // 模态框组件控制
    bgShow: app.globalData.bgShow,
    // 模态框组件
    bgConfirm: {
      title: "-",
      content: "一年VIP，价格365元，持续每周更新一本书籍，继续伴你成长。",
      background: 'url("/images/asset/bg_popup.png")',
      color: "#fff",
      button: [
        {
          bgColor: app.globalData.mainColor,
          color: "#1f1f1f",
          btnName: "续费",
          btnType: "confirm",
        },
        {
          bgColor: "#49494B",
          color: "#E6E6E6",
          btnName: "取消",
          btnType: "cancle",
        },
      ],
    },
  },
  onShow() {
    let that = this;
    if (app.globalData.logout) {
      that.setData({
        taiLogin: false,
      });
      wx.setStorageSync("taiLogin", false);
      this.logoutTap2 = logoutTap2.bind(this);
      app.globalData.logout = false;
      this.logoutTap2();
    }
    if (wx.canIUse("onTaiAccountStatusChange")) {
      wx.onTaiAccountStatusChange((res) => {
        if (!res.isLoginUser) {
          that.logoutTap2();
          wx.setStorageSync("taiLogin", false);
          that.setData({
            taiLogin: false,
          });
        }
      });
    }
    this.isRecharge();
    this.setData({
      isAgree: app.globalData.isAgree,
      userInfo: app.globalData.userInfo,
      isLogin: app.globalData.isLogin,
      taiLogin: wx.getStorageSync("taiLogin"),
      isVip: app.globalData.isVip,
    });
  },
  confirmHandle(e) {
    if (e.currentTarget.dataset.type === "renewalVip") {
      this.btnCallback({
        detail: { type: "open", text: "立即续费", btnTxt: "续费" },
      });
    } else if (e.currentTarget.dataset.type === "openVip") {
      this.btnCallback({
        detail: { type: "open", text: "开通会员", btnTxt: "开通" },
      });
    }
  },

  onLoad(options) {
    this.agree = agree.bind(this);
    this.login = login.bind(this);
    this.getPhoneNumber = getPhoneNumber.bind(this);
    this.next = next.bind(this);
    this.logoutTap = logoutTap.bind(this);
    this.logoutTap2 = logoutTap2.bind(this);
    this.btnCallback = btnCallback.bind(this);
    this.userInfoUpdate = userInfoUpdate.bind(this);
    setTimeout(() => {
      this.userInfoUpdate();
    }, 6000);
  },
  onReady() {},

  like() {
    if (!wx.getStorageSync("isLogin")) {
      wx.showToast({ icon: "none", title: "请登录后进行操作" });
      return;
    }
    wx.navigateTo({ url: "../like/like" });
  },
  latelyListen() {
    if (!wx.getStorageSync("isLogin")) {
      wx.showToast({ icon: "none", title: "请登录后进行操作" });
      return;
    }
    wx.navigateTo({ url: "../latelyListen/latelyListen" });
  },
  // 判断是否弹出充值提示
  isRecharge() {
    const { isLogin, isVip, isRecharge } = app.globalData;
    if (isLogin && !isVip && isRecharge) {
      app.globalData.isRecharge = false;
      this.btnCallback({
        detail: { type: "open", text: "开通会员", btnTxt: "开通" },
      });
    }
  },
};
