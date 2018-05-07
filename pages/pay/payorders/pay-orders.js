var app = getApp();
var utils = require('../../../utils/util.js');
Page({
  data: {
    addressPrice: 10,
    couponPrice: 2,
    totalPrice: 0,
    choicedType: '不开发票',
    leavingFocus: false
  },
  onLoad: function (options) {
    //获取上个页面传值
    this.setData({ uid: options.uid, num: options.goodsCount, aid: options.aid });
    //根据是否有更换地址做页面更新
    var url = app.globalData.shopUrl + '/home/order/index/ty/ooa/uid/' + this.data.uid + '/gid/' + this.data.aid + '/num/' + this.data.num;
    utils.http(url, this.callback);
  },
  onShow() {
    var addressModifyUrl = app.globalData.shopUrl + '/home/order/index/ty/oo/uid/' + this.data.uid + '/gid/' + this.data.aid;
    utils.http(addressModifyUrl, this.addressModifycallback);
  },
  // 支付
  onPay() {
    console.log('支付');
    var payUrl = app.globalData.shopUrl + '/home/order/index/ty/ooa/uid/' + this.data.uid + '/gid/' + this.data.aid + '/num/' + this.data.num + '/liuyan/' + this.data.leavingMsg;
    utils.http(payUrl, this.paycallback);

    wx.requestPayment({
      'timeStamp': '',
      'nonceStr': '',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success': function (res) {
      },
      'fail': function (res) {

      }
    })
  },
  //发票选择
  invoiceSelection(e) {
    wx.navigateTo({
      url: '../../invoice/invoiceMsg/invoiceMsg?oid='+e.currentTarget.dataset.oid,
    })
  },
  callback(res) {
    if (res.data) {
      var goodsDetailsUrl = app.globalData.shopUrl + '/home/order/index/ty/oo/uid/' + this.data.uid + '/gid/' + this.data.aid;
      utils.http(goodsDetailsUrl, this.goodsDetailscallback);
    }
  },
  goodsDetailscallback(res) {
    //获取用户商品信息
    var goodsDetails = res.data.data.ord;
    let totalPrice = this.data.num * goodsDetails.shop[0].zhejia;
    this.setData({ goodsDetails, totalPrice });
  },
  //选择地址
  choiceAddress(e) {
    wx.navigateTo({
      url: '../../admin/address/choose/choose?oid=' + e.currentTarget.dataset.idx,
    })
  },
  addresscallback(res) {
    if (res.data) {
      var addressId = wx.getStorageSync('addressId');
      var addressUrl = app.globalData.shopUrl + '/home/order/index/ty/oou/uid/' + this.data.uid + '/did/' + addressId + '/oid/' + this.data.aid;
      utils.http(addressUrl, this.addresscallback);
    } else {
      utils.showToast('网络错误,请重试!', 'none');
    }
  },
  leavingMsg() {
    this.setData({ leavingFocus: true });
  },
  leavingChange(e) {
    var leavingMsg = e.detail.value;
    this.setData({ leavingMsg });
    var leavingMsgUrl = app.globalData.shopUrl + '/home/order/index/ty/oou_l/uid/' + this.data.uid + '/oid/' + this.data.aid + '/liuyan/' + leavingMsg;
    console.log('提交订单：' + leavingMsgUrl);
    utils.http(leavingMsgUrl, this.leavingMsgcallback);
  },
  leavingMsgcallback(res) {
    if (res.data) {
      console.log('修改留言成功！');
    }
  },
  paycallback(res) {
    if (res.data) {
      console.log('用户信息提交成功');
    }
  },
  addressModifycallback(res) {
    var modifyAddress = res.data.data.ord;
    this.setData({ goodsDetails: modifyAddress});
  }
})