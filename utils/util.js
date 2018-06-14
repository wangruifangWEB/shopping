//后台请求
function http(url, callback) {
  wx.request({
    url: url,
    method: "POST",
    header: {
      "Content-Type": "application/json" // 默认值
    },
    success: function (res) {
      callback(res);
    }
  })
}
//表单提交
function formHttp(url, method, contentType, callback) {
  wx.request({
    url: url,
    method: method,
    header: {
      "Content-Type": contentType // 默认值
    },
    success: function (res) {
      callback(res);
    }
  })
}
//用户模态框提示
function showModal(titles, content) {
  wx.showModal({
    title: titles,
    content: content,
    success: function (res) {
      if (res.confirm) {
        // console.log('用户点击确定');
        wx.navigateBack({})
      } else if (res.cancel) {
        // console.log('用户点击取消')
      }
    }
  })
}
//用户加载提示
function showToast(titles, icon) {
  wx.showToast({
    title: titles,
    icon: icon,
    duration: 2000
  })
  setTimeout(function () {
    wx.hideLoading()
  }, 3000)
}


//点击确定跳转指定页面
function showTitle(titles, content,url){
  wx.showModal({
    title: titles,
    content: content,
    success: function (res) {
      if (res.confirm) {
        wx.navigateTo({
          url:url
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}


module.exports = {
  http: http,
  showModal: showModal,
  showToast: showToast,
  showTitle: showTitle,
  formHttp: formHttp
}

