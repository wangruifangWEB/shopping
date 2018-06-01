import initCalendar from '../../tpls/calendarTemplate/index';
var util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    signDay: '',
    signText: '',
    hiddenLoading:false
  },
  onLoad: function () {
    //获取用户id
    var uid = wx.getStorageSync('uid');
    this.setData({ uid });
    //积分兑换列表
    var pointsListUrl = app.globalData.shopUrl + '/home/jifen/index/ty/jis';
    util.http(pointsListUrl, this.pointsListcallback);
    //拥有积分
    var userUrl = app.globalData.shopUrl + '/home/user/index/ty/user/uid/' + uid;
    util.http(userUrl, this.userMsg);
    //签到日历初始化
    initCalendar();
    //当前时间获取                    
    this.signStatus();
  },
  onShow() {
    //签到列表
    var signListUrl = app.globalData.shopUrl + '/home/qiandao/index/ty/qd/uid/' + this.data.uid + '/lsqd/' + this.data.initDate;
    util.http(signListUrl, this.signShowcallback);
    this.setData({ signListUrl });
  },
  // 签到
  onSignIn() {
    //获取当前时间
    this.signStatus();
    //今日签到
    var signUrl = app.globalData.shopUrl + '/home/qiandao/index/ty/qda/uid/' + this.data.uid + '/sj/' + this.data.date;
    util.http(signUrl, this.signIncallback);
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
  //签到列表初始化
  signShowcallback(res){
    if(res.data){
      let signText = this.data.signText,
          signList = res.data.data.qd,
          dateList = [],
          arr = [];
      for (let i in signList) {
        dateList.push(signList[i].addtime);
      }
      //判断用户当前签到状态
      if (this.getSameNum(this.data.date, dateList)) {
        this.setData({ signText: "已签" });
      } else {
        this.setData({ signText: '签到' });
      }
      //循环签到列表
      for (var i in signList) {
        let addtime = signList[i].addtime;
        var days = addtime.slice(8, );
        if (days.charAt(0) == '0') {
          var days = addtime.slice(9, );
        }
        arr.push(Number(days));
      }

        this.setData({ hiddenLoading:true, arr });

        //缓存签到天数
        wx.setStorageSync('signDays', arr);

        //更新签到显示
        this._signDay();
        
    } else {
      app.showToast('网络错误，请重试！', 'none');
    }
  },
  //签到列表
  signListcallback(res) {
    let signText = this.data.signText,
        signList = res.data.data.qd,
        dateList = [];
    for (let i in signList) {
      dateList.push(signList[i].addtime);
    }
    if (this.getSameNum(this.data.date, dateList)) {
      this.setData({ signText: "已签" });
      //提示签到结果
      app.showToast('签到成功！', '');
    } else {
      this.setData({ signText: '签到' });
    }
    if (res.data) {
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
    } else {
      app.showToast('网络错误，请重试！', 'none');
    }
  },
  _signDay() {
    let that = this;
    initCalendar();
    let arr = wx.getStorageSync('signDays');
    let dayArr = that.data.calendar.days;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < dayArr.length; j++) {
        if (arr[i] == dayArr[j].day) {
          dayArr[j].choosed = true;
        }
      }
    }
    that.setData({
      "calendar.days": dayArr
    })
  },
  //获取签到时间
  signStatus() {
    let date = [];
    let initDate, initDay;
    date.year = new Date().getFullYear();
    date.month = new Date().getMonth() + 1;
    date.day = new Date().getDate();
    this.setData({ initDay: date.day - 1 });
    if (date.month < 10) {
      date.month = '0' + date.month;
    }
    if (date.day < 10) {
      date.day = '0' + date.day;
    }
    date = date.year + '-' + date.month + '-' + date.day;
    initDate = date.slice(0, -3);
    this.setData({ date, initDate });
  },
  signcallback(res) {
    let signText = this.data.signText;
    if (res.data) {
      signText = "已签";
      this.setData({ signText });
    }
  },
  signIncallback(res) {
    let signText = this.data.signText;
    if (res.data == '已签到') {
      app.showToast('今日已签到！', '');
    } else {
      //更新签到列表
      util.http(this.data.signListUrl, this.signListcallback);
    }
  },
  //获取数组中相同数个数
  getSameNum(val, arr) {
    arr = arr.filter(function (value) {
      return value == val;
    })
    return arr.length;
  }
});
