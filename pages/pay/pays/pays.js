var app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
    navbar: ['待付款', '待发货', '待收货', '已完成'],
    currentTab: 0
  },
  onLoad: function (options) {
    var that = this;
    //判断用户是否登录及获取所需缓存信息
    var uid = wx.getStorageSync('uid');
    var currentIdx = options.currentIdx;
    that.setData({ uid, currentTab: currentIdx });
    var typeNum = Number(currentIdx) + 1;
    var noPayUrl = app.globalData.shopUrl + '/home/fklx/index/ty/' + typeNum + '/uid/' + uid;
    util.http(noPayUrl, that.noPaycallback);
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    //点击切换更新当前显示标题
    app.setTitle(this.data.navbar, this.data.currentTab);
    var currentIdx = Number(e.currentTarget.dataset.idx)+1;
    var noPayUrl = app.globalData.shopUrl + '/home/fklx/index/ty/' + currentIdx + '/uid/' + this.data.uid;
    util.http(noPayUrl, this.noPaycallback);
  },
  onShow: function () {
    this.setData({
      currentTab: this.data.currentTab
    });
    //进入页面更新当前显示标题
    app.setTitle(this.data.navbar, this.data.currentTab);
  },
  //去付款
  onPayGo(e) {
    var orderId = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '../payno/paygo/paygo?orderId=' + orderId,
    })
  },
  sureGoods(e) {
    var oid=e.currentTarget.dataset.idx;
    var url = app.globalData.shopUrl + '/home/dfk/index/ty/ysh/uid/' + this.data.uid + '/oid/' +oid;
    util.http(url, this.sureGoodscallback);
  },
  noPaycallback(res) {
    var stayPayment = res.data.data;
    this.setData({ stayPayment });
  },
  sureGoodscallback(res){
    if(res.data){
      app.showToast('确认收货完成', 'success');
    }else{
      app.showToast('网络错误，请重试！', 'error');
    }
  }
})
