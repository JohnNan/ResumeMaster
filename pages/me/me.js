// pages/me/me.js
import util from "../../utils/util.js";
Page({
  data: {
    delBtnWidth: 375,//删除按钮宽度单位（rpx）
  },
  onLoad: function (options) {
    let _this = this;
    // 页面初始化 options为页面跳转所带来的参数
    console.info(util);
    wx.getStorage({
      key: "token",
      success: function (res) {
        _this.setData({
          token: res.data
        })
        wx.request({
          url: "https://resume.dreawer.com/myResume",
          data: {
            token: res.data
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res) {
              for (let i = 0; i < res.data.data.myResumes.length; i++) {
                console.log(res.data.data.myResumes[i].createTime);
                res.data.data.myResumes[i].createTime = util.formatTime(new Date(res.data.data.myResumes[i].createTime))
              }
            }
            _this.setData({
              resume: res.data.data.resume,//默认简历上面那个
              myResumes: res.data.data.myResumes,//我的简历，下面列表
              user: res.data.data.user
            })
          }
        })
        wx.request({
          url: 'https://resume.dreawer.com/getUserFavorites?token=' + res.data,
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
            console.info(idStr);
            // wx.request({
            //   url: 'https://resume.dreawer.com/myFavorite',
            //   data: {
            //     idList: idStr
            //   },
            //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            //   // header: {}, // 设置请求的 header
            //   success: function (res) {
            //     // success
            //     console.log(res);
            //     for (let i = 0; i < res.data.data.myFavoriteResumes.length; i++) {
            //       res.data.data.myFavoriteResumes[i].createTime
            //         = util.formatTime(new Date(res.data.data.myFavoriteResumes[i].createTime))
            //     }
            //     _this.setData({
            //       myFavoriteResumes: res.data.data.myFavoriteResumes
            //     })
            //   },
            //   fail: function (res) {
            //     // fail
            //     console.log(res);
            //   },
            //   complete: function () {
            //     // complete
            //   }
            // })
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
  //点击删除按钮事件
  delItem: function (e) {
    //获取列表中要删除项的下标
    var index = e.target.dataset.index;
    var list = this.data.list;
    //移除列表中下标为index的项
    list.splice(index, 1);
    //更新列表的状态
    this.setData({
      list: list
    });
  },
  showActionSheet: function (e) {
    console.info(e);
    let item = e.currentTarget.dataset.item;
    let token = this.data.token;
    let _this = this;
    wx.showActionSheet({
      itemList: ['设为默认', '删除'],
      success: function (e) {
        if (e.tapIndex === 0) {
          wx.request({
            url: 'https://resume.dreawer.com/setDefaultResume?token=' + token,
            data: {
              id: item.id
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            }, // 设置请求的 header
            success: function (res) {
              _this.onLoad();

            },
            fail: function () {
              // fail
            },
            complete: function () {
              // complete
            }
          })
        } else if (e.tapIndex === 1) {
          wx.request({
            url: 'https://resume.dreawer.com/deleteResume?token=' + token,
            data: {
              id: item.id
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            }, // 设置请求的 header
            success: function (res) {
              _this.onLoad();

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
      fail: function (e) {

      }
    })
  },
  goIndex: function (e) {
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },
  navigateToIndex: function (e) {
    wx.navigateTo({
      url: '/pages/index/index?id=' + e.currentTarget.dataset.rid
    })
  },
  goResumView: function (e) {
    console.log(e.currentTarget.dataset.rid);
    wx.navigateTo({
      url: '/pages/resumeview/resumeview?id=' + e.currentTarget.dataset.rid
    })
  },
  defaultResume: function (e) {
    console.info(e.currentTarget);
    let resumeId = e.currentTarget.dataset.id;
    let _this = this;
    wx.showActionSheet({
      itemList: ["投递"],
      success: function (e) {
        if (e.tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/send/send?resumeId=' + resumeId
          })
        } else if (e.tapIndex) {
          wx.showShareMenu({
            title: "我的" + _this.data.resume.name,
            path: '/pages/resumeview/resumeview?id=' + this.data.resume.id,
            success: function (res) {
              // 分享成功
            },
            fail: function (res) {
              // 分享失败
            }
          })
        }
      }

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