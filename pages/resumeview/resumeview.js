// pages/resumeview/resumeview.js
Page({
  data: {
    resume: {},
    showMask: "none"
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.info(options.id);
    this.setData({
      resumeId: options.id
    })
    let _this = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        _this.setData({
          token: res.data
        })
        wx.request({
          url: 'https://resume.dreawer.com/userInfo?token=' + res.data,
          data: {},
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function (res) {
            // success
            console.log("userInfo");
            console.info(res);
            _this.setData({
              mugshot: res.data.data.mugshot
            })
          }
        })
        wx.request({
          url: 'https://resume.dreawer.com/resumeDetail',
          data: {
            id: options.id,
            token: _this.data.token
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function (res) {
            // success
            _this.setData({
              resume: res.data.data.resume,
              isMe: res.data.data.isMe
            })
          }
        });
      }
    })


  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  readPdf: function (e) {
    let _this = this;
    wx.navigateTo({
      url: "/pages/imgpreview/imgpreview?resumeId=" + _this.data.resumeId + "&photo=" + _this.data.resume.source
    })

  },
  goInformation: function (e) {
    if (!this.data.isMe) {
      return;
    }
    let _this = this;
    if (e.currentTarget.dataset.ele == 'hobby' || e.currentTarget.dataset.ele == 'evaluate') {
      wx.navigateTo({
        url: '/pages/selfdescription/selfdescription?resumeId=' + _this.data.resumeId + "&ele=" + e.currentTarget.dataset.ele + "&data=" + JSON.stringify(_this.data.resume),
      })
      // } else if (e.currentTarget.dataset.ele == 'skill') {
      //   wx.navigateTo({
      //     url: '/pages/skill/skill?resumeId=' + _this.data.resumeId + "&ele=" + e.currentTarget.dataset.ele + "&data=" + JSON.stringify(_this.data.resume),
      //   })
      // } else if (e.currentTarget.dataset.ele == 'address') {
      //   wx.navigateTo({
      //     url: '/pages/city/city?resumeId=' + _this.data.resumeId + "&ele=" + e.currentTarget.dataset.ele + "&data=" + JSON.stringify(_this.data.resume),
      //   })
      // } else if (e.currentTarget.dataset.ele == 'hobby') {
      //   wx.navigateTo({
      //     url: '/pages/xingqu/xingqu?resumeId=' + _this.data.resumeId + "&ele=" + e.currentTarget.dataset.ele + "&data=" + JSON.stringify(_this.data.resume),
      //   })
      // } else if (e.currentTarget.dataset.ele == 'evaluate') {
      //   wx.navigateTo({
      //     url: '/pages/selfdescription/selfdescription?resumeId=' + _this.data.resumeId + "&ele=" + e.currentTarget.dataset.ele + "&data=" + JSON.stringify(_this.data.resume),
      //   })
    } else {
      wx.navigateTo({
        url: '/pages/information/information?resumeId=' + _this.data.resumeId + "&ele=" + e.currentTarget.dataset.ele + "&data=" + JSON.stringify(_this.data.resume),
      })
    }

  },
  goEducation: function (e) {
    if (!this.data.isMe) {
      return;
    }
    let _this = this;
    wx.navigateTo({
      url: '/pages/education/education?resumeId=' + _this.data.resumeId + "&ele=" + e.currentTarget.dataset.ele + "&data=" + JSON.stringify(_this.data.resume),
    })
  },
  goJob: function (e) {
    if (!this.data.isMe) {
      return;
    }
    let _this = this;
    wx.navigateTo({
      url: '/pages/job/job?resumeId=' + _this.data.resumeId + "&ele=" + e.currentTarget.dataset.ele + "&data=" + JSON.stringify(_this.data.resume),
    })
  },
  emailChange: function (e) {
    console.info(e);
    this.setData({
      sendEmail: e.detail.value
    })
  },
  postEmail: function (e) {
    let _this = this;
    wx.navigateTo({
      url: '/pages/send/send?resumeId=' + _this.data.resumeId
    })
  },
  onShareAppMessage: function () {
    console.info(this.data.resume.id);
    return {
      title: "我的" + this.data.resume.name,
      path: '/pages/resumeview/resumeview?id=' + this.data.resume.id,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})