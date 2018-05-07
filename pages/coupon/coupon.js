var app = getApp();
var utils = require('../../utils/util.js');
Page({
  data: {
    tabbar: ['可用优惠券', '历史优惠券'],
    currentIdx: 0,
  },
  onLoad: function (options) {
    var uid = wx.getStorageSync('uid');
    var couponUrl = app.globalData.shopUrl + '/home/coupon/index/ty/coupon/uid/' + uid;
    var oldCouponUrl = app.globalData.shopUrl + '/home/coupon/index/ty/coug/uid/' + uid; 
    utils.http(couponUrl, this.callback);
    utils.http(oldCouponUrl, this.oldCouponcallback);
  },
  barClick(e) {
    this.setData({
      currentIdx: e.currentTarget.id
    });
  },
  callback(res) {
    var couponList = res.data.data;
    this.setData({ couponList });
  },
  oldCouponcallback(res){
    var historyCouponList = res.data.data;
    this.setData({ historyCouponList });
  }
})