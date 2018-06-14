var app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
  },
  onLoad: function (options) {
    this.setData({ bid: options.id });
  },
  onShow() {
    //判断用户是否登录
    var uid = wx.getStorageSync('uid');
    this.setData({ uid });
    //个人BD展示列表
    var url = app.globalData.shopUrl + '/home/bdnew/index/ty/up/uid/' + this.data.uid + '/bid/' + this.data.bid;
    util.http(url, this.callback);
  },
  callback(res) {
    let details = res.data.data.addr[0];
    this.setData({ details });
  },
  //删除文章
  del(e) {
    let bid = e.currentTarget.dataset.idx;
    //个人BD展示列表
    var delUrl = app.globalData.shopUrl + '/home/bdnew/index/ty/d/uid/' + this.data.uid + '/bid/' + bid;
    util.http(delUrl, this.delcallback);
  },
  delcallback(res) {
    if (res.data) {
      util.showModal('删除文章成功！', '');
    } else {
      util.showToast('网络错误，请重试！', 'none');
    }
  },
  //用户修改
  formSubmit: function (e) {
    var userMsg = e.detail.value;
    //验证非空
    if (userMsg.title == '' || userMsg.desc == '' || userMsg.content == '') {
      //提示用户内容不能为空
      app.showModal('内容不能为空！', '');
    } else {
      var modifyUrl = app.globalData.shopUrl + '/home/bdnew/index/ty/u/uid/' + this.data.uid + '/t/' + userMsg.title + '/d/' + userMsg.desc + '/content/' + userMsg.content + '/bid/' + this.data.bid;
      util.http(modifyUrl, this.modifycallback);
    }
  },
  modifycallback(res) {
    if (res.data) {
      //提示用户上传留言成功
      util.showModal('文章修改成功！', '');
    } else {
      //提示用户上传留言失败
      util.showModal('网络错误，请稍后重试！', '');
    }
  }
})