var app = getApp();
var utils = require('../../utils/util.js');
Page({
  data: {
    searchShow: false,
    searchValue: '',
    historyArray2: [],
  },
  onLoad: function (options) {
    //判断用户是否登录
    var uid = wx.getStorageSync('uid');
    this.setData({ uid });
    //商品列表
    var url = app.globalData.shopUrl + '/home/goods/index/ty/shop';
    utils.http(url, this.callback);
    //轮播图
    var swiperUrl = app.globalData.shopUrl + '/home/index/index/ty/imglun';
    utils.http(swiperUrl, this.swiperCallback);
    //获取用户名称
    this.getUserInfo();
  },
  onShow() {
    //获取当前用户的展示信息
    var userUrl = app.globalData.shopUrl + '/home/user/index/ty/user/uid/' + this.data.uid;
    utils.http(userUrl, this.userMsg);
  },
  callback(res) {
    var listGoods = res.data.data.goods;
    this.setData({ listGoods });
  },
  onOneShop(e) {
    let id = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '../goods/goods?id=' + id,
    })
  },
  signin() {
    wx.navigateTo({
      url: '../admin/signin/signin',
    })
  },
  coupon() {
    wx.navigateTo({
      url: '../coupon/coupon',
    })
  },
  shop() {
    if(!this.data.uid){
      utils.showToast('登录后即可查看!', 'none');
    }else{
      wx.navigateTo({
        url: '../find/shop/shop',
      })
    } 
  },
  //轮播图
  swiperCallback(res) {
    var imgSrc = res.data.data.imglun;
    this.setData({ imgSrc });
  },
  userLogin() {
    //设置缓存记录未登录状态
    wx.setStorageSync('uid', '');
    wx.navigateTo({
      url: '../login/log/log',
    })
  },
  onBlur(event) {
    let val = event.detail.value;
    var historyUrl = app.globalData.shopUrl + '/home/sousuo/index/ty/sp/de/' + val;
    utils.http(historyUrl, this.historycallback);
    let history2;
    history2 = this.data.historyArray2;
    history2.push(val);
    wx.setStorageSync('history2', history2)
    this.setData({
      searchShow: false
    })
    this.onHistoryArray();
  },
  onBindFocus() {
    this.setData({
      searchShow: true,
      searchValue: ''
    })
  },
  onCancelImgTap(event) {
    this.setData({
      searchShow: false,
      searchValue: ''
    })
  },
  onHistoryArray() {
    let that = this;
    that.data.historyArray2 = wx.getStorageSync('history2');
    let length = that.data.historyArray2.length;
    for (let i = 0; i < length; i++) {
      if ('' == that.data.historyArray2[i]) {
        that.data.historyArray2.splice(i, 1)
      }
    }
    that.setData({
      historyArray: that.data.historyArray2
    })
  },
  //搜索
  historycallback(res) {
    var newsArray = res.data.data.shop;
    this.setData({ listGoods: newsArray });
  },
  //钱包余额及会员积分
  userMsg(res) {
    var userMsg = res.data.data.user[0];
    this.setData({ userMsg });
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
})