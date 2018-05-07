var util = require('../../../../utils/util.js');
var app = getApp();
Page({
  data: {
    yzm: false,
    agree: true,
    region: [],
    m: 1
  },
  onLoad: function (options) {
    //获取该地址id
    var aid = options.currentIdx;
    //获取用户id
    var uid = wx.getStorageSync('uid');
    this.setData({ uid, aid });
    var initUrl = app.globalData.shopUrl + '/home/address/index/ty/up/uid/' + this.data.uid + '/aid/' + this.data.aid;
    util.formHttp(initUrl, 'POST', 'application/x-www-form-urlencoded', this.initcallback);
  },
  onagree(e) {
    if (this.data.agree) {
      this.setData({
        agree: false,
        registerBtn: true,
        m: 0
      })
    } else {
      this.setData({
        agree: true,
        registerBtn: false,
        m: 1
      })
    }
  },
  bindRegionChange: function (e) {
    var address = e.detail.value;
    this.setData({
      region: e.detail.value,
      address
    })
  },
  //保存编辑地址
  formSubmit: function (e) {
    let userMsg = e.detail.value;
    let n = userMsg.userName;
    let t = userMsg.userTel;
    let address = this.data.address;
    let uid = this.data.uid;
    let aid = this.data.aid;
    let province = this.data.region[0];
    let city = this.data.region[1];
    let town = this.data.region[2];
    let d = userMsg.userDetailsAddress;
    //验证非空
if (userMsg.userName == '' || userMsg.userTel == '' || address == '' || userMsg.userDetailsAddress == '') {
      //提示用户内容不能为空
      util.showModal('错误提示', '内容不能为空！');
    } else {
      //请求传值
    var addrUrl = app.globalData.shopUrl + '/home/address/index/ty/u/uid/' + uid + '/aid/' + aid + '/n/' + n + '/t/' + t + '/s/' + province + '/ss/' + city + '/x/' + town + '/d/'+ d +'/m/' + this.data.m;
      util.formHttp(addrUrl, 'POST', 'application/x-www-form-urlencoded', this.callback);
    }
  },
  callback(res) {
    var requestStatus = res.data;
    if (requestStatus) {
      util.showToast('地址修改成功!', '');
    } else {
      util.showToast('网络错误,请重试!', 'none');
    }
  },
  initcallback(res) {
    var addr = res.data.data.addr[0];
    var initChoiced = [];
    var sheng = addr.sheng;
    var shi = addr.shi;
    var xian = addr.xian;
    initChoiced.push(sheng, shi, xian);
    this.setData({ addr, region:initChoiced });
  }
})