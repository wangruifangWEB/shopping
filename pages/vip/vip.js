var app = getApp();
var utils = require('../../utils/util.js');
Page({
  data: {
    searchShow: false,
    searchValue: '',
    historyArray2: [],
    noContent: false,
    hasContent: true,
    secondShop: []
  },
  onLoad: function (options) {
    //轮播图
    var swiperUrl = app.globalData.shopUrl + '/home/index/index/ty/imglun';
    utils.http(swiperUrl, this.swiperCallback);
    //秒杀商品
    var secondKillUrl = app.globalData.shopUrl + '/home/xsms/index/ty/msh';
    utils.http(secondKillUrl, this.secondKillcallback);
  },
  onShow() {
    var userInfo = wx.getStorageSync('user');
    this.setData({ userInfo });
    //商品列表
    var url = app.globalData.shopUrl + '/home/goods/index/ty/shop';
    utils.http(url, this.callback);
    //判断用户是否登录
    var uid = wx.getStorageSync('uid');
    this.setData({ uid });
    if (uid) {
      //获取当前用户的展示信息
      var userUrl = app.globalData.shopUrl + '/home/user/index/ty/user/uid/' + uid;
      utils.http(userUrl, this.userMsgcallback);
    }
  },
  callback(res) {
    if (res.data) {
      var listGoods = res.data.data.goods;
      let noContent = this.data.noContent,
        hasContent = this.data.hasContent;
      this.setData({ noContent: false, hasContent: true, listGoods });
    }
  },
  onOneShop(e) {
    let id = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '../goods/goods?id=' + id,
    })
  },
  signin() {
    if (!this.data.uid) {
      utils.showToast('请登录，登录后即可签到！', 'none');
    } else {
      wx.navigateTo({
        url: '../admin/signin/signin',
      })
    }
  },
  coupon() {
    wx.navigateTo({
      url: '../coupon/coupon',
    })
  },
  shop() {
    wx.navigateTo({
      url: '../find/shop/shop',
    })
  },
  //轮播图
  swiperCallback(res) {
    var imgSrc = res.data.data.imglun;
    this.setData({ imgSrc });
  },
  userLogin() {
    var that = this;
    wx.navigateTo({
      url: '../login/log/log',
    })
  },
  onBlur(event) {
    let val = event.detail.value;
    if (val !== '') {
      var historyUrl = app.globalData.shopUrl + '/home/sousuo/index/ty/sp/de/' + val;
      utils.http(historyUrl, this.historycallback);
    } else {
      let noContent = this.data.noContent,
        hasContent = this.data.hasContent;
      this.setData({ noContent: false, hasContent: true });
    }
    this.setData({
      searchShow: false
    })
  },
  onBindFocus() {
    //获取该用户搜索历史
    var searchHistoryUrl = app.globalData.shopUrl + '/Home/sousuo/index/ty/ls/uid/' + this.data.uid;
    utils.http(searchHistoryUrl, this.searchHistoryCallback);
  },
  //搜索历史
  searchHistoryCallback(res) {
    //获取到搜索关键词
    let datas = res.data.data.ls,
      historyArray = this.data.historyArray;
    //清空数组
    historyArray = [];
    //循环将搜索关键词push到数组
    for (let i = 0; i < datas.length; i++) {
      historyArray.push(datas[i].title);
    }
    this.setData({
      historyArray,
      searchShow: true,
      searchValue: ''
    })
  },
  onCancelImgTap(event) {
    this.setData({
      searchShow: false,
      searchValue: ''
    })
    //商品列表
    var url = app.globalData.shopUrl + '/home/goods/index/ty/shop';
    utils.http(url, this.callback);
  },
  //搜索
  historycallback(res) {
    if (res.data.data.shop.length !== 0) {
      var newsArray = res.data.data.shop;
      this.setData({ listGoods: newsArray });
    } else {
      let noContent = this.data.noContent,
        hasContent = this.data.hasContent;
      this.setData({ noContent: true, hasContent: false });
    }
  },
  //钱包余额及会员积分
  userMsgcallback(res) {
    var userMsg = res.data.data.user[0];
    this.setData({ userMsg });
  },
  //轮播图详情
  detailsPage: function (e) {
    var id = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '../index/indexlist/indexlist?id=' + id,
    })
  },
  //秒杀列表
  secondKillShop() {
    wx.navigateTo({
      url: '../find/secondKill/secondKill',
    })
  },
  //秒杀商品
  secondKillcallback(res) {
    let secondShop = res.data.data.xsms;
    secondShop=secondShop.slice(0, 3)
    this.setData({ secondShop });
  },
  //秒杀商品详情
  secondKillDetails(e){
    let id = e.currentTarget.dataset.idx;
    let endtime = e.currentTarget.dataset.endtime;
    wx.navigateTo({
      url: '../find/secondKillDetails/secondKillDetails?id=' + id + '&endtime=' + endtime,
    })
  }
})