var app = getApp();
var utils = require('../../../utils/util.js');
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
    this.setData({
      currentIndex: e.currentTarget.dataset.idx
    });
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
    console.log(userInput);
    let choicedType = '';
    if (this.data.currentIndex == 0 && this.data.objIndex == 0 && this.data.contentIndex == 0) {
      console.log('不开发票');
      this.setData({ choicedType: '不开发票' });
      this.prevPage();
    } else if (this.data.currentIndex == 0 && this.data.contentIndex == 1 && this.data.objIndex == 0) {
      console.log('普通发票');
      this.setData({ fid: 2, choicedType: '普通发票' });
      this.ordinaryTicketPersonal();
    } else if (this.data.contentIndex == 1 && this.data.currentIndex == 0 && this.data.objIndex == 1) {
      console.log('普通发票-公司');
      let companyName = userInput.companyName;
      let companyNum = userInput.companyNum;
      this.setData({ companyName, companyNum });
      this.ordinaryCompanyTicket();
    } else {
      var sn = userInput.userName;
      var st = userInput.userTel;
      var sd = userInput.userAddr;
      console.log('增值发票');
      this.setData({ fid: 2, choicedType: '增值发票', sn, st, sd });
      //调用增值发票
      this.valueAddTicket();
    }
  },
  //普通发票-个人
  ordinaryTicketPersonal() {
    var url = app.globalData.shopUrl + '/home/order/index/ty/oou_f/uid/' + this.data.uid + '/oid/' + this.data.oid + '/fapiao/' + this.data.fid;
    console.log(url);
    utils.http(url, this.ticketcallback);
  },
  ticketcallback(res) {
    console.log(res);
    if (res.data) {
      this.prevPage();
    } else {
      utils.showToast('网络错误,请重试!', 'none');
    }
  },
  //普通发票-公司
  ordinaryCompanyTicket() {
    var url = app.globalData.shopUrl + '/home/fapiao/index/ty/pt/uid/' + this.data.uid + '/gid/' + this.data.goodsId + '/cn/' + this.data.companyName + '/nsr/' + this.data.companyNum;
    utils.http(url, this.companycallback);
  },
  companycallback(res) {
    if (res.data !== 0) {
      this.prevPage();
    } else {
      utils.showToast('网络错误,请重试!', 'none');
    }
  },
  //增值发票
  valueAddTicket() {
    var url = app.globalData.shopUrl + '/home/fapiao/index/ty/zzz/uid/' + this.data.uid + '/gid/' + this.data.goodsId + '/oid/' + this.data.oid + '/st/' + this.data.st + '/sn/' + this.data.sn + '/sd/' + this.data.sd;
    console.log(url)
    utils.http(url, this.valueAddTicketcallback);
  },
  valueAddTicketcallback(res) {
    if (res.data !== 0) {
      this.prevPage();
    } else {
      utils.showToast('网络错误,请重试!', 'none');
    }
  },
  prevPage() {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      choicedType: this.data.choicedType
    })
    wx.navigateBack();
  },
  valueAddcallback(res) {
    var userMessage = res.data.data.or;
    this.setData({ userMessage });
  },
})