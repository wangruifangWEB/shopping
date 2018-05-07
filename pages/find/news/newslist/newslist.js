var app = getApp();
var util = require('../../../../utils/util.js');
var WxParse = require("../../../../wxParse/wxParse.js")
Page({
  data: {
    'activeList': [],
    imgUrl: ''
  },
  onLoad: function (options) {
    let url = app.globalData.shopUrl + '/home/news/index/ty/new/id/' + options.id;
    console.log(url);
    util.http(url, this.callback);
  },
  callback(res) {
    console.log(res);
    var activeList = res.data.data.new[0];
    WxParse.wxParse('article', 'html', activeList.content, this, 5);
    this.setData({
      'activeList': activeList,
      imgUrl: activeList.picy
    })
    wx.setNavigationBarTitle({
      title: this.data.activeList.title
    })
  }
})