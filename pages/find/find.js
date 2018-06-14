var app = getApp();
var utils = require('../../utils/util.js');
Page({
  data: {
    list: []
  },
  onLoad: function (options) {
    //轮播图
    var swiperUrl = app.globalData.shopUrl + '/home/index/index/ty/imglun';
    utils.http(swiperUrl, this.swiperCallback);

    //新闻资讯(注意：此接口要改)
    var newsUrl = app.globalData.shopUrl + '/home/faxian/index/ty/fx';
    utils.http(newsUrl, this.newsCallback);
  },

  onShop() {
    wx.navigateTo({
      url: 'shop/shop',
    })
  },
  onNews() {
    wx.navigateTo({
      url: 'bd/bd',
    })
  },
  onActive() {
    wx.navigateTo({
      url: 'active/active',
    })
  },
  onOneActive(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../find/findlist/findlist?id=' + id,
    })
  },
  //轮播图
  swiperCallback(res) {
    var imgSrc = res.data.data.imglun;
    this.setData({ imgSrc });
  },
  newsCallback(res){
    var datas = res.data.data.imggg;
    this.setData({ list: datas });
  }
})