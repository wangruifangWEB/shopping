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
    let did = e.currentTarget.dataset.idx;
    this.setData({ did });
    if (this.data.oid) {
      var addressUrl = app.globalData.shopUrl + '/home/order/index/ty/oou/uid/' + this.data.uid + '/did/' + did + '/oid/' + this.data.oid;
      utils.http(addressUrl, this.addresscallback);
    } else {
      const index = e.currentTarget.dataset.id; // 获取data- 传进来的index
      let address = this.data.address;                 // 地址列表
      const n = address[index].name;
      const t = address[index].tel;
      const s = address[index].sheng;
      const ss = address[index].shi;
      const x = address[index].xian;
      const d = address[index].dizhi;
      var defaultAddrChange = app.globalData.shopUrl + '/home/address/index/ty/u/uid/' + this.data.uid + '/aid/' + did + '/n/' + n + '/s/' + s + '/ss/' + ss + '/x/' + x + '/d/' + d + '/t/' + t + '/m/1';
      utils.http(defaultAddrChange, this.defaultAddrChangecallback);
    }

    this.setData({
      currentTab: e.currentTarget.dataset.id
    })
  },
  //收货地址 
  addrManage(res) {
    var address = res.data.data.addr;
    wx.setStorageSync('addressId', address[0].id)
    this.setData({ address });
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
  //删除事件
  delItem: function (e) {
    var aid = e.currentTarget.dataset.idx;
    var currentTarget = e.currentTarget.dataset.index;
    this.setData({ aid, currentTarget });
    var removeUrl = app.globalData.shopUrl + '/home/address/index/ty/d/uid/' + this.data.uid + '/aid/' + aid;
    utils.http(removeUrl, this.removeItem);
  },
  removeItem(res) {
    if (res.data) {
      this.data.address.splice(this.data.currentTarget, 1)
      this.setData({
        address: this.data.address
      });
      utils.showToast('删除成功!', '');
    } else {
      utils.showToast('网络错误,请重试!', 'none');
    }
  },
  addresscallback(res) {
    if (!res.data) {
      utils.showToast('网络错误,请重试!', 'none');
    } else {
      var gid = wx.getStorageSync('goodsId');
      var addressModifyUrl = app.globalData.shopUrl + '/home/order/index/ty/oo/uid/' + this.data.uid + '/gid/' + gid;
      utils.http(addressModifyUrl, this.addressModifycallback);
    }
  },
  addressModifycallback(res) {
    if (!res.data) {
      utils.showToast('网络错误,请重试!', 'none');
    }
  },
  //修改默认地址
  defaultAddrChangecallback(res) {
    if(!res.data){
      utils.showToast('网络错误,请重试!', 'none');
    }
  }
})