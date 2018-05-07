import { Shop } from 'shop-model.js'
let shop = new Shop();
var app = getApp();
var utils = require('../../../utils/util.js');
Page({
  data: {
  },
  onLoad: function (options) {
    //商品列表
    var url = app.globalData.shopUrl + '/home/goods/index/ty/shop';
    utils.http(url, this.callback);
    //轮播图
    var swiperUrl = app.globalData.shopUrl + '/home/index/index/ty/imglun';
    utils.http(swiperUrl, this.swiperCallback);
  },
  onOneShop(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../integration/integration?id=' + id,
    })
  },
  //轮播图
  swiperCallback(res) {
    var imgSrc = res.data.data.imglun;
    this.setData({ imgSrc });
  },
  callback(res) {
    var listGoods = res.data.data.goods;
    this.setData({ listGoods });
  },
})