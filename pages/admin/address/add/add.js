
var app = getApp();
var util = require('../../../../utils/util.js');
Page({
  data: {
    yzm: false,
    agree: true,
    region: ['北京市', '北京市', '东城区'],
    m: 1//是否设置为默认地址
  },
  onLoad: function (options) {
    var uid = wx.getStorageSync('uid');
    this.setData({ uid });
  },
  onagree() {
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
    this.setData({
      region: e.detail.value
    })
  },
  formSubmit: function (e) {
    let userMsg = e.detail.value;
    let n = userMsg.userName;
    let t = userMsg.userTel;
    let address = this.data.region;
    let uid = this.data.uid;
    let province = this.data.region[0];
    let city = this.data.region[1];
    let town = this.data.region[2];
    let detailsAddr = userMsg.userDetailsAddress;
    //验证手机格式
    if (!(/^1[34578]\d{9}$/.test(userMsg.userTel))) {
       util.showModal('', '手机号格式不正确！');
       return;
    //填写信息项不能为空
    } else if (userMsg.userName == '' || userMsg.userTel == '' || address == '' || detailsAddr == '') {
      //提示用户内容不能为空
      util.showModal('错误提示', '内容不能为空！');
    } else {
      //请求路径
      var addrUrl = app.globalData.shopUrl + '/home/address/index/ty/a/uid/' + uid + '/n/' + n + '/t/' + t + '/s/' + province + '/ss/' + city + '/x/' + town + '/d/' + detailsAddr + '/m/' + this.data.m;
      util.formHttp(addrUrl, 'POST', 'application/x-www-form-urlencoded', this.callback);
    }
  },
  callback(res) {
    var requestStatus = res.data;
    if (requestStatus) {
      util.showToast('地址修改成功!', '');
      wx.navigateBack({})
    } else {
      util.showToast('网络错误,请重试!', 'none');
    }
  }
})