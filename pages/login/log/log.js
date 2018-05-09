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
                  console.log(res);
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
    wx.getSetting({
      success: (res) => {
        res.authSetting = {
          "scope.userInfo": true,
          "scope.userLocation": true
        }
      }
    })
    wx.login({
      success: function (res) {
        var code = res.code;
        console.log(code)
        wx.request({
          url: 'http://z.cn/api/v1/token/wx',
          data: {
            code: code
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          success: function (res) {
            console.log(res.data);
            wx.setStorageSync('token', res.data.token);
          },
          fail: function (res) {
            console.log(res.data);
          }
        })
      }
    })
  },
  formSubmit(e) {
    var userTel = e.detail.value.phoneNumber;
    var userPsd = e.detail.value.psd;
    if (userTel == '' || userPsd == '') {
      utils.showModal('内容不能为空！', '请填写手机号或密码');
    } else {
      var loginUrl = app.globalData.shopUrl + '/home/login/index/ty/login/tel/' + userTel + '/pass/' + userPsd;
      utils.formHttp(loginUrl, 'GET', 'application/x-www-form-urlencoded', this.callback);
    }
  },
  callback(res) {
    var requestStatus = res.data.data.uid;
    if (requestStatus) {
      utils.showToast('登录成功!', 'success');
      //设置缓存记录登录状态
      wx.setStorageSync('uid', requestStatus);
      this.backParameter();
    } else {
      utils.showToast('登录失败,请注册后登录!', 'none');
    }
  },
  onRegister() {
    wx.navigateTo({
      url: '../register/register',
    })
  },
  backParameter: function () {
    //用户登录成功上个页面缓存更新
    var uid = wx.getStorageSync('uid');
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({uid});
    wx.navigateBack();
  },
  // login() {
  //   var that = this;
  //   wx.login({
  //     success: function (res) {
  //       if (res.code) {
  //         wx.request({
  //           url: 'https://xcxu.we-fs.com/index.php/api/goods/openid?code=' + res.code + '&appid=' + app.globalData.appid + '&secret=' + app.globalData.secret,
  //           success: function (re) {
  //             console.log(re);
  //             app.globalData.appid = re.data.openid;
  //             var openid=re.data.openid;
  //             var session_key = re.data.session_key;
  
  //             wx.request({
  //               url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + app.globalData.appid + '&secret=' + app.globalData.secret + '&js_code=' + res.code+'&grant_type=authorization_code',
  //               method: 'GET',
  //               success: function (res) {
  //                 console.log(res);
  //               }
  //             })
  //           }
  //         })
  //       }
  //     }
  //   })
  // }
})