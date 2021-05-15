const base = 'https://gateway-api.dushu.io'

const appId = 786474
/**
 * 封封微信的的request
 */

export function request(url, data = {}, method = 'POST') {
  return new Promise(function (resolve, reject) {
    data.appId = '60348'
    data.token = wx.getStorageSync('token') || ''
    wx.request({
      url: base + url,
      data: data,
      method: method,
      dataType: 'json',
      header: {
        'Content-Type': 'application/json',
        'X-DUSHU-APP-VER': '4.0.0',
        'X-DUSHU-APP-PLT': '3',
        'X-DUSHU-APP-CHN': 'TencentCarMini',
        'X-DUSHU-APP-MUID': '00000000-0000-0000-0000-000000000000',
        'X-DUSHU-APP-SYSVER': '1',
        'X-DUSHU-APP-DEVID':  '1'
      },
      success: function (res) {
        if (res.statusCode === 200) {
          if (res.data.status === '0000' || res.data.status === 1) {
            resolve(res.data)
          } else {  
            if (res.data.error === '1111') {
              wx.showToast({
                title: '登录信息已过期,请重新登录',
                icon: 'none'
              })
            } else {
              reject(res.data.message)
            }
          }
        } else {
          reject(res.data.message)
        }
      },
      fail: function (err) {
        reject(err)
        let page = getCurrentPages()[getCurrentPages().length - 1]
        page.setData({showNonet: true})
      }
    })
  })
}

export const apiFormat = (str, res) => {
  let reg = /\{(\w+?)\}/gi
  return str.replace(reg, ($0, $1) => {
    return res[$1]
  })
}
