import { Goods } from 'goods-model.js'
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
    hiddenLoading: false
  },
  onLoad: function (options) {
    //将此商品id缓存
    wx.setStorageSync('goodsId', options.id);
    var that = this;
    var uid = wx.getStorageSync('uid');
    this.setData({ uid });
    var url = app.globalData.shopUrl + '/home/goods/index/ty/shop/id/' + options.id;
    var likeUrl = app.globalData.shopUrl + '/home/goods/index/ty/like';
    utils.http(url, that.callback);
    utils.http(likeUrl, that.likecallback);
  },
  onShow() {
    var TotalNumberGoods = wx.getStorageSync('TotalNumberGoods');
    if (TotalNumberGoods) {
      this.setData({ TotalNumberGoods });
    } else {
      var cartCountUrl = app.globalData.shopUrl + '/home/car/index/ty/num/uid/' + this.data.uid;
      utils.http(cartCountUrl, this.cartCountcallback);
    }
  },
  changeAutoplay(e) {
    this.setData({
      current: e.detail.current
    })

  },
  // 加入购物车
  onAddGoods(e) {
    let aid = e.currentTarget.dataset.id;
    let goodsId = e.currentTarget.dataset.id
    if (this.data.uid) {
      this.setData({ aid, goodsId });
      var addGoodsUrl = app.globalData.shopUrl + '/home/car/index/ty/a/gid/' + aid + '/uid/' + this.data.uid;
      utils.http(addGoodsUrl, this.addGoodscallback);
    } else {
      utils.showToast('没有登录，请先登录!', 'none');
    }

  },
  // 点击购物车
  onCart() {
    if (this.data.uid) {
      wx.navigateTo({
        url: '../cart/cart',
      })
    } else {
      utils.showToast('没有登录，请先登录!', 'none');
    }
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
  //提交
  submission(e) {
    var aid = e.currentTarget.dataset.aid;
    wx.navigateTo({
      url: '../pay/payorders/pay-orders?aid=' + aid + '&uid=' + this.data.uid + '&goodsCount=' + this.data.buyNum
    })
  },
  // 购买数量
  onDown() {
    let num = this.data.buyNum
    num--;
    if (num == 1) {
      this.setData({
        classNum: true,
      });
    };
    if (num < 1) {
      this.setData({
        buyNum: 1,
        classNum: true,
      });
      wx.showToast({
        title: '数量最少为1',
        icon: 'none'
      });
    } else {
      this.setData({
        buyNum: num,
      })
    }
  },
  onUp() {
    let num = this.data.buyNum
    num++
    this.setData({
      buyNum: num,
      classNum: false,
    })
  },
  callback(res) {
    if(res.data){
      var goodsArray = res.data.data.goods[0];
      WxParse.wxParse('article', 'html', goodsArray.content, this, 5);
      this.setData({ hiddenLoading:true, goodsArray });
    }else{
      utils.showToast('网络出错，请检查网络!', 'none');
    }
  },
  addGoodscallback(res) {
    if (res.data) {
      let that = this;
      let TotalNumberGoods = Number(that.data.TotalNumberGoods) + 1
      setTimeout(() => {
        that.setData({
          isShake: true,
          cartBus: false,
          TotalNumberGoods: TotalNumberGoods,
        });
        setTimeout(() => {
          that.setData({
            isShake: false,
          });
        }, 200);
      }, 300);
      wx.showToast({
        title: '添加成功',
        icon: 'none'
      });
    }
  },
  cartCountcallback(res) {
    if(res.data){
      var TotalNumberGoods = res.data.data.num;
      this.setData({ TotalNumberGoods });
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
      url: '../goods/goods?id=' + id,
    })
  },
  //商品轮播图
  bannercallback(res){
   let bannerList=res.data.data;
   this.setData({ bannerList});
  }
})