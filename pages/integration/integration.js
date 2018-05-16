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
  // 立即兑换
  onBuyNow() {
    if (!this.data.uid) {
      utils.showToast('请登录，登录后即可领取！', 'none');
    } else {
      var buyUrl = app.globalData.shopUrl + '/home/jifen/index/ty/dh/uid/' + this.data.uid + '/gid/' + +this.data.gid;
      utils.http(buyUrl, this.onbuyNowcallback);
    }
  },
  //提交
  submission(e) {
    var aid = e.currentTarget.dataset.aid;
    wx.navigateTo({
      url: '../pay/payorders/pay-orders?aid=' + aid + '&uid=' + this.data.uid + '&goodsCount=' + this.data.buyNum
    })
  },
  callback(res) {
    var goodsArray = res.data.data.goods[0];
    WxParse.wxParse('article', 'html', goodsArray.content, this, 5);
    this.setData({ goodsArray });
  },
  //猜你喜欢
  likecallback(res) {
    var likeArray = res.data.data.like;
    this.setData({ likeArray });
  },
  onbuyNowcallback(res) {
    var integartionStatus = res.data;
    if (integartionStatus == 1) {
      //加入订单
      var orderUrl = app.globalData.shopUrl + '/home/jifen/index/ty/ooa/uid/' + this.data.uid + '/gid/' + +this.data.gid;
      utils.http(orderUrl, this.ordercallback);
      
    } else if (integartionStatus == '积分不够') {
      utils.showToast('积分不够兑换该商品!', 'none');
    } else {
      utils.showToast('网络错误，请重试！', 'none');
    }
  },
  ordercallback(res) {
    if(res.data){
      utils.showToast('商品兑换成功，待收货中查看详情!', 'none');
    }else{
      utils.showToast('网络错误，请重试！', 'none');
    }
  },
  onOneShop(e) {
    let id = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '../integration/integration?id=' + id,
    })
  }
})