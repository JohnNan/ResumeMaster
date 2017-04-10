// pages/imgpreview/imgpreview.js
//index.js
var app = getApp()
var util = require('../../utils/util.js')
var order = ['red', 'yellow', 'blue', 'green', 'red']
Page({
  data: {
    id: '',
    flag: 0,
    toView: 'red',
    scrollTop: 100,
    naviFlag: false,
    maskFlag: false,
    animation: '',
    animation1: '',
    modelList: [],
    photo: '',
    showNav: "",
    favText: '收藏',
    r: 0
  },
  onLoad: function (options) {
    console.info(options);
    this.setData({
      source: "https://resume.dreawer.com/resource/image/" + options.photo + ".jpg?r=",
      options: options
    })
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    wx.getStorage({
      key: 'token',
      success: function (res) {
        let token = res.data;
        that.setData({
          token: token
        })
        wx.request({
          url: 'https://resume.dreawer.com/getUserFavorites?token=' + token,
          method: 'GET',
          success: function (res) {
            let idStr = "";
            for (let i = 0; i < res.data.data.length; i++) {
              if (i == res.data.data.length - 1) {
                idStr += res.data.data[i].contentId;
              } else {
                idStr += res.data.data[i].contentId + ",";
              }
            }
            wx.request({
              url: 'https://resume.dreawer.com/getModelList',
              data: {
                token: token
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              success: function (res) {
                that.setData({
                  modelList: res.data.data,
                  id: res.data.data[0].id,
                  photo: res.data.data[0].photo
                })

              }
            })
          }
        })
      }
    })


  },
  onReady: function () {
    this.animation = wx.createAnimation({
      duration: 150,
      timingFunction: 'linear',
      success: function (res) {
        console.log(res)
      }
    })

    this.animation1 = wx.createAnimation({
      duration: 150,
      timingFunction: 'linear',
      success: function (res) {
        console.log(res)
      }
    })
  },
  tap: function (e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  switchNavi: function () {
    var that = this;
    that.setData({
      naviFlag: !that.data.naviFlag,
    })
    if (that.data.naviFlag) {
      this.animation.height("335rpx").step();
      this.animation1.bottom("377rpx").step();
      this.setData({
        animation: this.animation.export(),
        animation1: this.animation1.export()
      })
    } else {
      this.animation.height("0").step();
      this.animation1.bottom("50rpx").step();
      this.setData({
        animation: this.animation.export(),
        animation1: this.animation1.export(),
      })
    }
  },
  switchMask: function () {
    var that = this;
    that.setData({
      maskFlag: !that.data.maskFlag,
      animFlag: 'move',
    })
  },
  switchResume: function (e) {
    wx.showLoading({
      title: "请稍后"
    });
    var that = this;
    console.info(e);
    wx.request({
      url: 'https://resume.dreawer.com/updateTemplate?token=' + that.data.token,
      data: {
        id: that.data.options.resumeId,
        resumeId: e.currentTarget.dataset.id
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      }, // 设置请求的 header
      success: function (res) {
        // success
        console.info(res);
        that.setData({
          source: "https://resume.dreawer.com/resource/image/" + res.data.data + ".jpg",
        })
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.data.resume.source = res.data.data;
        prevPage.setData({
          resume: prevPage.data.resume
        })
      },
      complete: function () {
        setTimeout(() => {
          wx.hideLoading();
        }, 500);

      }
    })
    that.setData({
      flag: e.currentTarget.dataset.resume,
      id: e.currentTarget.dataset.id,
      photo: e.currentTarget.dataset.photo,
    })
  },
  bigImg: function () {
    let _this = this;
    wx.previewImage({
      urls: [_this.data.source]
    })
  },
  onShareAppMessage: function () {
    console.info(this.data.resume.id);
    return {
      title: "我的" + this.data.resume.name,
      path: '/pages/resumeview/resumeview?id=' + this.data.id,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})
