var app = getApp();
var util = require('../../../../utils/util.js');
Page({
  data: {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uid = wx.getStorageSync('uid');
    var orderId = options.orderId;
    this.setData({ uid,orderId });
    var url = app.globalData.shopUrl + '/home/dfk/index/ty/oo/uid/' + uid + '/oid/' + orderId;
    util.http(url,this.callback);
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
          url: '../payorders/pay-orders',
        })
      }
    })
  },
  callback(res){
    let orderMsg=res.data.data.ord;
    this.setData({ orderMsg});
    let ticket = orderMsg.fapiao;
    let choicedType='';
    if (!ticket){
      choicedType='不开发票'
    }else{
      choicedType = '开发票'
    }
    this.setData({ orderMsg, choicedType});
  },
  invoiceSelection(e){
    wx.navigateTo({
      url: '../../../invoice/invoiceMsg/invoiceMsg',
    })
  }
})