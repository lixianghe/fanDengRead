function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 进行补0操作
function addZero(n) {
  return n < 10 ? '0' + n : n
}

//转换播放时间
function formatduration(duration, type = 'millisecond') {
  if (type === 'second') {
    duration = new Date(duration * 1000);
  } else if (type === 'millisecond' ) {
    duration = new Date(duration);
  }
  let m = Math.floor(duration / 1000 / 60)
  let s = Math.floor(duration / 1000)
  m = addZero(m) + ':'
  s = addZero(s % 60)
  return m + s
}

// 时间转秒
function formatToSend(dt) {
  const dtArray = dt.split(':')
  const seconds = Number(dtArray[0]) * 60 + Number(dtArray[1])
  return seconds
}

function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y+M+D
}

//音乐播放监听
function playAlrc(that, app) {
  var time = 0, playtime = 0;
  app.audioManager.onTimeUpdate((res) => {
    time = app.audioManager.currentTime / app.audioManager.duration * 100
    playtime = app.audioManager.currentTime
    app.globalData.percent = time
    app.globalData.currentPosition = app.audioManager.currentTime
    app.globalData.playtime = playtime ? formatduration(playtime * 1000) : '00:00'
    if (!that.data.isDrag) {
      that.setData({
        playtime: playtime ? formatduration(playtime * 1000) : '00:00',
        percent: time || 0
      })
    }
  })
}
// function playAlrc(that, app) {
//   wx.getBackgroundAudioPlayerState({
//     complete: function (res) {
//       var time = 0, playing = false, playtime = 0;
//       // 1是正常播放，2是异常
//       if (res.status != 2) {
//         time = res.currentPosition / res.duration * 100 || 0
//         playtime = res.currentPosition;
//       }
//       if (res.status == 1) {
//         playing = true;
//       }
//       app.globalData.playing = playing;
//       app.globalData.percent = time
//       app.globalData.currentPosition = playtime
//       if (that.data.isDrag) return
//       that.setData({
//         playtime: playtime ? formatduration(playtime * 1000) : '00:00',
//         percent: time || 0,
//         playing: playing
//       })
//       wx.setStorage({
//         key: "playing",
//         data: playing
//       })
//     }
//   });
// };


function toggleplay(that, app) {
  if (that.data.playing) {
    console.log("暂停播放")
    that.setData({ 
      playing: false 
    })
    app.audioManager.pause()
  } else {
    console.log("继续播放")
    that.setData({ 
      playing: true 
    })
    app.audioManager.play()
  }
}


// 初始化 BackgroundAudioManager
function initAudioManager(app, that, songInfo) {
  let list = wx.getStorageSync('nativeList')
  app.audioManager.playInfo = {
    playList: list,
    context: songInfo
  };
  EventListener(app,that)
}

// 监听播放，上一首，下一首
function EventListener(app, that){
  let playingId = wx.getStorageSync('songInfo').id
  let story = getCurrentPages()[getCurrentPages().length - 1].selectComponent(`#story${playingId}`)
  if (story) {
    story._onshow()
  }
  //播放事件
  app.audioManager.onPlay(() => {
    console.log('-------------------------------onPlay-----------------------------------', that)
    wx.hideLoading()
    that.setData({ playing: true });
    wx.setStorageSync('playing', true)
    const pages = getCurrentPages()
    let miniPlayer = pages[pages.length - 1].selectComponent('#miniPlayer')
    if (miniPlayer) miniPlayer.setData({ playing: true })
  })
  //暂停事件
  app.audioManager.onPause(() => {
    console.log('触发播放暂停事件');
    that.setData({ playing: false });
    wx.setStorageSync('playing', false)
    const pages = getCurrentPages()
    let miniPlayer = pages[pages.length - 1].selectComponent('#miniPlayer')
    if (miniPlayer) miniPlayer.setData({ playing: false })
  })
  //上一首事件
  app.audioManager.onPrev(() => {
    console.log('触发上一首事件');
    that.pre()
  })
  //下一首事件
  app.audioManager.onNext(() => {
    console.log('触发onNext事件');
    that.next();
  })
  //停止事件
  app.audioManager.onStop(() => {
    console.log('触发停止事件');
    that.setData({ playing: false });
    // 控制minibar
    wx.setStorageSync('playing', false)
    const pages = getCurrentPages()
    let miniPlayer = pages[pages.length - 1].selectComponent('#miniPlayer')
    if (miniPlayer) miniPlayer.setData({ playing: false })
  })
  //播放错误事件
  app.audioManager.onError(() => {
    console.log('触发播放错误事件');
    that.setData({ playing: false });
    // 控制minibar
    wx.setStorageSync('playing', false)
    const pages = getCurrentPages()
    let miniPlayer = pages[pages.length - 1].selectComponent('#miniPlayer')
    if (miniPlayer) miniPlayer.setData({ playing: false })
  })
  //播放完成事件
  app.audioManager.onEnded(() => {
    console.log('触发播放完成事件');
  })
}

// 函数节流
function throttle(fn, interval) {
  var enterTime = 0;//触发的时间
  var gapTime = interval || 100;//间隔时间，如果interval不传，则默认300ms
  return function () {
    var context = this;
    var backTime = new Date();//第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

// 函数防抖
function debounce(fn, interval = 300) {
  let canRun = true;
  return function () {
      if (!canRun) return;
      canRun = false;
      setTimeout(() => {
          fn.apply(this, arguments);
          canRun = true;
      }, interval);
  };
}

function isVipEnd (curr, now) {
  console.log(curr, now)
  let current = Number(curr)
  let nows = Number(now)
  let result = current - nows
  if (result > 0) {
    let rangeDateNum = result / (1000*3600*24);
    if (rangeDateNum < 30) {
      return 1
    } else {
      return 2
    }
  } else {
    return 0
  }
}

// 如果没有网络
function noNet(cb, e) {
  wx.getNetworkType({
    async success(res) {
      const networkType = res.networkType
      if (networkType === 'none') {
        wx.showToast({
          title: '网络异常，请检查网络',
          icon: 'none'
        })
      } else {
        cb && cb(e)
      }
    },
  })
}

module.exports = {
  formatToSend: formatToSend,
  formatduration: formatduration,
  playAlrc: playAlrc,
  toggleplay: toggleplay,
  initAudioManager: initAudioManager,
  EventListener: EventListener,
  throttle: throttle,
  debounce: debounce,
  timestampToTime: timestampToTime,
  isVipEnd: isVipEnd,
  noNet: noNet
}
