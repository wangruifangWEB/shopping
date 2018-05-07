var app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
    //付款内容循环
    payContact: [
      { 'id': 0, 'text': '待付款', 'img': '/images/my/1.png' },
      { 'id': 1, 'text': '待发货', 'img': '/images/my/2.png' },
      { 'id': 2, 'text': '待收货', 'img': '/images/my/3.png' },
      { 'id': 3, 'text': '已完成', 'img': '/images/my/4.png' }
    ],
    currentIdx: '',
    phoneNumber: '52342947'
  },
  onLoad: function (options) { },
  onShow: function () {
    var that = this;
    //判断用户是否登录
    var uid = wx.getStorageSync('uid');
    that.setData({ uid });
    if (uid) {
      //获取用户头像
      that.getUserInfo();
      //获取当前用户的展示信息
      var userUrl = app.globalData.shopUrl + '/home/user/index/ty/user/uid/' + uid;
      var cnumUrl = app.globalData.shopUrl + '/home/user/index/ty/cnum/uid/' + uid;

      util.http(cnumUrl, that.cnumCount);
      util.http(userUrl, that.userMsg);
    }
  },
  // 待付款
  onPays(e) {
    if (!this.data.uid) {
      util.showToast('请登录后查看！', 'none');
    } else {
      var currentIdx = e.target.dataset.idx;
      this.setData({ currentIdx });
      wx.navigateTo({
        url: '../../pay/pays/pays?currentIdx=' + currentIdx,
      })
    }
  },

  // 地址
  onAddress() {
    if (!this.data.uid) {
      util.showToast('请登录后查看！', 'none');
    } else {
      wx.navigateTo({
        url: '../../admin/address/choose/choose'
      })
    }
  },
  // 优惠券
  onCoupon() {
    wx.navigateTo({
      url: '../../coupon/coupon',
    })
  },
  // 积分
  onPoint() {
    if (!this.data.uid) {
      util.showToast('请登录后查看！', 'none');
    } else {
      wx.navigateTo({
        url: '../../find/shop/shop',
      })
    }
  },
  // 发票
  onInvoice() {
    var url = app.globalData.shopUrl + '/home/zpzz/index/ty/zp/uid/' + this.data.uid;
    util.http(url, this.callback);
  },
  // 客服
  calling() {
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNumber,
      success: function () {
        console.log("拨打电话成功！");
      },
      fail: function () {
        console.log("拨打电话失败！");
      }
    })
  },
  // 签到
  onSignIn() {
    if (!this.data.uid) {
      util.showToast('请登录后查看！', 'none');
    } else {
      wx.navigateTo({
        url: '../signin/signin',
      })
    }
  },
  //优惠券个数
  cnumCount(res) {
    var coupon = res.data.data.coupon;
    this.setData({ coupon });
  },
  //钱包余额及会员积分
  userMsg(res) {
    var userMsg = res.data.data.user[0];
    let vip = '';
    if (userMsg.vip == 0) {
      vip = '临时会员'
    } else {
      vip = '正式会员'
    }
    this.setData({ userMsg, vip });
  },
  getUserInfo() {
    var that = this
    _getUserInfo();
    function _getUserInfo() {
      wx.getUserInfo({
        success: function (res) {
          that.setData({
            userInfo: res.userInfo
          })
          that.update()
        }
      })
    }
  },
  callback(res) {
    console.log(res);
    if (!this.data.uid) {
      util.showToast('请登录后查看！', 'none');
    } else {
      if (!res.data) {
        wx.navigateTo({
          url: '../../invoice/addingTicket/addingTicket'
        })
      } else {
        var invoiceMsg = res.data.data.zpzz[0];
        wx.setStorageSync('invoiceMsg', invoiceMsg)
        wx.navigateTo({
          url: '../../invoice/showTicket/showTicket'
        })
      }
    }
  }
})