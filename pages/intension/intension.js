// pages/intension/intension.js
var util = require('../../utils/util.js')
Page({
  data: {
    selectTags: '',
    tags: [],
    placeholder: '输入求职意向'
  },
  onLoad: function (options) {
    var that = this;
    
    that.setData({
      token: wx.getStorageSync('token'),
    })

    var skill = options.selectTags;
    if (skill) {
      that.setData({
        selectTags: skill,
      })
    }
    wx.request({
      url: 'https://resume.dreawer.com/getParams',
      data: {
        category: 'POSITION',
        token: that.data.token,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
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
            var tags = res.data.data;
            for (var i = 0; i < tags.length; i++) {
              if (that.data.selectTags == tags[i].name) {
                tags[i].flag = true;
              } else {
                tags[i].flag = false;
              }
            }
            that.setData({
              tags: tags,
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
    // 页面关闭
  },
  addSkill: function (e) {
    var that = this;
    var selectTags = that.data.selectTags;
    var tags = that.data.tags;
    if (!e.currentTarget.dataset.flag) {
      selectTags = e.currentTarget.dataset.selecttags;
      for (var i = 0; i < tags.length; i++) {
        if (selectTags == tags[i].name) {
          tags[i].flag = true;
        } else {
          tags[i].flag = false;
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
      for (var i = 0; i < tags.length; i++) {
        if (tags[i].name == e.currentTarget.dataset.selecttags) {
          tags[i].flag = !tags[i].flag;
          break;
        }
      }
      selectTags = '';
    }



    that.setData({
      selectTags: selectTags,
      tags: tags,
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      'userInfo.position': selectTags,
    })
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
        var addLabel = res.data.data.name;
        wx.request({
          url: 'https://resume.dreawer.com/addObjectTag',
          data: {
            name: inputValue,
            token: that.data.token,
            objectId: that.data.classifyId,
            objectCategory: 'POSITION',
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function (res) {
            if (res.data.status) {
              var tags = that.data.tags;
              var selectTags = that.data.selectTags;
              tags.push({ 'name': inputValue, flag: true });
              selectTags = addLabel;
              for (var i = 0; i < tags.length; i++) {
                if (tags[i].name == selectTags) {
                  tags[i].flag = true;
                } else {
                  tags[i].flag = false;
                }
              }
              that.setData({
                placeholder: '',
                tags: tags,
                selectTags: selectTags,
                suggestTags: [],
                inputValue: '',
              })
              setTimeout(function () {
                that.setData({
                  placeholder: '输入求职意向',
                })
              }, 500)

              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];
              prevPage.setData({
                'userInfo.position': selectTags,
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
          that.setData({
            suggestTags: res.data.data,
          })
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
    selectTags = e.currentTarget.dataset.selecttags;
    that.setData({
      selectTags: selectTags,
      suggestTags: [],
      inputValue: '',
    })
    for (var i = 0; i < tags.length; i++) {
      if (tags[i].name == e.currentTarget.dataset.selecttags) {
        tags[i].flag = true;
      } else {
        tags[i].flag = false;
      }
    }
    that.setData({
      tags: tags,
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      'userInfo.position': selectTags,
    })
  },
})