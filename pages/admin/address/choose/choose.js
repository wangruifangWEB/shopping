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
    this.setData({ uid, oid: options.oid });
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
    //修改默认地址
    var defaultAddrChange = app.globalData.shopUrl + '/home/address/index/ty/u/uid/' + this.data.uid + '/aid/' + did + '/n/' + n + '/s/' + s + '/ss/' + ss + '/x/' + x + '/d/' + d + '/t/' + t + '/m/1';
    utils.http(defaultAddrChange, this.defaultAddrChangecallback);

    let addressMsg = {
      name: n,
      tel: t,
      dizhi: d,
      sheng: s,
      shi: ss,
      xian: x
    };
    //更新缓存地址
    wx.setStorageSync('address', addressMsg)
    //更新页面状态
    this.setData({
      currentTab: e.currentTarget.dataset.id
    })
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
  //删除地址
  delItem: function (e) {
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
  },
  //修改默认地址
  defaultAddrChangecallback(res) {
    if (!res.data) {
      utils.showToast('网络错误,请重试!', 'none');
    }
  }
})