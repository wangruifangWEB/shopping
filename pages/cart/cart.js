
var app = getApp();
var utils = require('../../utils/util.js');
Page({
  data: {
    carts: [],               // 购物车列表
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: false,   // 全选状态，默认全选
    select: true,            //默认选中,
    totalNumber: 0,          //初始化结算总数
    displayDistage: false,
    hiddenLoading:false
  },
  onLoad: function (options) {
    var uid = wx.getStorageSync('uid');
    this.setData({ uid });
  },
  onShow() {
    var url = app.globalData.shopUrl + '/home/car/index/ty/car/uid/' + this.data.uid;
    utils.http(url, this.callback);
  },
  // 单个选中
  selectList(e) {
    const index = e.currentTarget.dataset.index; // 获取data- 传进来的index
    const ccid = e.currentTarget.dataset.ccid;
    let carts = this.data.carts;                 // 获取购物车列表
    const status = carts[index].status;      // 获取当前商品的选中状态
    carts[index].status = 1 - status;           // 改变状态
    let s = 1 - status;
    var selectedUrl = app.globalData.shopUrl + '/home/caror/index/ty/xz/uid/' + this.data.uid + '/ss/' + s + '/ccid/' + ccid;
    utils.http(selectedUrl, this.selectedcallback);
    this.setData({ carts,status });
  },
  // 全选
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus; // 是否全选状态
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].status = selectAllStatus;// 改变所有商品状态
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
     // 重新获取总价
    this.getTotalPrice();                           
  },
  // 增加数量
  addCount(e) {
    var currentId = e.currentTarget.dataset;
    var gid = currentId.id;
    this.setData({ currentId });
    var addCountUrl = app.globalData.shopUrl + '/home/car/index/ty/u/gid/' + gid + '/uid/' + this.data.uid + '/n/1';
    utils.http(addCountUrl, this.addCountcallback);
  },
  // 减少数量
  minusCount(e) {
    var currentIdx = e.currentTarget.dataset;
    var gid = currentIdx.id;
    this.setData({ currentIdx });
    const index = this.data.currentIdx.index;
    let carts = this.data.carts;
    let gnum = carts[index].gnum;
    if (gnum <= 1) {
      return false;
    } else {
      var minusCountUrl = app.globalData.shopUrl + '/home/car/index/ty/u/gid/' + gid + '/uid/' + this.data.uid + '/n/2';
      utils.http(minusCountUrl, this.minusCountcallback);
    }
  },
  //删除
  deleteList(e) {
    var gid = e.currentTarget.dataset.id;
    var dnum = e.currentTarget.dataset.num;
    this.setData({ e, dnum });
    var deleteListUrl = app.globalData.shopUrl + '/home/car/index/ty/d/gid/' + gid + '/uid/' + this.data.uid;
    utils.http(deleteListUrl, this.deleteListcallback);
     // 重新获取总价
    this.getTotalPrice();
  },
  getTotalPrice() {
    let carts = this.data.carts; // 获取购物车列表
    let total = 0;
    let count = 0;
    for (let i = 0; i < carts.length; i++) {  // 循环列表得到每个数据
      if (carts[i].status == 1) {                   // 判断选中才会计算价格
        total += carts[i].gnum * carts[i].zhejia;  // 所有价格加起来
        count += Number(carts[i].gnum);
      }
    }
    this.setData({// 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2),
      totalNumber: count
    });
  },
  // 结账
  onAccount() {
    let carts = this.data.carts; // 获取购物车列表
    let shopStatus = 0;
    for (var i in carts) {  // 循环列表得到每个数据 
      shopStatus += Number(carts[i].status);
    }
    if (shopStatus >= 1) {                // 判断选中才会计算价格
      var orderListUrl = app.globalData.shopUrl + '/home/caror/index/ty/xzo/uid/' + this.data.uid + '/ss/1';
      utils.http(orderListUrl, this.orderListcallback);
    } else {
      utils.showToast('您还没有选中商品!', 'none');
    }
  },
  callback(res) {
    if(res.data){
      var carts = res.data.data.car;
      let TotalNumberGoods = 0;
      let shopArray = [];
      for (var i in carts) {
        TotalNumberGoods += parseInt(carts[i].gnum);
        shopArray.push(carts[i].status);
      }
      if (this.getSameNum(1, shopArray) == shopArray.length) {
        this.setData({ selectAllStatus: true });
      }
      this.setData({ hiddenLoading: true, carts });
      //计算价格
      this.getTotalPrice();
      //设置缓存
      wx.setStorageSync('TotalNumberGoods', TotalNumberGoods)
    }else{
      utils.showToast('网络错误,请稍后重试!', 'none');
    }
  },
  minusCountcallback(res) {
    if (!res.data) {
      utils.showToast('网络错误,请稍后重试!', 'none');
    } else {
      const index = this.data.currentIdx.index;
      let carts = this.data.carts;
      let gnum = carts[index].gnum;
      if (gnum <= 1) {
        return false;
      } else {
        gnum = Number(gnum) - 1;
        carts[index].gnum = gnum;
        this.setData({ carts: carts });
        // 重新获取总价
        this.getTotalPrice();
        //更新缓存值
        var TotalNumberGoods = wx.getStorageSync('TotalNumberGoods');
        TotalNumberGoods -= 1
        wx.setStorageSync('TotalNumberGoods', TotalNumberGoods);
      }

    }
  },
  addCountcallback(res, e) {
    if (!res.data) {
      utils.showToast('网络错误,请稍后重试!', 'none');
    } else {
      const index = this.data.currentId.index;
      let carts = this.data.carts;
      let gnum = carts[index].gnum;
      gnum = Number(gnum) + 1;
      carts[index].gnum = gnum;
      this.setData({
        carts: carts
      });
      // 重新获取总价
      this.getTotalPrice();
      //更新缓存值
      var TotalNumberGoods = wx.getStorageSync('TotalNumberGoods');
      TotalNumberGoods += 1
      wx.setStorageSync('TotalNumberGoods', TotalNumberGoods);
    }
  },
  deleteListcallback(res) {
    if (res.data) {
      const index = this.data.e.currentTarget.dataset.index;
      let carts = this.data.carts;
      carts.splice(index, 1);  // 删除购物车列表里这个商品
      //更新缓存值
      var TotalNumberGoods = wx.getStorageSync('TotalNumberGoods');
      TotalNumberGoods -= this.data.dnum;
      wx.setStorageSync('TotalNumberGoods', TotalNumberGoods);

      this.setData({ carts: carts });
      if (!carts.length) {  // 如果购物车为空
        this.setData({
          hasList: false   //修改标识为false，显示购物车为空页面
        });
      } else {  // 如果不为空
        this.getTotalPrice();  // 重新计算总价格
      }
    } else {
      utils.showToast('网络错误,请稍后重试!', 'none');
    }
  },
  //选中商品
  selectedcallback(res) {
    if (!res.data) {
      utils.showToast('网络错误,请稍后重试!', 'none');
    } else {
      //根据用户选择更新所付价格及选中状态
      this.getSelected(this.data.carts);
    }
  },
  orderListcallback(res) {
    if (res.data) {
      wx.navigateTo({
        url: '../pay/payorder/payorder',
      })
    }
  },
  //获取数组中相同数个数
 getSameNum(val, arr){
    arr = arr.filter(function (value) {
      return value == val;
    })
    return arr.length;
  },
 getSelected(carts){
    let checkedArray = [];
    for (var i in carts) {
      checkedArray.push(carts[i].status);
    }
    if (this.getSameNum(1, checkedArray) == carts.length) {
      this.setData({ selectAllStatus: true });
    } else {
      this.setData({ selectAllStatus: false });
    }
    this.getTotalPrice();// 重新获取总价
  }
})