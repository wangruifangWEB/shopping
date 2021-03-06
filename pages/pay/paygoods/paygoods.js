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
    hiddenLoading:false
  },
  onLoad: function (options) {
    //获取缓存值
    var uid = wx.getStorageSync('uid');
    //获取上个页面传值
    this.setData({ uid: uid, num: options.goodsCount, gid: options.aid });
    //获取账单信息
    var url = app.globalData.shopUrl + '/home/order/index/ty/ooa/uid/' + uid + '/gid/' + this.data.gid + '/num/' + this.data.num;
    utils.http(url, this.callback);
  },
  onShow() {
    //获取发票状态值
    var choicedType = wx.getStorageSync('choicedType');
    if (choicedType) {
      this.setData({ choicedType });
    }
    var addressId = wx.getStorageSync('addressId');
    if (addressId) {
      //获取账单信息
      this.modifyAddress();
    } else {
      this.setData({ noAddress: true, hiddenAddress: false });
    }
    this.setData({ addressId });
  },
  // 立即兑换
  onBuyNow(e) {
    if (!this.data.addressId) {
      utils.showToast('请添加收货地址！', 'none');
    } else {
      var buyUrl = app.globalData.shopUrl + '/home/jifen/index/ty/dh/uid/' + this.data.uid + '/gid/' + +this.data.gid;
      utils.http(buyUrl, this.onbuyNowcallback);
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
        couponPrice = this.data.couponPrice;

      for (var i in payGoods.shop) {
        totalPrice = Number(payGoods.shop[i].yuanjia) * payGoods.num;
        payPrice = Number(payGoods.shop[i].zhejia) * payGoods.num;
        couponPrice = totalPrice - payPrice;
      }
      payPrice = payPrice + Number(payGoods.yunfei);
      this.setData({ hiddenLoading: true, payGoods, totalPrice, payPrice, couponPrice });
    } else {
      utils.showToast('网络错误,请重试!', 'none');
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
    var address = wx.getStorageSync('address')
    let userName, userTel, userSheng,
      userShi, userXian, userDizhi,
      hiddenAddress, noAddress;
      //判定是否有收货地址
      noAddress = false;
      hiddenAddress = true;
      this.setData({
        noAddress,
        hiddenAddress,
        userName: address.name,
        userTel: address.tel,
        userSheng: address.sheng,
        userShi: address.shi,
        userXian: address.xian,
        userDizhi: address.dizhi,
      });
  },
  //发票选择
  invoiceSelection(e) {
    wx.navigateTo({
      url: '../../invoice/invoiceMsg/invoiceMsg?oid=' + e.currentTarget.dataset.oid,
    })
  },
  onbuyNowcallback(res) {
    var integartionStatus = res.data;
    if (integartionStatus == 1) {
      //加入订单
      var orderUrl=app.globalData.shopUrl+'/home/jifen/index/ty/ooa/uid/'+this.data.uid+'/gid/' +this.data.gid;
      utils.http(orderUrl, this.ordercallback);

    } else if (integartionStatus == '积分不够') {

      utils.showToast('积分不够兑换该商品!', 'none');

    } else {
      utils.showToast('网络错误，请重试！', 'none');
    }
  },
  ordercallback(res) {
    if (res.data) {
      utils.showTitle('兑换成功!', '点击确定, 去待收货中查看！', '../../pay/pays/pays?currentIdx=2');
    } else {
      utils.showToast('网络错误，请重试！', 'none');
    }
  },
})