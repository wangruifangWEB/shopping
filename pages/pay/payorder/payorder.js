var app = getApp();
var utils = require('../../../utils/util.js');
Page({
  data: {
    couponPrice: 0,
    totalPrice: 0,
    leavingFocus: false,
    payPrice: 0,
    choicedType: '不开发票',
    noAddress: false,  //地址不显示
    hiddenAddress:true
  },
  onLoad: function (options) {
    //获取缓存值
    var uid = wx.getStorageSync('uid');
    this.setData({ uid });
    //获取账单信息
    var orderUrl = app.globalData.shopUrl + '/home/caror/index/ty/oocx/uid/' + uid;
    utils.http(orderUrl, this.initOrdercallback);
  },
  onShow() {
    //获取发票状态值
    var choicedType = wx.getStorageSync('choicedType');
    this.setData({ choicedType });
    //获取账单信息
    var orderUrl = app.globalData.shopUrl + '/home/caror/index/ty/oocx/uid/' + this.data.uid;
    utils.http(orderUrl, this.ordercallback);
  },
  // 支付
  onPay() {
    console.log('支付');
    // var payUrl = app.globalData.shopUrl + '/home/order/index/ty/ooa/uid/' + this.data.uid + '/gid/' + this.data.aid + '/num/' + this.data.num + '/liuyan/' + this.data.leavingMsg;
    // utils.http(payUrl, this.paycallback);
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
      url: '../../invoice/invoiceMsg/invoiceMsg?oid=' + e.currentTarget.dataset.oid,
    })
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
    this.setData({ goodsDetails: modifyAddress });
  },
  ordercallback(res) {
    let did = res.data.data.ord.did;
    if (did == 0) {
      this.data.noAddress = true;
      this.data.hiddenAddress = false;
    } else {
      this.data.noAddress = false;
      this.data.hiddenAddress = true;
    }
    let payGoods = res.data.data.ord;
    this.setData({ payGoods });
  },
  //发票选择
  invoiceSelection(e) {
    wx.navigateTo({
      url: '../../invoice/invoiceMsg/invoiceMsg?oid=' + e.currentTarget.dataset.oid,
    })
  },
  //价格
  initOrdercallback(res) {
    let did = res.data.data.ord.did;
    if (did == 0) {
      this.data.noAddress = true;
      this.data.hiddenAddress=false;
    } else {
      this.data.noAddress = false;
      this.data.hiddenAddress=true;
    }
    let payGoods = res.data.data.ord;
    let totalPrice = this.data.totalPrice;
    let payPrice = this.data.payPrice;
    let couponPrice = this.data.couponPrice;
    for (var i in payGoods.shop) {
      totalPrice += Number(payGoods.shop[i].yuanjia);
      payPrice += Number(payGoods.shop[i].zhejia);
      couponPrice = totalPrice - payPrice;
    }
    payPrice = payPrice + Number(payGoods.yunfei);
    this.setData({ payGoods, totalPrice, payPrice, couponPrice });
  },
  //添加地址
  addAddress(){
    wx.navigateTo({
      url: '../../admin/address/add/add',
    })
  }
})