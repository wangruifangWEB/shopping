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
    classNum: true,
    hiddenLoading: false,
    inter: [],
    currentTab: 0
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
      utils.showToast('请登录，登录后即可兑换！', 'none');
    } else {
      var aid = e.currentTarget.dataset.idx;
      wx.navigateTo({
        url: '../pay/payInte/payInte?aid=' + aid + '&goodsCount=' + this.data.buyNum + '&payMethod=' + this.data.currentTab + '&jjq=' + this.data.jjq
      })
    }
  },
  callback(res) {
    if (res.data) {
      var goodsArray = res.data.data.goods[0];
      let inter = this.data.inter;
      //获取所需积分拼接
      let inte = goodsArray.inte;
      inte = inte + '积分';
      let jjq = goodsArray.jjq;
      jjq = jjq + '积分';
      //获取所需价格+积分拼接
      let jjq_q = goodsArray.jjq_q;
      jjq_q = '¥' + jjq_q;
      let jq = jjq + '+' + jjq_q;
      //获取折价拼接
      let zhejia = goodsArray.zhejia;
      zhejia = '¥' + zhejia;
      //将结果存入数组
      inter.push(inte, jq, zhejia);
      //解析富文本
      WxParse.wxParse('article', 'html', goodsArray.content, this, 5);
      this.setData({ hiddenLoading: true, goodsArray, inter, jjq});
    }
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
  },
  // 立即购买
  onBuyNow() {
    if (this.data.uid) {
      this.setData({
        fixbg: false,
        isTop: true,
      })
    } else {
      utils.showToast('没有登录，请先登录!', 'none');
    }
  },
  onX() {
    this.setData({
      fixbg: true,
      isTop: false,
    })
  },
  //选择购买方式
  choicedInter(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.id
    });
  }
})