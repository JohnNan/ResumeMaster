// pages/job/job.js
Page({
  data: {
    works: [{
      time: "",
      company: "",
      position: "",
      description: ""
    }],
    workYearRange: ['应届', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '10年以上'],
    workYear: "应届"
  },
  workYearChange: function (e) {
    this.setData({
      workYear: this.data.workYearRange[parseInt(e.detail.value)]
    })
  },
  addJob: function () {
    this.data.works.push({});
    this.setData({
      works: this.data.works
    });
  },
  companyChange: function (e) {
    this.data.works[e.currentTarget.dataset.index].company = e.detail.value
    this.setData({
      works: this.data.works
    })
  },
  positionChange: function (e) {
    this.data.works[e.currentTarget.dataset.index].position = e.detail.value
    this.setData({
      works: this.data.works
    })
  },
  descriptionChange: function (e) {
    this.data.works[e.currentTarget.dataset.index].description = e.detail.value
    this.setData({
      works: this.data.works
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options);
    this.setData({
      ele: options.ele
    })
    if (options.data == undefined || options.data == 'undefined') {
      this.setData({
        resumeId: options.resumeId
      })
    } else {
      this.setData({
        resumeId: options.resumeId,
        works: JSON.parse(options.data).works
      })
    }


  },
  onReady: function (options) {
    // 页面渲染完成
    let _this = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        // success
        _this.setData({
          token: res.data
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    });
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
  goNext: function () {
    console.info(this.data.jobs);
    let _this = this;
    wx.showLoading({
      title: "请稍后"
    })
    wx.request({
      url: "https://resume.dreawer.com/editWork?token=" + _this.data.token,
      data: {
        resumeId: _this.data.resumeId,
        workYear: _this.data.workYear ? _this.data.workYear : 3,
        works: JSON.stringify(_this.data.works)
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      success: function (res) {
        if (res.data.status) {
          wx.hideLoading({})
          wx.redirectTo({
            url: '/pages/resumeview/resumeview?id=' + _this.data.resumeId,
            success: function (res) {
              // success
            },
            fail: function () {
              // fail
            },
            complete: function () {
              // complete
            }
          })
        } else {
          wx.showModal({
            title: "提示",
            content: res.data.errors[0].message
          })
        }

      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})