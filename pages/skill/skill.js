// pages/skill/skill.js
var util = require('../../utils/util.js')
Page({
  data: {
    selectTags: [],
    tags: [],
    suggestTags: [],
    placeholder: '添加专业技能',
  },
  onLoad: function (options) {
    var that = this;
    var skill = options.ele;
    var resumeId = options.resumeId;
    if (skill) {
      that.setData({
        selectTags: skill.split('  '),
      })
    }
    if (resumeId) {
      that.setData({
        resumeId: resumeId,
        name: options.name,
        phoneNumber: options.phoneNumber,
        selectTags:options.ele.split('  ')
      })
    }
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          token: res.data,
        })
        wx.request({
          url: 'https://resume.dreawer.com/getParams',
          data: {
            category: 'SKILL',
            token: res.data,
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function (res) {
            if (res.data.status) {
              var arry = res.data.data;

              that.setData({
                classifyId: arry[0].id,
              })

              wx.request({
                url: 'https://resume.dreawer.com/getObjectTags',
                data: {
                  objectId: arry[0].id,
                  token: that.data.token
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function (res) {
                  if (res.data.status) {
                    var tags = res.data.data;
                    for (var i = 0; i < tags.length; i++) {
                      if (util.contains(that.data.selectTags, tags[i].name)) {
                        tags[i].flag = true;
                      } else {
                        tags[i].flag = false;
                      }
                    }
                    that.setData({
                      tags: tags,
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
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
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

  },
  addSkill: function (e) {
    var that = this;
    var selectTags = that.data.selectTags;
    var tags = that.data.tags;
    if (!e.currentTarget.dataset.flag) {
      selectTags.push(e.currentTarget.dataset.selecttags);
      for (var i = 0; i < tags.length; i++) {
        if (util.contains(selectTags, tags[i].name)) {
          tags[i].flag = true;
        }
      }
      wx.request({
        url: 'https://resume.dreawer.com/updateTagUseCount',
        data: {
          name: e.currentTarget.dataset.selecttags,
          token: that.data.token
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        }, // 设置请求的 header
        success: function (res) {
          if (!res.data.status) {
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
      for (var i = 0; i < tags.length; i++) {
        if (tags[i].name == e.currentTarget.dataset.selecttags) {
          tags[i].flag = !tags[i].flag;
          break;
        }
      }
      for (var j = 0; j < selectTags.length; j++) {
        if (selectTags[j] == e.currentTarget.dataset.selecttags) {
          selectTags.splice(j, 1);
          break;
        }
      }
    }



    that.setData({
      selectTags: selectTags,
      tags: tags,
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      'userInfo.skill': selectTags.join('  '),
    })
    if (resumeId) {
      wx.request({
        url: 'https://resume.dreawer.com/editResume',
        data: {
          token: that.data.token,
          resumeId: that.data.resumeId,
          name: that.data.name,
          phoneNumber: that.data.phoneNumber,
          skill: selectTags.join('  '),
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        success: function (res) {
          // success
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
        }
      })
    }
  },
  addLabel: function () {
    var that = this;
    wx.hideKeyboard();
    var inputValue = that.data.inputValue;

    wx.request({
      url: 'https://resume.dreawer.com/addTag',
      data: {
        name: inputValue,
        token: that.data.token
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      }, // 设置请求的 header
      success: function (res) {
        if (res.data.status) {
          var addLabel = res.data.data.name;

          wx.request({
            url: 'https://resume.dreawer.com/addObjectTag',
            data: {
              name: inputValue,
              token: that.data.token,
              objectId: that.data.classifyId,
              objectCategory: 'SKILL',
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
              if (res.data.status) {
                var tags = that.data.tags;
                var selectTags = that.data.selectTags;
                tags.push({ 'name': inputValue, flag: true });
                selectTags.push(addLabel);
                that.setData({
                  placeholder: '',
                  tags: tags,
                  selectTags: selectTags,
                  suggestTags: [],
                  inputValue: '',
                })
                setTimeout(function () {
                  that.setData({
                    placeholder: '添加专业技能',
                  })
                }, 500)
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2];
                prevPage.setData({
                  'userInfo.skill': selectTags.join('  '),
                })
                if (resumeId) {
                  wx.request({
                    url: 'https://resume.dreawer.com/editResume',
                    data: {
                      token: that.data.token,
                      resumeId: that.data.resumeId,
                      name: that.data.name,
                      phoneNumber: that.data.phoneNumber,
                      skill: selectTags.join('  '),
                    },
                    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    header: {
                      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    },
                    success: function (res) {
                      // success
                    },
                    fail: function (res) {
                      // fail
                    },
                    complete: function (res) {
                      // complete
                    }
                  })
                }
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
  },
  bindKeyInput: function (e) {
    var that = this;
    if (that.data.inputValue != e.detail.value) {
      that.setData({
        inputValue: e.detail.value
      })
      wx.request({
        url: 'https://resume.dreawer.com/objectSuggest',
        data: {
          token: that.data.token,
          keywords: e.detail.value,
          objectId: that.data.classifyId,
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        success: function (res) {
          if (res.data.status) {
            that.setData({
              suggestTags: res.data.data,
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
    if (!that.data.inputValue) {
      that.setData({
        suggestTags: [],
      })
    }
  },
  addSuggest: function (e) {
    var that = this;
    var selectTags = that.data.selectTags;
    var tags = that.data.tags;
    selectTags.push(e.currentTarget.dataset.selecttags);
    that.setData({
      selectTags: util.pushArray(selectTags),
      suggestTags: [],
      inputValue: '',
    })
    for (var i = 0; i < tags.length; i++) {
      if (tags[i].name == e.currentTarget.dataset.selecttags) {
        tags[i].flag = true;
      }
    }
    that.setData({
      tags: tags,
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      'userInfo.skill': selectTags.join('  '),
    })
    if (resumeId) {
      wx.request({
        url: 'https://resume.dreawer.com/editResume',
        data: {
          token: that.data.token,
          resumeId: that.data.resumeId,
          name: that.data.name,
          phoneNumber: that.data.phoneNumber,
          skill: selectTags.join('  '),
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        success: function (res) {
          // success
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
        }
      })
    }
  },
})