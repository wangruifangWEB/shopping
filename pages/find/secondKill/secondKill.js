var app = getApp();
var util = require('../../../utils/util.js');

Page({
  data: {
    secondKillList: [],
    countDownList: [],
    actEndTimeList: [],
    goodsList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断用户是否登录
    var uid = wx.getStorageSync('uid');
    this.setData({ uid });
    //秒杀展示列表
    var url = app.globalData.shopUrl + '/home/xsms/index/ty/msh';
    util.http(url, this.callback);
  },
  onShow: function () {

  },
  callback(res) {
    let secondKillList = res.data.data.xsms;
    this.setData({ secondKillList });
    let goodsList = [];
    for (var i in secondKillList) {
      let timeStamp = secondKillList[i].jss;
      goodsList.push(this.timestampToTime(timeStamp));
      this.setData({ goodsList });
    }

    // 执行倒计时函数
    this.countDown();
  },
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown() {//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = this.data.goodsList;
    let countDownArr = [];

    endTimeList.forEach(o => {
      let endTime = new Date(o).getTime();
      let obj = null;
      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0) {
        let time = (endTime - newTime) / 1000;
        // 获取天、时、分、秒
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        obj = {
          day: this.timeFormat(day),
          hou: this.timeFormat(hou),
          min: this.timeFormat(min),
          sec: this.timeFormat(sec)
        }
      } else {//活动已结束，全部设置为'00'
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00',
          end: true
        }
      }
      countDownArr.push(obj);
    })
    let secondKillList = this.data.secondKillList;
    for (var i in secondKillList) {
      secondKillList[i].obj = countDownArr[i];
    }
    this.setData({ secondKillList });
    // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({ countDownList: countDownArr })
    setTimeout(this.countDown, 1000);
  },

  onShareAppMessage: function () {

  },
  timestampToTime: function (timestamp) {
    let date = new Date(timestamp * 1000),//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      Y = date.getFullYear() + '-',
      M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
      D = date.getDate() + ' ',
      h = date.getHours() + ':',
      m = date.getMinutes() + ':',
      s = date.getSeconds();
    return Y + M + D + h + m + s;
  },
  //秒杀详情页
  secondKillDetails(e) {
    let id = e.currentTarget.dataset.idx;
    let endtime = e.currentTarget.dataset.endtime;
    wx.navigateTo({
      url: '../secondKillDetails/secondKillDetails?id=' + id + '&endtime=' + endtime,
    })
  }
})

