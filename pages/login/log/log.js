var app = getApp();
import { Base } from '../../../utils/base.js';
var utils = require('../../../utils/util.js');
Page({
  data: {
    yzm: false,
    agree: true,
    registerBtn: ''
  },
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo });
    }
  },
  onlogin() {
    //获取用户openid
    let openid=wx.getStorageSync('openid');
    //获取用户id
    let url = 'https://mypro.51cmo.net/home/loginWx/reg/opid/' + openid;
    utils.http(url, this.openidcallback);
  },
  formSubmit(e) {
    var userTel = e.detail.value.phoneNumber;
    var userPsd = e.detail.value.psd;
    if (userTel == '' || userPsd == '') {
      app.showModal('内容不能为空！', '请填写手机号或密码');
      return false;
    } else {
      var loginUrl = app.globalData.shopUrl + '/home/login/index/ty/login/tel/' + userTel + '/pass/' + userPsd;
      utils.formHttp(loginUrl, 'GET', 'application/x-www-form-urlencoded', this.callback);
    }
  },
  callback(res) {
    console.log(res);
    if (!res.data) {
      app.showToast('登录失败,请注册后登录!', 'none');
    } else {
      var requestStatus = res.data.data.uid;
      utils.showToast('登录成功!', 'success');
      //设置缓存记录登录状态
      wx.setStorageSync('uid', requestStatus);
      this.backParameter();
      //返回上一页
      wx.navigateBack({})
    }
  },
  onRegister() {
    wx.navigateTo({
      url: '../register/register',
    })
  },
  openidcallback(res) {
    if (!res.data) {
      utils.showToast('网络错误,请稍后重试!', 'none');
    } else {
      var uid = res.data.data.uid;
      //设置缓存记录登录状态
      wx.setStorageSync('uid', uid);
      this.backParameter();
      //返回上一页
      wx.navigateBack({})
    }
  },
  backParameter: function () {
    //用户登录成功上个页面缓存更新
    var uid = wx.getStorageSync('uid');
    console.log(uid);
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({ uid });
  }
})