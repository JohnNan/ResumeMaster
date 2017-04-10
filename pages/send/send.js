// pages/selfdescription/selfdescription.js
Page({
    data: {
    },
    onLoad: function (options) {

        this.setData({
            resumeId: options.resumeId
        })
        let _this = this;
        wx.getStorage({
            key: 'token',
            success: function (res) {
                _this.setData({
                    token: res.data
                });
                wx.request({
                    url: 'https://resume.dreawer.com/myResume?token=' + res.data,
                    data: {},
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    success: function (res) {
                        // success
                        _this.setData({
                            resume:res.data.data.resume
                        })

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
    emailChange: function (e) {
        this.setData({
            email: e.detail.value
        })
    },
    doPost: function () {
        let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if (!reg.test(this.data.email)) {
            wx.showModal({
                title: "提示",
                content: "请输入正确邮箱",
                showCancel: false
            })
            return;
        }
        let _this = this;
        wx.showLoading({
            title: "请稍后"
        })
        wx.request({
            url: 'https://resume.dreawer.com/sendEmail?token=' + _this.data.token,
            data: {
                title: "A Resume From MasterResume - Dreawer",
                email: _this.data.email,
                id: this.data.resumeId
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }, // 设置请求的 header
            success: function (res) {
                // success
                wx.showToast({
                    title: "发送成功!",
                    icon: "success",
                    success: () => {
                        setTimeout(() => {
                            wx.navigateBack();
                        }, 2000)
                    }
                });

            },
            fail: function (res) {
                // fail
            },
            complete: function (res) {
                // complete
                wx.hideLoading();
                _this.setData({
                    showMask: "none"
                })
            }
        })
    }
})