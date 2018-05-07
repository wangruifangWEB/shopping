import { Register } from 'register-model.js'
let register = new Register();
var app = getApp();
var utils = require('../../../utils/util.js');
Page({
  data: {
    yzm: false,
    yzmText: "获取验证码",
    agree: true,
    registerBtn: ''
  },
  onLoad: function (options) { },
  // 获取验证码
  onyzm() {
    wx.showToast({
      title: '验证码已发送',
    });
    //验证码倒计时显示
    this.timer();
  },

  // 用户协议
  onagree() {
    if (this.data.agree) {
      this.setData({
        agree: false,
        registerBtn: true
      })
    } else {
      this.setData({
        agree: true,
        registerBtn: false
      })
    }
  },
  formSubmit(e) {
    //获取用户输入值
    let password = e.detail.value.password;
    let phoneNumber = e.detail.value.phoneNumber;
    let subPassword = e.detail.value.subPassword;
    let user = e.detail.value.user;
    let yzm = e.detail.value.yzm;
    
    // 判断账号是否为空和判断该账号名是否被注册  
    if ("" == register.trim(user)) {
      register.showToast('用户名不得为空', 'none', 1000)
      return;
    }
    // 判断手机号是否为空
    if ("" == register.trim(phoneNumber) || !(/^1[0-9]{10}$/.test(phoneNumber))) {
      register.showToast('手机号为空或格式不正确', 'none', 1000)
      return;
    }
    // 判断密码是否为空  
    if ("" == register.trim(password) || !(/^[0-9A-Za-z]{6,}$/.test(password))) {
      register.showToast('密码为空或格式不正确', 'none', 1000)
      return;
    }
    // 判断验证码是否为空
    if ("" == register.trim(yzm)) {
      register.showToast('验证码不得为空', 'none', 1000)
      return;
    }
    // 两个密码必须一致  
    if (subPassword != password) {
      register.showToast('两次密码必须一致', 'none', 1000)
      return;
    }
    //所有数据有效则向后台传值
    let registerUrl = app.globalData.shopUrl + '/home/login/index/ty/reg/tel/' + phoneNumber + '/pass/' + subPassword + '/nick/' + user;

    var method = 'GET';

    var contentType = "application/x-www-form-urlencoded";

    utils.formHttp(registerUrl, method, contentType, this.callback);
  },
  callback(res, method, contentType) {
    var status = res.data;
    if (status == 1) {
      utils.showToast('注册成功!', 'success');
      wx.navigateBack({})
    } else if (status == 222) {
      utils.showToast('该用户已注册', 'error');
    } else {
      utils.showToast('登录失败,请重试!', 'none');
    }
  },
  timer() {
    var that = this;
    var time = Math.floor(new Date().getTime() / 1000) + 60
    var time2 = Math.floor(new Date().getTime() / 1000)
    var timer;
    var interval = setInterval(function () {
      timer = time - Math.floor(new Date().getTime() / 1000)
      that.setData({
        yzmText: timer + ' s',
        yzm: true,
      })
      if (timer < 0) {
        that.setData({
          yzm: false,
          yzmText: "获取验证码",
        })
        clearInterval(interval);
      }
    }, 1000)
  }
})