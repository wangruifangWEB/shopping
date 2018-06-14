var app = getApp();
var util = require('../../../utils/util.js');
var WxParse = require("../../../wxParse/wxParse.js")
Page({
  data: {
    'activeList': []
  },
  onLoad: function (options) {
    this.setData({bid: options.id });
  },
  onShow(){
    //判断用户是否登录
    var uid = wx.getStorageSync('uid');
    this.setData({ uid });
    //BD展示列表
    var url = app.globalData.shopUrl + '/home/bdnew/index/ty/xsxq/bid/123/uid/123' + '/bid/' + this.data.bid;
    util.http(url, this.callback);
  },
  callback(res){
    var activeList=res.data.data.addr[0];
     WxParse.wxParse('article', 'html', activeList.content, this, 5);
     this.setData({
       'activeList': activeList
     })
     //设置当前内容标题
     wx.setNavigationBarTitle({
       title: this.data.activeList.title
     })
  },
  formSubmit: function (e) {
    var userMsg = e.detail.value;
    //验证非空
    if (userMsg.companyName == '' || userMsg.userName == '' || userMsg.userTel == '' ) {
      //提示用户内容不能为空
      app.showModal('内容不能为空！', '');
    } else {
      var sumbitUrl = app.globalData.shopUrl + '/home/bdnew/index/ty/lx/uid/' + this.data.uid + '/cname/'+ userMsg.companyName + '/name/' + userMsg.userName + '/tel/' + userMsg.userTel+'/bid/'+this.data.bid;
      util.http(sumbitUrl, this.sumbitcallback);
    }
  },
   sumbitcallback(res){
    if(res.data){
      //提示用户上传留言成功
      util.showToast('留言提交成功！', 'success');
    }else{
      //提示用户上传留言失败
      util.showModal('网络错误，请稍后重试！', '');
    }
  },
   onShareAppMessage: function (res) {
     if (res.from === 'button') {
       // 来自页面内转发按钮
       // console.log(res.target)
     }
     return {
       title: 'BD展示详情',
       path: 'pages/find/bdDetails/bdDetails',
       success: function (res) {
         // 转发成功
         util.showToast('分享成功!', 'success');
       },
       fail: function (res) {
         // 转发失败
         util.showToast('分享失败!', 'error');
       }
     }
   }
})