var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    searchShow: false,
    searchValue: '',
    historyArray: [],
    noContent:false,
    hasContent:true,
    imgDetails: [
      {
        id: 0,
        url: '../find/news/newslist/newslist'
      },
      {
        id: 1,
        url: '../find/news/newslist/newslist'
      },
      {
        id: 2,
        url: '../find/news/newslist/newslist'
      },
      {
        id: 3,
        url: '../find/news/newslist/newslist'
      },
      {
        id: 4,
        url: '../admin/my/my'
      },
      {
        id: 5,
        url: '../admin/my/my'
      },
      {
        id: 6,
        url: '../admin/my/my'
      },
      {
        id: 7,
        url: '../admin/my/my'
      },
      {
        id: 8,
        url: '../admin/my/my'
      }
    ]
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
    //新闻列表
    var newUrl = app.globalData.shopUrl + '/home/index/index/ty/new';

    util.http(newsOneUrl, this.callback);
    util.http(newsTwoUrl, this.newsTwoCallback);
    util.http(jumpUrl, this.jumpCallBack);
    util.http(swiperUrl, this.swiperCallback);
    util.http(couponUrl, this.couponCallback);
    util.http(newUrl, this.newCallback);
  },
  onShow(){
    //获取用户id
    var uid = wx.getStorageSync('uid');
    this.setData({ uid });
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
    var datas = res.data.data.new;
    this.setData({ detailsList: datas });
  },
  onBlur(event) {
    let val = event.detail.value;
    if(val!==''){
      var historyUrl = app.globalData.shopUrl + '/home/sousuo/index/ty/xw/de/' + val;
      util.http(historyUrl, this.historycallback);
      let history;
      history = this.data.historyArray;
      history.push(val);
      wx.setStorageSync('history', history)
      this.setData({
        searchShow: false
      })
      this.onHistoryArray();
    }
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
    that.data.historyArray = wx.getStorageSync('history');
    let length = that.data.historyArray.length;
    for (let i = 0; i < length; i++) {
      if ('' == that.data.historyArray[i]) {
        that.data.historyArray.splice(i, 1)
      }
    }
    that.setData({
      historyArray: that.data.historyArray
    })
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
    var idx = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '../find/news/newslist/newslist?id=' + idx
    })
  },
  //搜索
  historycallback(res) {
    if(res.data.data.new.length!==0){
      var newsArray = res.data.data.new;
      this.setData({ detailsList: newsArray });
    }else{
      let noContent = this.data.noContent,
        hasContent = this.data.hasContent;
      this.setData({noContent:true,hasContent:false});
    }
  }
})