var app = getApp();
var utils = require('../../../utils/util.js');
import { Register } from 'addingTicket-model.js'
let register = new Register();
Page({
  data: {
    notice: true
  },
  onLoad: function (options) {
    //获取用户id
    var uid = wx.getStorageSync('uid');
    this.setData({ uid });
  },
  formSubmit: function (e) {
    var userMsg = e.detail.value;
    var companyName = userMsg.companyName;
    var identCode = userMsg.identCode;
    var address = userMsg.address;
    var tel = userMsg.tel;
    var bank = userMsg.bank;
    var account = userMsg.account;
    //获取用户输入信息
    if (companyName == '' || identCode == '' || address == '' || bank == '' || account == '') {
      //提示用户内容不能为空
      app.showModal('', '内容不能为空！');
    } else if ("" == register.trim(tel) || !(/^1[0-9]{10}$/.test(tel))) {
      register.showToast('手机号为空或格式不正确', 'none', 1000)
      return;
    } else {
      var url = app.globalData.shopUrl + '/home/zpzz/index/ty/zpa/uid/' + this.data.uid + '/cn/' + companyName + '/nsr/' + identCode + '/ra/' + address + '/rt/' + tel + '/bk/' + bank + '/bkh/' + account;
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
      app.showModal('添加失败，请稍后重试！', '');
    } else {
      app.showModal('增票信息添加成功！', '');
      //返回上一页
      wx.navigateBack({})
    }
  }
})