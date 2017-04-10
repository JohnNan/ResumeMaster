// pages/information/information.js
Page({
  data: {
    array: ['男', '女'],
    input: false,
    modal: true,
    inputValue: '',
    sms1: '',
    sms2: '',
    sms3: '',
    sms4: '',
    phone: '',
    system: 'text',
    userInfo: {
      name: '',
      phoneNumber: '',
      email: '',
      address: '',
      gender: '男',
      birthday: '1996-06-01',
      hobby: '',
      skill: '',
      position: '',
      evaluate: '',
    },
    checkFlag: false,
  },
  bindDateChange: function (e) {
    this.setData({
      'userInfo.birthday': e.detail.value,
    })
  },
  genderChange: function (e) {
    var gender = this.data.array[e.detail.value];
    this.setData({
      'userInfo.gender': gender
    })
  },
  onLoad: function (options) {
    var that = this;
    var date = new Date;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    that.setData({
      token: wx.getStorageSync('token'),
      ele: options.ele
    })

    wx.getSystemInfo({
      success: function (res) {
        if (res.system.indexOf('iOS') >= 0) {
          that.setData({
            system: 'number',
          })
        }
      }
    })

    if (options.type === 'true') {
      that.setData({
        id: options.id,
        type: options.type,
      })
      wx.request({
        url: 'https://resume.dreawer.com/myResume',
        data: {
          token: that.data.token,
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          if (res.data.status) {
            if (res.data.data.resume !== null) {
              that.setData({
                userInfo: res.data.data.resume.userInfo,
                checkFlag: true, phone: res.data.data.resume.userInfo.phoneNumber,
                resume: res.data.data.resume
              })
            }
          }
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          that.setData({
            deBirsthday:year - 21 + '-06-01',
            endTime:year+'-'+month+'-'+day
          })
        }
      })
    } else {
      that.setData({
        id: options.resumeId,
        userInfo: JSON.parse(options.data).userInfo,
        checkFlag: true,
        phone: JSON.parse(options.data).userInfo.phoneNumber,
        deBirsthday:year - 21 + '-06-01',
        endTime:year+'-'+month+'-'+day
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
  goNext: function () {
    var that = this;

    var reg1 = /^([\u4E00-\u9FA5]+|[a-zA-Z]+)$/;
    if (!reg1.test(that.data.userInfo.name)) {
      wx.showModal({
        title: '提示',
        content: '请输入中文或英文姓名',
        showCancel: false,
      })
      return
    }

    var reg2 = /^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/;
    if (!reg2.test(that.data.userInfo.phoneNumber)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
        showCancel: false,
      })
      return
    }

    if (that.data.checkFlag === false) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的邮箱',
        showCancel: false,
      })
      return
    }

    console.log(1);
    if (that.data.type === 'true' || that.data.userInfo.phoneNumber != that.data.phone) {
      wx.request({
        url: 'https://resume.dreawer.com/sendSMS',
        data: {
          token: that.data.token,
          phoneNumber: that.data.userInfo.phoneNumber,
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT

        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        success: function (res) {
          if (res.data.status) {
            that.setData({
              modal: false,
              focus: true,
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
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      wx.request({
        url: 'https://resume.dreawer.com/editResume?token=' + that.data.token,
        data: {
          resumeId: that.data.id,
          name: that.data.userInfo.name,
          phoneNumber: that.data.userInfo.phoneNumber,
          email: that.data.userInfo.email,
          address: that.data.userInfo.address,
          gender: that.data.userInfo.gender,
          birthday: that.data.userInfo.birthday,
          hobby: that.data.userInfo.hobby,
          skill: that.data.userInfo.skill,
          position: that.data.userInfo.position,
          evaluate: that.data.userInfo.evaluate,
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        }, // 设置请求的 header
        success: function (res) {
          if (res.data.status) {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            prevPage.setData({
              'resume.userInfo': that.data.userInfo,
            })
            wx.navigateBack();
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
          wx.hideLoading();
        }
      })
    }


  },
  bindNameInput: function (e) {
    this.setData({
      'userInfo.name': e.detail.value,
    })
  },
  bindTelInput: function (e) {
    this.setData({
      'userInfo.phoneNumber': e.detail.value
    })
  },
  bindEmailInput: function (e) {
    this.setData({
      'userInfo.email': e.detail.value
    })
  },
  bindSmsInput: function (e) {
    var that = this;
    this.setData({
      sms1: e.detail.value.substring(0, 1),
      sms2: e.detail.value.substring(1, 2),
      sms3: e.detail.value.substring(2, 3),
      sms4: e.detail.value.substring(3, 4),
    })
    if (e.detail.value.length === 4) {
      setTimeout(function () {
        wx.hideKeyboard();
        that.setData({
          modal: true,
        })

        wx.showLoading({
          title: '加载中',
          mask: true,
        })

        wx.request({
          url: 'https://resume.dreawer.com/checkSMS',
          data: {
            token: that.data.token,
            number: parseInt(e.detail.value),
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          success: function (res) {
            if (res.data.status) {
              wx.request({
                url: 'https://resume.dreawer.com/addResume?token=' + that.data.token,
                data: {
                  resumeId: that.data.id,
                  name: that.data.userInfo.name,
                  phoneNumber: that.data.userInfo.phoneNumber,
                  email: that.data.userInfo.email,
                  address: that.data.userInfo.address,
                  gender: that.data.userInfo.gender,
                  birthday: that.data.userInfo.birthday,
                  hobby: that.data.userInfo.hobby,
                  skill: that.data.userInfo.skill,
                  position: that.data.userInfo.position,
                  evaluate: that.data.userInfo.evaluate,
                },
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                  'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
                }, // 设置请求的 header
                success: function (res) {
                  if (res.data.status) {
                    var resume;
                    if (that.data.resume === undefined) {
                      resume = '';
                    } else {
                      resume = JSON.stringify(that.data.resume);
                    }
                    wx.redirectTo({
                      url: '/pages/education/education?resumeId=' + res.data.data + '&data=' + resume,
                      success: function (res) {
                        // success
                      },
                      fail: function () {
                        // fail
                      },
                      complete: function () {
                        wx.hideLoading();
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

                }
              })
            } else {
              that.setData({
                modal: true,
                input: false,
                sms1: '',
                sms2: '',
                sms3: '',
                sms4: '',
              })
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '验证码错误',
                showCancel: false,
                complete: function () {
                  that.setData({
                    modal: false,
                    focus: true,
                  })
                }
              })
            }
          },
          fail: function () {
          },
          complete: function () {

          }
        })
      }, 500)

    }
  },
  hideInput: function () {
    this.setData({
      input: true,
    })
  },
  checkName: function () {
    var reg = /^([\u4E00-\u9FA5]+|[a-zA-Z]+)$/;
    if (!reg.test(this.data.userInfo.name)) {
      wx.showModal({
        title: '提示',
        content: '请输入中文或英文姓名',
        showCancel: false,
      })
      this.setData({
        checkFlag: false,
      })
      return;
    }
    this.setData({
      checkFlag: true,
    })
  },
  checkPhone: function () {
    var reg = /^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/;
    console.log(this.data.userInfo.phoneNumber);
    if (!reg.test(this.data.userInfo.phoneNumber)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
        showCancel: false,
      })
      this.setData({
        checkFlag: false,
      })
      return;
    }

    this.setData({
      checkFlag: true,
    })
  },
  checkEmail: function () {
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    if (!this.data.userInfo.email) {

    } else if (!reg.test(this.data.userInfo.email)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的邮箱',
        showCancel: false,
      })
      this.setData({
        checkFlag: false,
      })
      return;
    }

    this.setData({
      checkFlag: true,
    })
  },
  showKeyboard: function () {
    this.setData({
      focus: true,
      input: false,
    })
  }
})