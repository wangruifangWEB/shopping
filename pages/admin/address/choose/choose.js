var app = getApp();
var utils = require('../../../../utils/util.js');
Page({
  data: {
    yzm: false,
    currentTab: 0,
    startX: 0, //开始坐标
    startY: 0
  },
  onLoad: function (options) {
    var uid = wx.getStorageSync('uid');
    this.setData({ uid});
  },
  onShow() {
    var addrUrl = app.globalData.shopUrl + '/home/user/index/ty/addr/uid/' + this.data.uid;
    utils.http(addrUrl, this.addrManage);
  },
  onagree(e) {
    //获取当前地址id
    let did = e.currentTarget.dataset.idx;
    const index = e.currentTarget.dataset.id; // 获取data- 传进来的index
    let address = this.data.address;                 // 地址列表
    const n = address[index].name;
    const t = address[index].tel;
    const s = address[index].sheng;
    const ss = address[index].shi;
    const x = address[index].xian;
    const d = address[index].dizhi;
    this.setData({n,t,s,ss,x,d,index});
    //修改默认地址
    var defaultAddrChange = app.globalData.shopUrl + '/home/address/index/ty/u/uid/' + this.data.uid + '/aid/' + did + '/n/' + n + '/s/' + s + '/ss/' + ss + '/x/' + x + '/d/' + d + '/t/' + t + '/m/1';
    utils.http(defaultAddrChange, this.defaultAddrChangecallback);
  },
  //收货地址 
  addrManage(res) {
    var address = res.data.data.addr;
    if (address.length !== 0) {
      wx.setStorageSync('addressId', address[0].id)
      //缓存默认地址
      wx.setStorageSync('address', address[0])
      this.setData({ address });
    }
  },
  //修改地址
  modifyAddress(e) {
    var currentIdx = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '../../address/edit/edit?currentIdx=' + currentIdx
    })
  },
  addAddr() {
    wx.navigateTo({
      url: '../../address/add/add'
    })
  },
  //修改默认地址
  defaultAddrChangecallback(res) {
    if (!res.data) {
      utils.showToast('网络错误,请重试!', 'none');
    }else{
      let addressMsg = {
        name: this.data.n,
        tel: this.data.t,
        dizhi: this.data.d,
        sheng: this.data.s,
        shi: this.data.ss,
        xian: this.data.x
      };
      //更新缓存地址
      wx.setStorageSync('address', addressMsg)
      //更新页面状态
      this.setData({
        currentTab: this.data.index
      })
    }
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.address.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      bdArray: this.data.address
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.address.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      address: that.data.address
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del(e) {
    var aid = e.currentTarget.dataset.idx;
    var currentTarget = e.currentTarget.dataset.index;
    this.setData({ aid, currentTarget });
    var removeUrl = app.globalData.shopUrl + '/home/address/index/ty/d/uid/' + this.data.uid + '/aid/' + aid;
    utils.http(removeUrl, this.removeItemcallback);
  },
  removeItemcallback(res) {
    if (res.data) {
      this.data.address.splice(this.data.currentTarget, 1)
      this.setData({
        address: this.data.address
      });
      utils.showToast('删除成功!', '');
      //检查是否删完所有地址
      if (this.data.address.length == 0) {
        wx.setStorageSync('address', 0)
        wx.setStorageSync('addressId', 0)
      }
    } else {
      utils.showToast('网络错误,请重试!', 'none');
    }
  }
})