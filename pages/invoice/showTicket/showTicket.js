var app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
    disabled: true
  },
  onLoad: function (options) {
    var uid = wx.getStorageSync('uid');
    this.setData({uid});
  },
  onShow(){
    var invoiceMsg = wx.getStorageSync('invoiceMsg');
    this.setData({ invoiceMsg });
  },
  modify() {
    wx.navigateTo({
      url: '../../invoice/modifyTicket/modifyTicket',
    })
  },
  removeMsg() {
    var url = app.globalData.shopUrl + '/home/zpzz/index/ty/zpd/uid/' + this.data.uid + '/fid/' + this.data.invoiceMsg.id;
    util.http(url, this.callback);
  },
  callback(res){
    if(res.data){
      util.showModal('', '删除成功！');    
    }else{
      app.showModal('', '删除失败，请重试！');
    }
  }
})