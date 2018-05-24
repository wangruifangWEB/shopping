import { News } from 'news-model.js'
let news = new News();
var app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {},
  onLoad: function (options) {
    //新闻列表
    var newUrl = app.globalData.shopUrl + '/home/index/index/ty/new';
    util.http(newUrl, this.newCallback);
  },
  onOneNewsList(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'newslist/newslist?id=' + id
    })
  },
  newCallback(res) {
    var detailsList = res.data.data.new;
    this.setData({ detailsList });
  },
  jump(e) {
    var src = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../find/news/newslist/newslist?id=' + id
    })
  }
})