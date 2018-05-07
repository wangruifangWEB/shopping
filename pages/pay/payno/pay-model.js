import { Base } from '../../../utils/base.js'

class PayNo extends Base {
  constructor() {
    super()
  }

  getOrders(id, callback) {
    var param = {
      url: 'product/' + id,
      sCallback(res) {
        callback && callback(res)
      }
    }
    this.request(param)
  };
  getPayNoList() {
    // 读取购物车的产品id 获取购物车数据
    let CartListNum = []
    this.getStorage('cartBus', function (res) {
      for (let i = 0; i < res.length; i++) {
        CartListNum[i] = res[i].id
      }
      CartListNum = CartListNum.toString()
    })

    let PayNoList = {


      'PayNoList': [
        
          {
            'id': 1,
            'title': '文艺复古系列豹纹眼框',
            'rule': '大',
            'img': '/images/pay-list.png',
            'number': 5,
            'price': 99,
            'oldPrice': 123,
            'select': 1

          },
          {
            'id': 2,
            'title': '哈哈',
            'rule': '中',
            'img': '/images/pay-list.png',
            'number': 2,
            'price': 25,
            'oldPrice': 123,
            'select': 1

          }
      ],
      'totalPrice':99,
      'price':107,
      'addressPrice':10,
      'couponPrice':2


    }
      
      
    // 缓存

    this.setStorage('PayNoList', PayNoList)

  }
}

export { PayNo }