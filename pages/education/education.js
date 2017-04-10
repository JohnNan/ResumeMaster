// pages/education/education.js
Page({
  data: {
    eduArr: ['专科', '本科', '硕士', '博士','其它'],
    eduindex: 1,
    educations: [
      {
        time: '',
        education: "本科",
        school: '',
        specialty: ''
      }
    ],
    resumeId: ''
  },
  // addEducation: function () {
  //   this.data.educations.unshift({});
  //   this.setData({
  //     educations: this.data.educations
  //   });
  // },
  onLoad: function (options) {
    console.log("onload");
    console.info(options);
    let default_edu = [
      {
        time: '',
        education: "本科",
        school: '',
        specialty: ''
      }
    ];
    this.setData({
      ele: options.ele
    });
    let userInfo;
    if (options.data && options.data != undefined) {
      userInfo = JSON.parse(options.data);
      this.setData({
        resumeId: options.resumeId,
        educations: userInfo.educations ? userInfo.educations : default_edu,
        options: userInfo
      });
    } else {
      userInfo = {
        educations: [{
          time: '',
          education: "本科",
          school: '',
          specialty: ''
        }]
      };
      this.setData({
        resumeId: options.resumeId,
        educations: userInfo.educations ? userInfo.educations : default_edu
      });
    }

  },
  onReady: function (options) {
    // 页面渲染完成
    let _this = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
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
    })
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
  addOne: function () {
    this.data.educations.push({
      time: '',
      education: "本科",
      school: '',
      specialty: ''
    })
    this.setData({
      educations: this.data.educations
    })
  },
  schoolChange: function (e) {
    this.data.educations[e.currentTarget.dataset.index].school = e.detail.value
    this.setData({
      educations: this.data.educations
    })
  },
  specialtyChange: function (e) {
    this.data.educations[e.currentTarget.dataset.index].specialty = e.detail.value
    this.setData({
      educations: this.data.educations
    })
  },
  educationChange: function (e) {
    this.data.educations[e.currentTarget.dataset.index].education = e.detail.value
    this.setData({
      educations: this.data.educations
    })
  },
  addEducation: function () {
    //开始校验入参
    let educations = this.data.educations;
    let reg_school = /^([\u4e00-\u9fa5]{4,32})$/;
    let reg_specialty = /^([\u4e00-\u9fa5]{2,32})$/;
    for (let i = 0; i < educations.length; i++) {
      if (!reg_school.test(educations[i].school)) {
        wx.showModal({
          title: "提示",
          content: '请正确输入学校',
          showCancel: false
        });
        return;
      } else if (!reg_specialty.test(educations[i].specialty)) {
        wx.showModal({
          title: "提示",
          content: '请正确输入专业',
          showCancel: false
        });
        return;
      }
    }
    let _this = this;
    wx.showLoading({
      title: "请稍后"
    })
    wx.request({
      url: "https://resume.dreawer.com/editEducation?token=" + _this.data.token,
      data: {
        resumeId: _this.data.resumeId,
        educations: JSON.stringify(_this.data.educations)
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      success: function (res) {
        wx.hideLoading()
        // console.info(_this.data.options);
        // console.info('/pages/job/job?resumeId='+_this.data.resumeId+"&data="+JSON.stringify(_this.data.options));
        if (res.data.status) {
          console.log('重定向到url：' + '/pages/job/job?resumeId=' + _this.data.resumeId + "&data=" + JSON.stringify(_this.data.options));
          wx.redirectTo({
            url: '/pages/job/job?resumeId=' + _this.data.resumeId + "&data=" + JSON.stringify(_this.data.options),
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
          console.info(res)
          wx.showModal({
            title: "提示",
            content: res.data.errors[0].message,
            showCancel: false
          });
        }

      }
    })
  },
  eduChange: function (e) {
    console.info(e);
    console.info(this.data.educations);
    console.log(e.currentTarget.detail);
    this.data.educations[parseInt(e.currentTarget.dataset.index)].education = this.data.eduArr[parseInt(e.detail.value)]
    this.setData({
      educations: this.data.educations
    })
    console.info(this.data.educations);
  }
})