var app = getApp();
var util = require('../../../../utils/util.js');
var WxParse = require("../../../../wxParse/wxParse.js")
Page({
  data: {
    'activeList': [],
    imgUrl: ''
  },
  onLoad: function (options) {
    let id = options.id;
    var url = app.globalData.shopUrl + '/home/faxian/index/ty/xq/fid/' + options.id;
    util.http(url, this.callback);
  },
  callback(res) {
    var activeList = res.data.data.xq[0];
    console.log(activeList);
    WxParse.wxParse('article', 'html', activeList.content, this, 5);
    this.setData({
      'activeList': activeList,
      imgUrl: activeList.picy
    })
    wx.setNavigationBarTitle({
      title: this.data.activeList.keyword,
    })
  }
})