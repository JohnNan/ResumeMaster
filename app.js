//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this;
    this.getUserInfo(function (data) {
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxd859bda2b6666344&secret=8905b3c343ba3ababac7319ce8a12d49&js_code=' + res.code + '&grant_type=authorization_code',
              data: {},
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              // header: {}, // 设置请求的 header
              success: function (res) {
                that.globalData.userInfo.openid = res.data.openid;
                that.resumeLogin();
              },
              fail: function () {
                // fail
              },
              complete: function () {
                // complete
              }
            })
          }
        }
      });
    });
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  resumeLogin: function () {
    var that = this;
    wx.request({
      url: 'https://resume.dreawer.com/wxlogin',
      data: {
        'openid': that.globalData.userInfo.openid,
        'nickName': that.globalData.userInfo.nickName,
        'gender': that.globalData.userInfo.gender, 'avatarUrl': that.globalData.userInfo.avatarUrl
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      success: function (res) {
        wx.setStorage({
          key: "token",
          data: res.data.data.token
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  globalData: {
    userInfo: null
  }
})