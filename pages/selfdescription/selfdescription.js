// pages/selfdescription/selfdescription.js
Page({
  data: {
    label: '添加标签',
    evaluate: '',
  },
  onLoad: function (options) {
    var that = this;
    if (options.hobby) {
      this.setData({
        label: options.hobby,
        evaluate: options.evaluate,
      })
    }
    if (options.resumeId) {
      var resume = JSON.parse(options.data);
      console.log(resume.userInfo);
      that.setData({
        resumeId: options.resumeId,
        name: resume.userInfo.name,
        phoneNumber: resume.userInfo.phoneNumber,
        label: resume.userInfo.hobby,
        evaluate: resume.userInfo.evaluate,
        token: wx.getStorageSync('token'),
        ele: options.ele,
      })
    }
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
  bindKeyInput: function (e) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      'userInfo.evaluate': e.detail.value,
    })
    this.setData({
      evaluate: e.detail.value,
    })
  },
  goBack: function () {
    var that = this;

    if (that.data.resumeId) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: 'https://resume.dreawer.com/editResume',
        data: {
          token: that.data.token,
          resumeId: that.data.resumeId,
          name: that.data.name,
          phoneNumber: that.data.phoneNumber,
          evaluate: that.data.evaluate,
          hobby: that.data.label
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        success: function (res) {
          wx.hideLoading();
          wx.navigateBack();
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.setData({
            'resume.userInfo.hobby': that.data.label,
            'resume.userInfo.evaluate': that.data.evaluate,
          })
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
        }
      })
    } else {
      wx.navigateBack();
    }
  }
})