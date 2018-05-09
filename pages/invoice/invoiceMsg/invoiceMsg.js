var app = getApp();
var utils = require('../../../utils/util.js');
import { Register } from 'invoiceMsg-model.js'
let register = new Register();
Page({
  data: {
    invoiceType: ['普通发票', '增值税专用发票'],
    invoiceObj: ['个人', '单位'],
    invoiceContent: ['不开发票', '商品明细'],
    contentList: ['发票内容将显示详细商品名称与价格信息', '发票内容将显示本单商品所属类别(电气电子产品及配件/生活服务/图书/日用品/服装鞋帽/饮品饮料/日化用品/通讯器材及配件/医药健康品)及价格信息'],
    currentIndex: 0,
    objIndex: 0,
    contentIndex: 0,
    isStatus: 0, //是否符合增税人身份
    choicedType: ''
  },
  onLoad: function (options) {
    //获取后台缓存数据
    var uid = wx.getStorageSync('uid');
    var goodsId = wx.getStorageSync('goodsId');
    this.setData({ uid, oid: options.oid, goodsId });
    //请求个人增值票信息
    var url = app.globalData.shopUrl + '/home/fapiao/index/ty/zz/uid/' + this.data.uid + '/gid/' + this.data.goodsId;
    utils.http(url, this.valueAddcallback);
  },
  invoiceType(e) {
    let index = e.currentTarget.dataset.idx;
    this.setData({ index });
    if (!this.data.userMessage){
      this.setData({ currentIndex:0 });
    }else{
      this.setData({ currentIndex: index });
    }
  },
  invoiceObj(e) {
    this.setData({
      objIndex: e.currentTarget.dataset.idx
    })
  },
  invoiceContent(e) {
    this.setData({
      contentIndex: e.currentTarget.dataset.idx
    })
  },
  choicedTicketcallback(res) {
    console.log(res);
  },
  formSubmit(e) {
    let userInput = e.detail.value;
    if (this.data.currentIndex == 0 && this.data.contentIndex == 0 && this.data.objIndex == 0) {
      wx.setStorageSync('choicedType', '不开发票')
      wx.navigateBack({})
    } else if (this.data.currentIndex == 0 && this.data.contentIndex == 1 && this.data.objIndex == 0) {
      this.setData({ fid: 2 });
      this.ordinaryTicketPersonal();
    } else if (this.data.contentIndex == 1 && this.data.currentIndex == 0 && this.data.objIndex == 1) {
      let companyName = userInput.companyName;
      let companyNum = userInput.companyNum;
      this.setData({ fid: 2, companyName, companyNum });
      this.ordinaryCompanyTicket();
    } else {
      var sn = userInput.userName;
      var st = userInput.userTel;
      var sd = userInput.userAddr;
      //提示用户内容不能为空
      if (sn == '' || st == '' || sd == '') {
        app.showModal('', '内容不能为空！');
        return false;
        //验证手机格式
      } else if ("" == register.trim(st) || !(/^1[0-9]{10}$/.test(st))) {
        register.showToast('手机号为空或格式不正确', 'none', 1000)
        return false;
      }
      //设置
      this.setData({ fid: 2, sn, st, sd });
      //调用增值发票
      this.valueAddTicket();
    }
  },
  //普通发票-个人
  ordinaryTicketPersonal() {
    var url = app.globalData.shopUrl + '/home/order/index/ty/oou_f/uid/' + this.data.uid + '/oid/' + this.data.oid + '/fapiao/' + this.data.fid;
    console.log('普通发票个人：' + url);
    utils.http(url, this.ticketcallback);
  },
  ticketcallback(res) {
    if (res.data) {
      this.data.choicedType = '开发票';
      wx.setStorageSync('choicedType', '开发票')
      //返回上一页
      wx.navigateBack({})
    } else {
      utils.showToast('网络错误,请重试!', 'none');
    }
  },
  //普通发票-公司
  ordinaryCompanyTicket() {
    if (this.data.companyName == '' || this.data.companyNum == '') {
      app.showModal('', '内容不能为空！');
    } else {
      var url = app.globalData.shopUrl + '/home/fapiao/index/ty/pt/uid/' + this.data.uid + '/gid/' + this.data.goodsId + '/cn/' + this.data.companyName + '/nsr/' + this.data.companyNum;
      console.log('普通发票公司：' + url);
      utils.http(url, this.companycallback);
    }
  },
  companycallback(res) {
    if (res.data !== 0) {
      this.data.choicedType = '开发票';
      wx.setStorageSync('choicedType', '开发票')
      //返回上一页
      wx.navigateBack({})
    } else {
      utils.showToast('网络错误,请重试!', 'none');
    }
  },
  //增值发票
  valueAddTicket() {
    var url = app.globalData.shopUrl + '/home/fapiao/index/ty/zzz/uid/' + this.data.uid + '/gid/' + this.data.goodsId + '/oid/' + this.data.oid + '/st/' + this.data.st + '/sn/' + this.data.sn + '/sd/' + this.data.sd;
    console.log('增值发票：' + url)
    utils.http(url, this.valueAddTicketcallback);
  },
  valueAddTicketcallback(res) {
    console.log(res);
    if (res.data !== 0) {
      this.data.choicedType = '开发票';
      wx.setStorageSync('choicedType', '开发票')
      //返回上一页
      // wx.navigateBack({})
    } else {
      utils.showToast('网络错误,请重试!', 'none');
    }
  },
  valueAddcallback(res) {
    var userMessage = res.data.data.or;
    let currentIndex = this.data.currentIndex;
    if (!userMessage) {
      utils.showToast('请到个人中心添加增票资质信息!', 'none');
    } else {
      this.setData({ userMessage });
    }
  }
})