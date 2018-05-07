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
    wx.setNavigationBarTitle({
      title: '登录',
    });
  },
  onlogin() {
    // 唤起授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              wx.getUserInfo({
                success: function (res) {

                }
              })
            },
            fail() {
              wx.showModal({
                title: '警告',
                content: '你没有授权微信登录，如需要使用微信登录需在微信【发现】——【小程序】——删掉【全时旅游】，从新搜索授权登录，方可使用。',
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
          })
        }
      }
    })
    // wx.getSetting({
    //   success: (res) => {
    //     res.authSetting = {
    //       "scope.userInfo": true,
    //       "scope.userLocation": true
    //     }
    //   }
    // })
    // wx.login({
    //   success: function (res) {
    //     var code = res.code;
    //     console.log(code)
    //     wx.request({
    //       url: 'http://z.cn/api/v1/token/wx',
    //       data: {
    //         code: code
    //       },
    //       method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //       success: function (res) {
    //         console.log(res.data);
    //         wx.setStorageSync('token', res.data.token);
    //       },
    //       fail: function (res) {
    //         console.log(res.data);
    //       }
    //     })
    //   }
    // })
  },
  formSubmit(e) {
    var userTel = e.detail.value.phoneNumber;
    var userPsd = e.detail.value.psd;
    if (userTel == '' || userPsd == '') {
      utils.showModal('内容不能为空！', '请填写手机号或密码');
    } else {
      var loginUrl = 'http://192.168.11.240/home/login/index/ty/login/tel/' + userTel + '/pass/' + userPsd;
      utils.http(loginUrl, this.callback);
    }
  },
  callback(res) {
    var requestStatus = res.data;
    if (requestStatus) {
      utils.showToast('登录成功!', 'success');
    } else {
      utils.showToast('登录失败,请注册后登录!', 'none');
    }
  },
  onRegister() {
    wx.navigateTo({
      url: '../register/register',
    })
  }
})