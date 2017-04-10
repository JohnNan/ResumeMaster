// pages/timepicker/timepicker.js
Page({
  data: {
    startTxt: "入学时间",
    endTxt: "毕业时间",
    start: "请选择",
    end: "请选择",
    index: ''
  },
  startDateChange: function (e) {

    this.setData({
      start: e.detail.value
    })
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    if (this.data.type === 'study') {
      this.setData({
        end: parseInt(e.detail.value) + this.data.addYear + ""
      })
      console.info(prevPage);
      prevPage.data.educations[this.data.index].time = e.detail.value + "至" + (parseInt(e.detail.value) + this.data.addYear);
      prevPage.setData({
        educations: prevPage.data.educations
      })
    } else {
      prevPage.data.works[this.data.index].time = e.detail.value;
      prevPage.setData({
        works: prevPage.data.works
      })
    }

  },
  endDateChange: function (e) {
    this.setData({
      end: e.detail.value
    })
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    if (this.data.type === 'study') {
      // console.info(prevPage.data.educations[this.data.index].time.substr(0, 5));
      prevPage.data.educations[this.data.index].time = prevPage.data.educations[this.data.index].time.substr(0, 5).replace("至", '') + "至" + e.detail.value;
      prevPage.setData({
        educations: prevPage.data.educations
      })
    } else {
      prevPage.data.works[this.data.index].time = prevPage.data.works[this.data.index].time.replace("至", '') + "至" + e.detail.value;
      prevPage.setData({
        works: prevPage.data.works
      })
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    //SetToday
    let date = new Date();
    console.log(date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate())
    // this.setData({
    //   today: date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate()
    // })
    if (options.time) {
      this.setData({
        start: options.time.substring(0, options.time.indexOf('至')) ? options.time.substring(0, options.time.indexOf('至')) : '请选择',
        end: options.time.substr((options.time.indexOf('至') + 1)).replace("至", '') ? options.time.substr((options.time.indexOf('至') + 1)).replace("至", '') : '请选择'
      })
    } else {
      this.setData({
        start: '请选择',
        end: "请选择"
      })
    }

    let addYear;
    switch (options.edu) {
      case '专科': addYear = 2; break;
      case '本科': addYear = 4; break;
      case '硕士': addYear = 6; break;
      case '博士': addYear = 8; break;
    }
    this.setData({
      index: options.index,
      type: options.type,
      addYear: addYear ? addYear : 0
    })
    if (options.type != 'study') {
      this.setData({
        startTxt: "入职时间",
        endTxt: "离职时间",
        today: date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate()
      })
    } else {
      this.setData({
        today: date.getFullYear()
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
  }
})