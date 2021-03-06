var app = getApp();
var utils = require('../../../utils/util.js');
import { Register } from 'modifyTicket-model.js'
let register = new Register();
Page({
  data: {
    notice: true
  },
  onLoad: function (options) {
    //获取用户id
    var uid = wx.getStorageSync('uid');
    var invoiceMsg = wx.getStorageSync('invoiceMsg');
    var fid = invoiceMsg.id;
    this.setData({ uid, invoiceMsg, fid });
  },
  formSubmit: function (e) {
    var userMsg = e.detail.value,
     companyName = userMsg.companyName,
     identCode = userMsg.identCode,
     address = userMsg.address,
     tel = userMsg.tel,
     bank = userMsg.bank,
     account = userMsg.account;
    this.setData({ companyName, identCode, address, tel, bank, account });

    //判断用户输入信息
    if (companyName == '' || identCode == '' || address == '' || bank == '' || account == '') {
      app.showModal('', '内容不能为空！');
      return false;
    } else if ("" == register.trim(tel) || !(/^1[0-9]{10}$/.test(tel))) {
      register.showToast('手机号为空或格式不正确', 'none', 1000)
      return false;
    } else {
      var url = app.globalData.shopUrl + '/home/zpzz/index/ty/zpu/uid/' + this.data.uid + '/cn/' + companyName + '/nsr/' + identCode + '/ra/' + address + '/rt/' + tel + '/bk/' + bank + '/bkh/' + account + '/fid/' + this.data.fid;
      utils.formHttp(url, 'POST', 'application/x-www-form-urlencoded', this.callback);
    }
  },
  notice() {
    if (this.data.notice) {
      this.setData({ notice: false });
    } else {
      this.setData({ notice: true });
    }
  },
  callback(res) {
    if (!res.data) {
      //用户提示
      app.showModal('', '修改失败，请重试！');
    } else {
      var invoiceMsg = {
        id: this.data.fid,
        cname: this.data.companyName,
        taxpayer: this.data.identCode,
        regaddress: this.data.address,
        regtel: this.data.tel,
        bankname: this.data.bank,
        bankaccount: this.data.account
      }
      wx.setStorageSync('invoiceMsg', invoiceMsg);
      //返回上一个页面
      wx.navigateBack({});
    }
  }
})