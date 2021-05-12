const app = getApp()

Component({
  properties: {
    bgconfirm: Object
  },
  data: {
    data: {
      title: '模态框标题',
      content: '模态框内容模态框内容模态框内容',
      background: 'rgba(0,0,0,0.6)',
      color: '#fff',
      button: [
        {
          bgColor: app.globalData.mainColor,
          color: '#1f1f1f',
          btnName: '确定'
        }, {
          bgColor: '#49494B',
          color: '#E6E6E6',
          btnName: '取消'
        }
      ]
    },
  },
  methods: {
    handle(e) {
      let type = e.currentTarget.dataset
      this.triggerEvent('callback', type);
    },
 
  },
  attached(options) {
    if(this.data.bgconfirm) {
      this.setData({
        data: this.data.bgconfirm
      })
    }
  }
})