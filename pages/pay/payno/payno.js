// pages/pay/sendno/sendno.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow(){
   
  },
  //  待付款
  onPay() {
    wx.navigateTo({
      url: '../payno/payno',
    })
  },
  //  待发货
  onSend() {
    wx.navigateTo({
      url: '../sendno/sendno',
    })
  },
  //  待收货
  onReceive() {
    wx.navigateTo({
      url: '../receiveno/receiveno',
    })
  },
  //  已完成
  onComplete() {
    wx.navigateTo({
      url: '../complete/complete',
    })
  }
})