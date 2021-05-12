Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isWhole: {
      type: Boolean,
      value: true,
    },
    vehicleTips: {
      type: String,
      value: "请遵守交通法规，请勿在驾驶时扫描二维码",
    },
    confirmText: {
      type: String,
      value: "我知道了",
    },
    customStyle:{
      type: String,
      value: "",
    },
    btnStyle:{
      type: String,
      value: "",
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    showQrcodeMask: false,
    vehicleTipsArray:[]
  },
  // 页面初始化
  attached: function () {
    this.initialization();
  },
  // 页面卸载
  detached: function () {
    this.destructionWatc();
  },
  // 组件所在页面的生命周期函数
  pageLifetimes: {
    show: () => {},
    hide: () => {},
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 页面初始化
    initialization() {
      if(!this.data.isWhole) this.setData({
        vehicleTipsArray:this.data.vehicleTips.split('，')
      })
      if (wx.canIUse("getVehicleSpeedSync")) {
        let { state } = wx.getVehicleSpeedSync();
        this.setData({
          showQrcodeMask: state != "stopped",
        });
      }
      this.watcVehicleSpeed();
    },
    // 获取车机行驶状态
    watcVehicleSpeed() {
      if (wx.canIUse("onVehicleSpeedChange")) {
        wx.onVehicleSpeedChange((res) => {
          this.setData({
            showQrcodeMask: res.state != "stopped",
          });
        });
      }
    },
    // 销毁车机行驶状态监听
    destructionWatc() {
      if (wx.canIUse("offVehicleSpeedChange")) {
        wx.offVehicleSpeedChange((res) => {
          this.setData({
            showQrcodeMask: res.state != "stopped"
          });
        });
      }
      this.setData({
        showQrcodeMask: false
      });
    },
  },
});
