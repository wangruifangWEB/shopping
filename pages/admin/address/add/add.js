
var app = getApp();
var util = require('../../../../utils/util.js');
Page({
  data: {
    yzm: false,
    agree: false,
    region: ['北京市', '北京市', '东城区'],
    m: 0//是否设置为默认地址
  },
  onLoad: function (options) {
    //获取缓存uid
    var uid = wx.getStorageSync('uid');
    this.setData({ uid });
  },
  onagree() {
    if (!this.data.agree) {
      this.setData({
        agree: true,
        m: 1
      })
    } else {
      this.setData({
        agree: false,
        m: 0
      })
    }
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  formSubmit: function (e) {
    let userMsg = e.detail.value,
      n = userMsg.userName,
      t = userMsg.userTel,
      address = this.data.region,
      uid = this.data.uid,
      province = this.data.region[0],
      city = this.data.region[1],
      town = this.data.region[2],
      detailsAddr = userMsg.userDetailsAddress;
    //验证手机格式
    if (!(/^1[34578]\d{9}$/.test(userMsg.userTel))) {
      util.showToast('手机号格式不正确！', 'none');
       return false;
    } else if (userMsg.userName == '' || userMsg.userTel == '' || address == '' || detailsAddr == '') {
      //提示用户内容不能为空
      util.showToast('错误提示', '内容不能为空！');
      return false;
    } else {
      //请求路径
      var addrUrl = app.globalData.shopUrl + '/home/address/index/ty/a/uid/' + uid + '/n/' + n + '/t/' + t + '/s/' + province + '/ss/' + city + '/x/' + town + '/d/' + detailsAddr + '/m/' + this.data.m;
      util.formHttp(addrUrl, 'POST', 'application/x-www-form-urlencoded', this.callback);
    }
  },
  callback(res) {
    if (res.data) {
      util.showModal('地址填写成功!', '');
    } else {
      util.showToast('网络错误,请重试!', 'error');
    }
  }
})