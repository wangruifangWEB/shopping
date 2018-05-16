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
    var that=this;
    // 唤起授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              wx.getUserInfo({
                success: function (res) {
                  wx.login({
                    success: function (res) {
                      var url = 'https://mypro.51cmo.net/home/loginWx/index'+res.code;
                      if (res.code) {
                        wx.request({
                          url: 'https://mypro.51cmo.net/home/loginWx/index',
                          method: 'POST',
                          data: {
                            code: res.code
                          },
                          header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                          },
                          success: function (res) {
                            var openid = res.data.openid;
                            var url = 'https://mypro.51cmo.net/home/loginWx/reg/opid/' + openid;
                            utils.http(url,that.openidcallback);
                          },
                          fail: function (res) {
                            // console.log(res.data);
                          }
                        })
                      }
                    }
                  })
                }
              })
            },
            fail() {
              console.log(fail);
            }
          })
        }else{
          wx.showModal({
            title: '警告',
            content: '你没有授权微信登录，如需要使用微信登录需在微信【发现】——【小程序】——删掉该小程序，从新搜索授权登录，方可使用。',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: function (res) {
                    if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                      wx.getUserInfo({
                        success: function (res) {
                          var userInfo = res.userInfo
                          var nickName = userInfo.nickName
                          var avatarUrl = userInfo.avatarUrl
                          var gender = userInfo.gender //性别 0：未知、1：男、2：女
                          var province = userInfo.province
                          var city = userInfo.city
                          var country = userInfo.country
                          wx.setStorage({
                            key: 'user',
                            data: res.userInfo,
                          })
                        }
                      })
                    }
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
    wx.getSetting({
      success: (res) => {
        res.authSetting = {
          "scope.userInfo": true,
          "scope.userLocation": true
        }
      }
    })
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
    if (!res.data) {
      app.showToast('登录失败,请注册后登录!', 'none');
    } else {
      var requestStatus = res.data.data.uid;
      wx.getUserInfo({
        success: function (res) {
          console.log(res.userInfo);
          wx.setStorageSync('user', res.userInfo)
        }
      })
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
  openidcallback(res){  
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
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({ uid });
  }
})