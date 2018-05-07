
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yzm: false,
    yzmText: "获取验证码",
    agree: true,
    registerBtn: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '修改密码',
    })
  },

  // 获取验证码
  onyzm() {
    clearInterval(interval);
    wx.showToast({
      title: '验证码已发送',
    });
    var that = this;
    var time = Math.floor(new Date().getTime() / 1000) + 60
    var time2 = Math.floor(new Date().getTime() / 1000)
    var timer;
    var interval = setInterval(function () {
      timer = time - Math.floor(new Date().getTime() / 1000)
      that.setData({
        yzmText: timer + ' s',
        yzm: true,
      })
      if (timer < 0) {
        that.setData({
          yzm: false,
          yzmText: "获取验证码",
        })
        clearInterval(interval);
      }
    }, 1000)



  },
  onagree() {
    if (this.data.agree) {
      this.setData({
        agree: false,
        registerBtn: true
      })
    } else {
      this.setData({
        agree: true,
        registerBtn: false
      })
    }
  }


})