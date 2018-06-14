var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    searchShow: false,
    searchValue: '',
    historyArray: [],
    noContent: false,
    hasContent: true,
    // isHidden:false,
    imgDetails: []
  },
  onLoad: function (options) {
    //首页图片(一图)
    var newsOneUrl = app.globalData.shopUrl + '/home/index/index/ty/imggg/gg/1';
    //首页图片(二图)
    var newsTwoUrl = app.globalData.shopUrl + '/home/index/index/ty/imggg/gg/2';
    //首页第二图(链接)
    var jumpUrl = app.globalData.shopUrl + '/home/index/index/ty/lianjie';
    //轮播图
    var swiperUrl = app.globalData.shopUrl + '/home/index/index/ty/imglun';
    //优惠券
    var couponUrl = app.globalData.shopUrl + '/home/index/index/ty/coupon';

    util.http(newsOneUrl, this.callback);
    util.http(newsTwoUrl, this.newsTwoCallback);
    util.http(jumpUrl, this.jumpCallBack);
    util.http(swiperUrl, this.swiperCallback);
    util.http(couponUrl, this.couponCallback);
  },
  onShow() {
    //获取用户id
    var uid = wx.getStorageSync('uid');
    this.setData({ uid });
    //新闻列表
    var newUrl = app.globalData.shopUrl + '/home/index/index/ty/new';
    util.http(newUrl, this.newCallback);
  },
  callback(res) {
    var datas = res.data.data.imggg[0];
    this.setData({ newsOneUrl: datas });
  },
  newsTwoCallback(res) {
    var datas = res.data.data.imggg[0];
    this.setData({ newsTwoUrl: datas });
  },
  jumpCallBack(res) {
    var datas = res.data.data.lianjie;
    console.log(datas);
    this.setData({ imgDetails: datas });
  },
  swiperCallback(res) {
    var datas = res.data.data.imglun;
    this.setData({ imgSrc: datas });
  },
  couponCallback(res) {
    var datas = res.data.data.coupon;
    this.setData({ coupon: datas });
  },
  newCallback(res) {
    if (res.data) {
      var datas = res.data.data.new;
      let noContent = this.data.noContent,
          hasContent = this.data.hasContent;
      this.setData({ noContent: false, hasContent: true, detailsList: datas });
    }
  },
  onBlur(event) {
    let val = event.detail.value;
    if (val !== '') {
      var historyUrl = app.globalData.shopUrl + '/home/sousuo/index/ty/xw/de/' + val + '/uid/' + this.data.uid;
      util.http(historyUrl, this.historycallback);
    }else{
      let noContent = this.data.noContent,
        hasContent = this.data.hasContent;
       this.setData({ noContent: false, hasContent: true });
    }
    this.setData({
      searchShow: false
    })
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
  onBindFocus() {
    //获取该用户搜索历史
    var searchHistoryUrl = app.globalData.shopUrl + '/Home/sousuo/index/ty/ls/uid/' + this.data.uid;
    util.http(searchHistoryUrl, this.searchHistoryCallback);
  },
  onCancelImgTap(event) {
    this.setData({
      searchShow: false,
      searchValue: ''
    })
    //新闻列表
    var newUrl = app.globalData.shopUrl + '/home/index/index/ty/new';
    util.http(newUrl, this.newCallback);
  },
  detailsPage: function (e) {
    var id = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: 'indexlist/indexlist?id=' + id,
    })
  },
  coupon(e) {
    //领取优惠券
    if (!this.data.uid) {
      util.showToast('请登录，登录后即可领取！', 'none');
    } else {
      var receiveCouponUrl = app.globalData.shopUrl + '/home/coupon/index/ty/js/uid/' + this.data.uid + '/cid/' + e.currentTarget.id;
      util.http(receiveCouponUrl, this.receiveCouponcallback);
    }
  },
  receiveCouponcallback(res) {
    if (res.data) {
      wx.showToast({
        title: '已领取成功！',
      })
    }
  },
  jump(e) {
    // var idx = e.currentTarget.dataset.idx;
    let src = e.currentTarget.dataset.src;
    let idx=src.slice(-1);
    wx.navigateTo({
      url: '../find/news/newslist/newslist?id=' + idx
    })
  },
  //搜索
  historycallback(res) {
    if (res.data.data.new.length !== 0) {
      var newsArray = res.data.data.new;
      this.setData({ detailsList: newsArray });
    } else {
      let noContent = this.data.noContent,
        hasContent = this.data.hasContent;
      this.setData({ noContent: true, hasContent: false });
    }
  }
})