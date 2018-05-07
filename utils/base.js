class Base{
  constructor(){
    this.baseRequestUrl = ''
  }

  requset(pararms,sCallback){
    let url = this.baseRequestUrl + pararms.url
    if (!params.type) {
      params.type = 'GET'
    }
    wx.request({
      url: '',
      data: pararms.data,
      method: params.type,
      header:{
        'content-type': 'application/xml',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        params.sCallback && params.sCallback(res.data)
      },
      fail: function (err) {
        console.log(err)
      },
    })
  }

  // 去前后空格 
  trim(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
  }
  con(){
    console.log(123)
  }
  // 提示错误信息  
  isError(msg, that){
    that.setData({
      showTopTips: true,
      errorMsg: msg
    })
  }
  //清楚掉错误信息
  clearError(that) {
    that.setData({
      showTopTips: false,
      errorMsg: ""
    })
  }
  showToast(msg, icon, time){
    wx.showToast({
      title: msg,
      icon: icon,
      duration: time
    })  
  }
  getStorage(key,sCallback){
    wx.getStorage({
      key: key,
      success:function(res){
        sCallback && sCallback(res.data)
      }
    })
  }
  setStorage(key, data) {
    wx.setStorage({
      key: key,
      data: data,
    })
  }

}

export {Base}