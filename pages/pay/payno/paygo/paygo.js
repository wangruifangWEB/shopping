var app = getApp();
var util = require('../../../../utils/util.js');
Page({
  data: {
    choicedType: '不开发票',
    hiddenLoading: false
  },
  onLoad: function (options) {
    var uid = wx.getStorageSync('uid');
    var oid = options.oid;
    //获取openid
    var openid = wx.getStorageSync('openid');
    this.setData({ uid, oid, openid});
    var url = app.globalData.shopUrl + '/home/dfk/index/ty/oo/uid/' + uid + '/oid/' + oid;
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
    util.http(payMoneyUrl, this.payMoneycallback);
  },
  payMoneycallback(res) {
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
    utils.http(payedUrl, this.payedcallback);
  },
  payedcallback(res) {
   if(res.data){
     utils.showTitle('支付成功!', '点击确定, 去待发货中查看', '../../pay/pays/pays?currentIdx=1');
   } else {
     app.showToast('网络错误，请重试！', 'error');
   }
  },
  callback(res) {
    if(res.data){
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
         
      this.setData({ hiddenLoading:true,payGoods, totalPrice, payPrice, couponPrice, orderId });
    } else {
      app.showToast('网络错误，请重试！', 'error');
    }
  },
  invoiceSelection(e) {
    wx.navigateTo({
      url: '../../../invoice/invoiceMsg/invoiceMsg?oid=' + this.data.oid,
    })
  }
})