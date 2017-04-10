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
    naviFlag: true,
    maskFlag: false,
    animation: '',
    animation1: '',
    modelList: [],
    photo: '',
    showNav: "",
    favText: '收藏',
    domain:'https://resume.dreawer.com'
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      token: wx.getStorageSync('token'),
    })

    if (options.id && options.id != undefined) {
      this.setData({
        showNav: "none",
        id: options.id,
      })
      wx.setNavigationBarTitle({
        title: '我的收藏'
      })

      wx.request({
        url: 'https://resume.dreawer.com/getUserFavorites?token=' + that.data.token,
        method: 'GET',
        success: function (res) {
          if (res.data.status) {
            let idStr = "";
            for (let i = 0; i < res.data.data.length; i++) {
              if (i == res.data.data.length - 1) {
                idStr += res.data.data[i].contentId;
              } else {
                idStr += res.data.data[i].contentId + ",";
              }
            }
            console.info(idStr);
            if (idStr) {
              wx.request({
                url: 'https://resume.dreawer.com/myFavorite',
                data: {
                  token:that.data.token,
                  idList: idStr
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function (res) {
                  // success
                  console.log(res);
                  if (res.data.status) {
                    for (let i = 0; i < res.data.data.myFavoriteResumes.length; i++) {
                      res.data.data.myFavoriteResumes[i].createTime
                        = util.formatTime(new Date(res.data.data.myFavoriteResumes[i].createTime))
                      if (res.data.data.myFavoriteResumes[i].id == options.id) {
                        that.setData({
                          flag: i,
                          photo: res.data.data.myFavoriteResumes[i].photo,
                        })
                      }
                    }

                    var myFavoriteResumes = res.data.data.myFavoriteResumes;
                    for (var i = 0; i < myFavoriteResumes.length; i++) {
                      myFavoriteResumes[i].favo = true;
                      myFavoriteResumes[i].createTime = util.formatTime(new Date(myFavoriteResumes[i].createTime))
                    }

                    that.setData({
                      modelList: myFavoriteResumes,
                    })
                    if (myFavoriteResumes[that.data.flag].favo) {
                      that.setData({
                        favText: '取消',
                      })
                    } else {
                      that.setData({
                        favText: '收藏',
                      })
                    }
                  } else {
                    
                  }

                },
                fail: function (res) {
                  // fail
                  console.log(res);
                },
                complete: function () {
                  // complete
                }
              })
            }
          } else {
            
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
      wx.setNavigationBarTitle({
        title: '简历库'
      })
      wx.request({
        url: 'https://resume.dreawer.com/getModelList',
        data: {
          token:that.data.token,
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          if (res.data.status) {
            that.setData({
              modelList: res.data.data,
              id: res.data.data[0].id,
              photo: res.data.data[0].photo
            })

            wx.request({
              url: 'https://resume.dreawer.com/getUserFavorites?token=' + that.data.token,
              method: 'GET',
              success: function (res) {
                if (res.data.status) {
                  let idStr = "";
                  for (let i = 0; i < res.data.data.length; i++) {
                    if (i == res.data.data.length - 1) {
                      idStr += res.data.data[i].contentId;
                    } else {
                      idStr += res.data.data[i].contentId + ",";
                    }
                  }
                  console.info(idStr);
                  if (idStr) {
                    wx.request({
                      url: 'https://resume.dreawer.com/myFavorite',
                      data: {
                        token:that.data.token,
                        idList: idStr
                      },
                      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                      // header: {}, // 设置请求的 header
                      success: function (res) {
                        // success
                        console.log(res);
                        if (res.data.status) {
                          for (let i = 0; i < res.data.data.myFavoriteResumes.length; i++) {
                            res.data.data.myFavoriteResumes[i].createTime
                              = util.formatTime(new Date(res.data.data.myFavoriteResumes[i].createTime))
                          }

                          var modelList = that.data.modelList;
                          var myFavoriteResumes = res.data.data.myFavoriteResumes;
                          var array = [];
                          for (var i = 0; i < myFavoriteResumes.length; i++) {
                            array.push(myFavoriteResumes[i].id);
                            myFavoriteResumes[i].createTime = util.formatTime(new Date(myFavoriteResumes[i].createTime))
                          }
                          for (var j = 0; j < modelList.length; j++) {
                            if (util.contains(array, modelList[j].id)) {
                              modelList[j].favo = true;
                            } else {
                              modelList[j].favo = false;
                            }
                          }
                          that.setData({
                            modelList: modelList,
                            myFavoriteResumes: myFavoriteResumes,
                          })
                          if (modelList[that.data.flag].favo) {
                            that.setData({
                              favText: '取消',
                            })
                          } else {
                            that.setData({
                              favText: '收藏',
                            })
                          }
                        } else {
                          
                        }

                      },
                      fail: function (res) {
                        // fail
                        console.log(res);
                      },
                      complete: function () {
                        // complete
                      }
                    })
                  }
                } else {
                  
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
  },
  goMe: function () {
    wx.redirectTo({
      url: "/pages/me/me"
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
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    console.log(e)
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
      this.animation.height("332rpx").step();
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
    var that = this;
    that.setData({
      flag: e.currentTarget.dataset.resume,
      id: e.currentTarget.dataset.id,
      photo: e.currentTarget.dataset.photo,
    })
    console.log(e.currentTarget.dataset.resume);
    if (that.data.modelList[e.currentTarget.dataset.resume].favo) {
      that.setData({
        favText: '取消',
      })
    } else {
      that.setData({
        favText: '收藏',
      })
    }
  },
  goUse: function () {
    var that = this;

    wx.navigateTo({
      url: '/pages/information/information?type=true&id=' + that.data.id,
      success: function (res) {
        that.setData({
          naviFlag: false,
          maskFlag: false,
        })
        that.animation.height("0").step();
        that.animation1.bottom("50rpx").step();
        that.setData({
          animation: that.animation.export(),
          animation1: that.animation1.export(),
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
  goFavo: function (e) {
    var that = this;
    that.setData({
      naviFlag: false,
      maskFlag: false,
    })
    
    that.animation.height("0").step();
    that.animation1.bottom("50rpx").step();
    that.setData({
      animation: that.animation.export(),
      animation1: that.animation1.export(),
    })
    
    if (that.data.favText === '收藏') {
      wx.request({
        url: 'https://resume.dreawer.com/favorite?token=' + that.data.token,
        data: {
          objectId: that.data.id,
          category: "resume",
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        success: function (res) {
          if (res.data.status) {
            that.setData({
              favText: '取消'
            })
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 500
            })
          } else {
            
          }
        }
      })
    } else {
      wx.request({
        url: 'https://resume.dreawer.com/unfavorite?token=' + that.data.token,
        data: {
          objectId: that.data.id,
          category: "resume",
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        success: function (res) {
          if (res.data.status) {
            that.setData({
              favText: '收藏'
            })
            console.log('取消成功！');
            wx.showToast({
              title: '取消成功',
              icon: 'success',
              duration: 500
            })
          } else {
            
          }
        }
      })
    }
    var modelList = that.data.modelList;
    modelList[that.data.flag].favo = !modelList[that.data.flag].favo;
    that.setData({
      modelList: modelList,
    })
  },
})
