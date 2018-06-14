//app.js
App({
  onLaunch: function () {
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: 'https://mypro.51cmo.net/home/loginWx/index',
            method: 'POST',
            data: {
              code: res.code
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              var openid = res.data.openid;
              //设置用户id缓存
              wx.setStorageSync('openid', openid)
            },
            fail: function (res) {
              // console.log(res.data);
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });

  },
  globalData: {
    shopUrl: 'https://mypro.51cmo.net',
    //shopUrl:'http://192.168.11.240/Atdzx/xcx',
    userInfo: null
  },
  //设置当前显示标题
  setTitle: function (currentArray, currentIndex) {
    var currentTitle = currentArray[currentIndex];
    wx.setNavigationBarTitle({
      title: currentTitle
    })
  },
  prevData: function (status) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      invoiceStatus: status
    })
    wx.navigateBack();
  },
  //用户模态框提示
  showModal: function (titles, content) {
    wx.showModal({
      title: titles,
      content: content,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //用户加载提示
  showToast: function (titles, icon) {
    wx.showToast({
      title: titles,
      icon: icon,
      duration: 1500
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口  
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  }
})