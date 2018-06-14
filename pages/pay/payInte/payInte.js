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
    //获取openid
    var openid = wx.getStorageSync('openid');
    //获取传值之用户所选支付方式
    let payMethod = Number(options.payMethod) + 1;
    //获取缓存值
    var uid = wx.getStorageSync('uid');
    //设置各个所需参数
    this.setData({ uid: uid, num: options.goodsCount, gid: options.aid, payMethod, jjq: options.jjq, openid });
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
    //获取地址状态值判断选择提示/内容
    var addressId = wx.getStorageSync('addressId');
    if (addressId) {
      this.setData({
        noAddress: false,
        hiddenAddress: true
      });
    } else {
      this.setData({
        noAddress: true,
        hiddenAddress: false
      });
    }

    this.setData({ addressId });
  },
  // 立即兑换
  onBuyNow(e) {
    if (!this.data.addressId) {
      utils.showToast('请添加收货地址！', 'none');
    } else {
      //根据支付方式走不同接口
      if (this.data.payMethod == 1) {
        var buyUrl = app.globalData.shopUrl + '/home/jifen/index/ty/dh/uid/' + this.data.uid + '/gid/' + +this.data.gid;
        utils.http(buyUrl, this.onbuyNowcallback);
      } else {
        //积分+钱的支付方式接口
        //调取支付弹框
        var payMoneyUrl = app.globalData.shopUrl + '/home/wxzf/index/openid/' + this.data.openid + '/oid/' + this.data.orderId + '/free/' + this.data.payPrice;
        utils.http(payMoneyUrl, this.payMoneycallback);
      }
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
    var payedUrl = app.globalData.shopUrl + "/home/wxzf/wxdd/oid/" + orderId + '/wc/1' + '/uid/' + this.data.uid + '/zt/' + this.data.payMethod + '/ztjs/' + this.data.jjq;
    utils.http(payedUrl, this.payedcallback);
  },
  payedcallback(res) {
    if (res.data) {
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
      var payGoodsUrl = app.globalData.shopUrl + '/home/order/index/ty/oo/uid/' + this.data.uid + '/gid/' + this.data.gid + '/zt/' + this.data.payMethod;
      utils.http(payGoodsUrl, this.payGoodscallback);
    }
  },
  payGoodscallback(res) {
    if (res.data) {
      //获取用户商品信息
      let payGoods = res.data.data.ord,
          totalPrice = this.data.totalPrice,
          payPrice = this.data.payPrice,
          couponPrice = this.data.couponPrice,
          orderId = payGoods.orderh;
      //计算应付金额
          totalPrice = payGoods.shop[0].yuanjia;
      //根据支付方式计算所应付金额
      if (this.data.payMethod == 1) {
          payPrice = Number(payGoods.yunfei);
      } else if (this.data.payMethod == 2) {
          payPrice = Number(payGoods.shop[0].jjq_q) + Number(payGoods.yunfei);
      } else {
          payPrice = Number(payGoods.shop[0].zhejia) + Number(payGoods.yunfei);
      }
      couponPrice = Number(payGoods.shop[0].yuanjia) - Number(payGoods.shop[0].zhejia);
      this.setData({ hiddenLoading: true, payGoods, totalPrice, payPrice, couponPrice, orderId });
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
    //获取留言内容
    var leavingMsg = e.detail.value;
    this.setData({ leavingMsg });
    //提交订单
    var leavingMsgUrl = app.globalData.shopUrl + '/home/order/index/ty/oou_l/uid/' + this.data.uid + '/oid/' + this.data.gid + '/liuyan/' + leavingMsg;
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
  },
  onbuyNowcallback(res) {
    var integartionStatus = res.data;
    if (integartionStatus == 1) {
      //加入订单
      var orderUrl = app.globalData.shopUrl + '/home/jifen/index/ty/ooa/uid/' + this.data.uid + '/gid/' + this.data.gid;
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