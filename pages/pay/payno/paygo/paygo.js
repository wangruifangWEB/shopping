var app = getApp();
var util = require('../../../../utils/util.js');
Page({
  data: {
    choicedType: '不开发票'
  },
  onLoad: function (options) {
    var uid = wx.getStorageSync('uid');
    var oid = options.oid;
   
    this.setData({ uid, oid });
    var url = app.globalData.shopUrl + '/home/dfk/index/ty/oo/uid/' + uid + '/oid/' + oid;
    console.log(url);
    util.http(url, this.callback);
  },
  onShow(){
    //获取发票状态值
    var choicedType = wx.getStorageSync('choicedType');
    if (choicedType) {
      this.setData({ choicedType });
    }
  },
  // 支付
  onPay() {
    console.log('支付');
    wx.requestPayment({
      'timeStamp': '',
      'nonceStr': '',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success': function (res) {
      },
      'fail': function (res) {
        wx.navigateTo({
          url: '../pay/payorders/pay-orders',
        })
      }
    })
  },
  callback(res) {
    //获取用户商品信息
    var payGoods = res.data.data.ord;
    console.log(payGoods);
    let totalPrice = this.data.totalPrice,
      payPrice = this.data.payPrice,
      couponPrice = this.data.couponPrice
      // orderId = payGoods.id;
      totalPrice = Number(payGoods.yuanjia) * payGoods.num;
      payPrice = Number(payGoods.zhejia) * payGoods.num;
      couponPrice = totalPrice - payPrice;
    payPrice = payPrice + Number(payGoods.yunfei);
    this.setData({ payGoods, totalPrice, payPrice, couponPrice });
  },
  invoiceSelection(e) {
    wx.navigateTo({
      url: '../../../invoice/invoiceMsg/invoiceMsg?oid=' + this.data.oid,
    })
  }
})