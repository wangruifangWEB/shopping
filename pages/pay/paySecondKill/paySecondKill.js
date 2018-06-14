var app = getApp();
var utils = require('../../../utils/util.js');
Page({
  data: {
    couponPrice: 0,
    totalPrice: 0,
    leavingFocus: false,
    payPrice: 0,
    choicedType: '不开发票',
    noAddress: false,
    hiddenAddress: true,
    hiddenLoading: false
  },
  onLoad: function (options) {
    //获取缓存值
    var uid = wx.getStorageSync('uid');
    //获取openid
    var openid = wx.getStorageSync('openid');
    //获取上个页面传值
    this.setData({ uid: uid, num: options.goodsCount, gid: options.aid, openid });
  },
  onShow() {
    //获取账单信息
    var url = app.globalData.shopUrl + '/home/order/index/ty/ooa/uid/' + this.data.uid + '/gid/' + this.data.gid + '/num/' + this.data.num;
    utils.http(url, this.callback);

    //获取发票状态值
    var choicedType = wx.getStorageSync('choicedType');
    if (choicedType) {
      this.setData({ choicedType });
    }
    var addressId = wx.getStorageSync('addressId');
    if (!addressId) {
      this.setData({ noAddress: true, hiddenAddress: false });
    } else {
      this.setData({ noAddress: false, hiddenAddress: true });
    }
    this.setData({ addressId });
  },
  // 支付
  onPay() {
    if (!this.data.addressId) {
      utils.showToast('请添加收货地址！', 'none');
    } else {
      //调取支付弹框
      var payMoneyUrl = app.globalData.shopUrl + '/home/wxzf/index/openid/' + this.data.openid + '/oid/' + this.data.orderId + '/free/' + this.data.payPrice;
       utils.http(payMoneyUrl, this.payMoneycallback);
    }
  },
  payMoneycallback(res) {
    //取出支付所需变量
    let nonceStr = res.data.nonceStr,
        appId = res.data.appid,
        pkg = res.data.package,
        timeStamp = res.data.timeStamp,
        paySign = res.data.paySign,
        sign = res.data.signType,
        orderId=this.data.orderId,
        that=this;
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
        fail:function(res){
          console.log(res);
        }
    })
  },
  changeOrderIdPay (orderId) {
    //调取支付弹框
    var payedUrl = app.globalData.shopUrl + "/home/wxzf/wxdd/oid/" + orderId + '/wc/1';
    utils.http(payedUrl, this.payedcallback);
  },
  payedcallback(res){
    if(res.data){
      utils.showTitle('支付成功!', '点击确定, 去待发货中查看！', '../../pay/pays/pays?currentIdx=1');
    }
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
  callback(res) {
    if (res.data) {
      var payGoodsUrl = app.globalData.shopUrl + '/home/order/index/ty/oo/uid/' + this.data.uid + '/gid/' + this.data.gid;
      utils.http(payGoodsUrl, this.payGoodscallback);
    }
  },
  payGoodscallback(res) {
    if(res.data){
      //获取用户商品信息
    let payGoods = res.data.data.ord,
        totalPrice = this.data.totalPrice,
        payPrice = this.data.payPrice,
        couponPrice = this.data.couponPrice,
        orderId = payGoods.orderh;

        console.log(payGoods);
      for (var i in payGoods.shop) {
        totalPrice = Number(payGoods.shop[i].yuanjia) * payGoods.num;
        payPrice = Number(payGoods.shop[i].zhejia) * payGoods.num;
        couponPrice = totalPrice - payPrice;
      }
      payPrice = payPrice + Number(payGoods.yunfei);
      this.setData({ hiddenLoading:true, payGoods, totalPrice, payPrice, couponPrice, orderId });
    } else {
      utils.showToast('网络出错，请检查网络!', 'none');
    }
  },
  addresscallback(res) {
    if (res.data) {
      var addressUrl = app.globalData.shopUrl + '/home/order/index/ty/oou/uid/' + this.data.uid + '/did/' + this.data.addressId + '/oid/' + this.data.gid;
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
    var leavingMsgUrl = app.globalData.shopUrl + '/home/order/index/ty/oou_l/uid/' + this.data.uid + '/oid/' + this.data.gid + '/liuyan/' + leavingMsg;
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
  modifyAddress() {
    let hiddenAddress, noAddress;
    //判定是否有收货地址
    noAddress = false;
    hiddenAddress = true;
    this.setData({
      noAddress,
      hiddenAddress
    });
  },
  //发票选择
  invoiceSelection(e) {
    wx.navigateTo({
      url: '../../invoice/invoiceMsg/invoiceMsg?oid=' + e.currentTarget.dataset.oid,
    })
  }
})