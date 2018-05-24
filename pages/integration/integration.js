import { Goods } from 'integration-model.js'
let goods = new Goods();
var app = getApp();
var utils = require('../../utils/util.js');
var WxParse = require("../../wxParse/wxParse.js")
Page({
  data: {
    current: '',
    isShake: true,
    cartBus: true,
    fixbg: true,
    isTop: false,
    buyNum: 1,
    classNum: true
  },
  onLoad: function (options) {
    //将此商品id缓存
    wx.setStorageSync('goodsId', options.id);
    var that = this;
    var uid = wx.getStorageSync('uid');
    this.setData({ uid, gid: options.id });

    var url = app.globalData.shopUrl + '/home/goods/index/ty/shop/id/' + options.id;
    var likeUrl = app.globalData.shopUrl + '/home/goods/index/ty/like';
    utils.http(url, that.callback);
    utils.http(likeUrl, that.likecallback);
  },
  onShow() {
    var TotalNumberGoods = wx.getStorageSync('TotalNumberGoods');
    this.setData({ TotalNumberGoods });
  },
  //提交
  submission(e) {
    if (!this.data.uid) {
      utils.showToast('请登录，登录后即可领取！', 'none');
    } else {
      var aid = e.currentTarget.dataset.idx;
      wx.navigateTo({
        url: '../pay/paygoods/paygoods?aid=' + aid + '&goodsCount=' + this.data.buyNum
      })
    }
  },
  callback(res) {
    var goodsArray = res.data.data.goods[0];
    // console.log(goodsArray);
    WxParse.wxParse('article', 'html', goodsArray.content, this, 5);
    this.setData({ goodsArray });
  },
  //猜你喜欢
  likecallback(res) {
    var likeArray = res.data.data.like;
    this.setData({ likeArray });
  },
  onOneShop(e) {
    let id = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '../integration/integration?id=' + id,
    })
  }
})