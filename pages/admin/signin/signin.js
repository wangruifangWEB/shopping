import initCalendar from '../../tpls/calendarTemplate/index';
var util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    signDay: '',
    arr: []
  },
  onLoad: function () {
    //获取签到状态
    var signText = wx.getStorageSync('signText');
    //获取用户id
    var uid = wx.getStorageSync('uid');
    console.log(uid);
    this.setData({ uid,signText });
    //积分兑换列表
    var pointsListUrl = app.globalData.shopUrl + '/home/jifen/index/ty/jis';
    util.http(pointsListUrl, this.pointsListcallback);
    //拥有积分
    var userUrl = app.globalData.shopUrl + '/home/user/index/ty/user/uid/' + uid;
    util.http(userUrl, this.userMsg);
    //签到列表
    var signListUrl = app.globalData.shopUrl + '/home/qiandao/index/ty/qd/uid/' + uid;
    util.http(signListUrl, this.signListcallback);
  },
  // 签到
  onSignIn() {
    let date = [];
    date.year = new Date().getFullYear();
    date.month = new Date().getMonth() + 1;
    date.day = new Date().getDate();
    if (date.month < 10) {
      date.month = '0' + date.month;
    }
    if (date.day < 10) {
      date.day = '0' + date.day;
    }
    date = date.year + date.month + date.day;
    //今日签到
  var signUrl = app.globalData.shopUrl + '/home/qiandao/index/ty/qda/uid/' + this.data.uid + '/sj/' + date;
    util.http(signUrl, this.signcallback);
  },
  shop() {
    wx.navigateTo({
      url: '../../find/shop/shop',
    })
  },
  //积分兑换
  pointsListcallback(res) {
    var pointsList = res.data.data.sp;
    this.setData({ pointsList });

  },
  //查看更多
  viewMore() {
    wx.navigateTo({
      url: '../../find/shop/shop',
    })
  },
  //用户积分
  userMsg(res) {
    var integration = res.data.data.user[0].inte;
    this.setData({ integration });
  },
  //积分兑换
  inteDetails(e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '../../integration/integration?id=' + id,
    })
  },
  //签到列表
  signListcallback(res) {
    var signList = res.data.data.qd;
    console.log(signList);
    let arr = [];
    for (var i in signList) {
      let addtime = signList[i].addtime;
      var days = addtime.slice(8, );
      if (days.charAt(0) == '0') {
        var days = addtime.slice(9, );
      }
      arr.push(Number(days));
    }
    this.setData({ arr });
    wx.setStorageSync('signDays', arr);
    this._signDay();
  },
  //今日签到
  signcallback(res) {
    console.log(res);
    if (res.data) {
      wx.showToast({
        title: '签到成功',
        icon: 'success',
        duration: 1000
      });
      let signText = "已签";
      wx.setStorageSync('signText', signText);
      this.setData({
        signText
      });
    }
  },
  _signDay() {
    let that = this;
    initCalendar();
    let arr = wx.getStorageSync('signDays');
    console.log(arr);
    let dayArr = that.data.calendar.days;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < dayArr.length; j++) {
        if (arr[i] == dayArr[j].day) {
          dayArr[j].choosed = true;
          console.log(dayArr[j].choosed)
        }
      }
    }
    that.setData({
      "calendar.days": dayArr
    })
  },
});