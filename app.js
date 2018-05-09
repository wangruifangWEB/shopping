//app.js
App({
  onLaunch: function () {
    //获取购物车商品
    let that = this;
    wx.getStorage({
      key: 'cartBus',
      success: function (res) {
       return
      },
      fail: function (res) {
        wx.setStorage({
          key: 'cartBus',
          data: that.globalData.cartBus,
        })
      }
    });
   
    // wx.getSetting({
    //   success(res) {
    //     console.log(res)
    //     if (!res.authSetting['scope.userInfo']) {
    //       wx.authorize({
    //         scope: 'scope.userInfo',
    //         success() {
    //           console.log("获取成功")
    //         },
    //         fail() {
    //           console.log("获取失败")
    //         }
    //       })
    //     }
    //   }
    // })
    // //获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  //设置当前显示标题
  setTitle: function (currentArray,currentIndex){
    var currentTitle = currentArray[currentIndex];
    wx.setNavigationBarTitle({
      title: currentTitle
    })
  },
  prevData: function (status){
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
  showModal:function (titles, content) {
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
showToast:function (titles, icon) {
    wx.showToast({
      title: titles,
      icon: icon,
      duration: 1500
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },
  globalData: {
    shopUrl: 'http://mypro.51cmo.net',
    // shopUrl:'http://192.168.11.240/Atdzx/xcx',
    appid: 'wx032a4e456c744881',
    secret:'f9c3ffd0d2cbcf1593576e3c8a38de5b',
    userInfo: null
  }
})