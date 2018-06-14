var app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {

  },
  onLoad: function (options) {
    //判断用户是否登录
    var uid = wx.getStorageSync('uid');
    this.setData({ uid });
  },
  formSubmit: function (e) {
    var userMsg = e.detail.value;
    //验证非空
    if (userMsg.title == '' || userMsg.desc == '' || userMsg.content == '') {
      //提示用户内容不能为空
      app.showModal('内容不能为空！', '');
    } else {
      var sumbitUrl = app.globalData.shopUrl + '/home/bdnew/index /ty/a/uid/' + this.data.uid + '/t/' + userMsg.title + '/d/' + userMsg.desc + '/content/' + userMsg.content;
      util.http(sumbitUrl, this.sumbitcallback);
    }
  },
  sumbitcallback(res) {
    if (res.data) {
      //提示用户上传留言成功
      util.showModal('文章发布成功！', '');
    } else {
      //提示用户上传留言失败
      util.showModal('网络错误，请稍后重试！', '');
    }
  }
})