var app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
    bdArray: [],
    searchVal: ''
  },
  onLoad: function (options) {

  },
  onShow: function () {
    //判断用户是否登录
    var uid = wx.getStorageSync('uid');
    this.setData({ uid });
    //BD展示列表
    var url = app.globalData.shopUrl + '/home/bdnew/index/ty/xs';
    util.http(url, this.callback);
  },
  callback(res) {
    let bdArray = res.data.data.addr;
    this.setData({ bdArray });
  },
  // 发表新文章
  releaseNews() {
    if (this.data.uid) {
      wx.navigateTo({
        url: '../newArticle/newArticle',
      })
    } else {
      util.showToast('请登录后发表文章！', 'none');
    }
  },
  //查看详情
  bdDetails(e) {
    let id = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '../bdDetails/bdDetails?id=' + id,
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: 'BD展示',
      path: 'pages/find/bd/bd',
      success: function (res) {
        // 转发成功
        util.showToast('分享成功!', 'success');
      },
      fail: function (res) {
        // 转发失败
        util.showToast('分享失败!', 'error');
      }
    }
  },
  //获取用户输入值
  userInputValue: function (e) {
    this.setData({
      searchVal: e.detail.value
    })
  },
  //获取用户搜索内容
  search: function () {
    var tem = [];
    for (var i = 0; i < this.data.bdArray.length; i++) {
      var re = new RegExp(this.data.searchVal);
      if (re.test(this.data.bdArray[i].title)) {
        tem.push(this.data.bdArray[i]);
      }
    }
    this.setData({
      bdArray: tem,
      searchVal:''
    })
  },
})