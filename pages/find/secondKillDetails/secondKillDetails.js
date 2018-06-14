import { Goods } from 'goods-model.js'
let goods = new Goods();
var app = getApp();
var utils = require('../../../utils/util.js');
var WxParse = require("../../../wxParse/wxParse.js")
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
    let endtime = options.endtime;
    this.setData({ endtime });
    //将此商品id缓存
    wx.setStorageSync('goodsId', options.id);
    var that = this;
    var uid = wx.getStorageSync('uid');
    this.setData({ uid });
    var url = app.globalData.shopUrl + '/home/xsms/index/ty/xq/gid/' + options.id;
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
        url: '../../cart/cart',
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
      url: '../../pay/paySecondKill/paySecondKill?aid=' + aid + '&uid=' + this.data.uid + '&goodsCount=' + this.data.buyNum
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
    if (res.data) {
      var goodsArray = res.data.data.mssp;
      console.log(goodsArray);
      WxParse.wxParse('article', 'html', goodsArray.content, this, 5);
      this.setData({ goodsArray });
      
      // 执行倒计时函数
      this.countDown();
    } else {
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
    if (res.data) {
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
      url: '../secondKillDetails/secondKillDetails?id=' + id,
    })
  },
  //商品轮播图
  bannercallback(res) {
    let bannerList = res.data.data;
    this.setData({ bannerList });
  },
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown() {//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTime = new Date(this.timestampToTime(this.data.endtime));
    let obj = null;
    // 如果活动未结束，对时间进行处理
    if (endTime - newTime > 0) {
      let time = (endTime - newTime) / 1000;
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      obj = {
        day: this.timeFormat(day),
        hou: this.timeFormat(hou),
        min: this.timeFormat(min),
        sec: this.timeFormat(sec)
      }
    } else {//活动已结束，全部设置为'00'
      obj = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }
    }
    let goodsArray = this.data.goodsArray;
    goodsArray.obj = obj;
    this.setData({ hiddenLoading: true, goodsArray });
    // 渲染，然后每隔一秒执行一次倒计时函数
    setTimeout(this.countDown, 1000);
  },
  timestampToTime: function (timestamp) {
    let date = new Date(timestamp * 1000),//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      Y = date.getFullYear() + '-',
      M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
      D = date.getDate() + ' ',
      h = date.getHours() + ':',
      m = date.getMinutes() + ':',
      s = date.getSeconds();
    return Y + M + D + h + m + s;
  }
})