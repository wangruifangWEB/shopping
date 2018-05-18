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
    hiddenAddress: true
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
    var addressId = wx.getStorageSync('addressId')
    if (addressId) {
      //获取账单信息
      this.modifyAddress();
    } else {
      this.setData({ noAddress: true, hiddenAddress: false });
    }
    this.setData({ addressId });
  },
  // 支付
  onPay() {
    if (!this.data.addressId) {
      utils.showToast('请添加收货地址！', 'none');
    } else {
      console.log('支付');
      var that = this;
      // 唤起授权
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            wx.authorize({
              scope: 'scope.userInfo',
              success() {
                wx.login({
                  success: function (res) {
                    var url = 'https://mypro.51cmo.net/home/loginWx/index' + res.code;
                    if (res.code) {
                      wx.request({
                        url: 'https://mypro.51cmo.net/home/loginWx/index',
                        method: 'POST',
                        data: {
                          code: res.code
                        },
                        header: {
                          "Content-Type": "application/x-www-form-urlencoded"
                        },
                        success: function (res) {
                          var openid = res.data.openid;
                          // console.log(openid);
                          that.orderChuli(that, openid);
                        },
                        fail: function (res) {
                          // console.log(res.data);
                        }
                      })
                    } else {
                      console.log('获取用户登录态失败！' + res.errMsg)
                    }
                  }
                })
              },
              fail() {
                console.log(fail);
              }
            })
          }
        }
      })
      wx.getSetting({
        success: (res) => {
          res.authSetting = {
            "scope.userInfo": true,
            "scope.userLocation": true
          }
        }
      })
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
    //获取用户商品信息
    var payGoods = res.data.data.ord;
    let totalPrice = this.data.totalPrice,
        payPrice = this.data.payPrice,
        couponPrice = this.data.couponPrice,
        orderId = payGoods.id;
    for (var i in payGoods.shop) {
      totalPrice = Number(payGoods.shop[i].yuanjia) * payGoods.num;
      payPrice = Number(payGoods.shop[i].zhejia) * payGoods.num;
      couponPrice = totalPrice - payPrice;
    }
    payPrice = payPrice + Number(payGoods.yunfei);
    this.setData({ payGoods, totalPrice, payPrice, couponPrice, orderId });
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
  orderChuli(that, openid) {
    let totalPrice = this.data.payPrice,
      orderId = this.data.orderId;
    console.log('totalPrice=>' + totalPrice);
    console.log('openid=>' + openid);
    wx.showModal({
      title: '提示',
      content: '确定提交订单？',
      success: function (res) { 
        if (res.confirm) {
          that.paypay(that, openid, totalPrice, orderId);//关键来啦，把openid和钱和订单走去支付啦！  
        }
      }
    })
  },
  paypay: function (that, openid, totalPrice, orderId) {
    wx.request({
      url: '',//后台接口
      data: {
        openid: openid,
        totalPrice: totalPrice
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res);
        var nonceStr = res.data.nonce_str;
        var appId = res.data.appid;
        var pkg = 'prepay_id=' + res.data.prepay_id;
        var timeStamp = res.data.timeStamp;
        var paySign = res.data.paySign;
        var sign = res.data.sign;
        //console.log(pkg);  
        wx.requestPayment({
          timeStamp: timeStamp,
          nonceStr: nonceStr,
          package: pkg,
          signType: 'MD5',
          paySign: paySign,
          success: function (res) {
            that.changeOrderIdPay(orderId);
          }
        })
      }
    });
  },
  changeOrderIdPay: function (orderId) {
    var url = "";
    wx.request({
      url: url,
      data: {
        orderId: orderId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log('changeOrderIdPay');
        // wx.clearStorage();
      }
    })
  }
})