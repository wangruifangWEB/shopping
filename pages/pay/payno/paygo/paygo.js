var app = getApp();
var util = require('../../../../utils/util.js');
Page({
  data: {
    choicedType: '不开发票'
  },
  onLoad: function (options) {
    var uid = wx.getStorageSync('uid');
    var oid = options.oid;
    //获取openid
    var openid = wx.getStorageSync('openid');
    this.setData({ uid, oid, openid});
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
    //调取支付弹框
    var payMoneyUrl = app.globalData.shopUrl + '/home/wxzf/index/openid/' + this.data.openid + '/oid/' + this.data.orderId + '/free/' + this.data.payPrice;
    console.log(payMoneyUrl);
    util.http(payMoneyUrl, this.payMoneycallback);
  },
  payMoneycallback(res) {
    console.log(res);
    //取出支付所需变量
    let nonceStr = res.data.nonceStr,
        appId = res.data.appid,
        pkg = res.data.package,
        timeStamp = res.data.timeStamp,
        paySign = res.data.paySign,
        sign = res.data.signType,
        orderId = this.data.orderId,
        that = this;
    //调用支付方法
    wx.requestPayment({
      timeStamp: timeStamp,
      nonceStr: nonceStr,
      package: pkg,
      signType: sign,
      paySign: paySign,
      success: function (res) {
        console.log(res);
        //给后台返回支付成功结果，修改订单状态
        that.changeOrderIdPay(orderId);
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  changeOrderIdPay(orderId) {
    //调取支付弹框
    var payedUrl = app.globalData.shopUrl + "/home/wxzf/wxdd/oid/" + orderId + '/wc/1';
    console.log(payedUrl)
    utils.http(payedUrl, this.payedcallback);
  },
  payedcallback(res) {
    console.log(res)
   if(res.data){
    wx.showModal({
      title: '支付成功!',
      content: '点击确定, 去待发货中查看！',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../../pay/pays/pays?currentIdx=1',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   }
  },
  callback(res) {
    //获取用户商品信息
    let payGoods = res.data.data.ord,
        totalPrice = this.data.totalPrice,
        payPrice = this.data.payPrice,
        couponPrice = this.data.couponPrice,
        orderId = payGoods.orderh;
        totalPrice = Number(payGoods.yuanjia) * payGoods.num;
        payPrice = Number(payGoods.zhejia) * payGoods.num;
        couponPrice = totalPrice - payPrice;
        payPrice = payPrice + Number(payGoods.yunfei);
        this.setData({ payGoods, totalPrice, payPrice, couponPrice, orderId});
  },
  invoiceSelection(e) {
    wx.navigateTo({
      url: '../../../invoice/invoiceMsg/invoiceMsg?oid=' + this.data.oid,
    })
  }
})